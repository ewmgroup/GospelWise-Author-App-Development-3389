import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load projects for the current user
  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log('Fetching projects for user:', user.id);

      // Fetch all projects for the current user
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects_storywise')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        throw projectsError;
      }

      console.log('Projects fetched:', projectsData?.length || 0);

      if (!projectsData || projectsData.length === 0) {
        setProjects([]);
        setLoading(false);
        return;
      }

      // Fetch associated content for each project
      const projectsWithContent = await Promise.all(
        projectsData.map(async (project) => {
          try {
            if (project.type === 'fiction') {
              const { data: fictionContent, error: fictionError } = await supabase
                .from('fiction_content')
                .select('*')
                .eq('project_id', project.id)
                .single();

              if (fictionError) {
                if (fictionError.code === 'PGRST116') {
                  console.log(`No fiction content found for project ${project.id}, creating empty content`);
                  // No content found, create it
                  const { data: newContent, error: createError } = await supabase
                    .from('fiction_content')
                    .insert([{
                      project_id: project.id,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString()
                    }])
                    .select()
                    .single();

                  if (createError) {
                    console.error('Error creating fiction content:', createError);
                    return { ...project, content: {} };
                  }
                  return { ...project, content: newContent || {} };
                } else {
                  console.error('Error fetching fiction content:', fictionError);
                  return { ...project, content: {} };
                }
              }

              return { ...project, content: fictionContent || {} };
            } else {
              const { data: nonfictionContent, error: nonfictionError } = await supabase
                .from('nonfiction_content')
                .select('*')
                .eq('project_id', project.id)
                .single();

              if (nonfictionError) {
                if (nonfictionError.code === 'PGRST116') {
                  console.log(`No nonfiction content found for project ${project.id}, creating empty content`);
                  // No content found, create it
                  const { data: newContent, error: createError } = await supabase
                    .from('nonfiction_content')
                    .insert([{
                      project_id: project.id,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString()
                    }])
                    .select()
                    .single();

                  if (createError) {
                    console.error('Error creating nonfiction content:', createError);
                    return { ...project, content: {} };
                  }
                  return { ...project, content: newContent || {} };
                } else {
                  console.error('Error fetching nonfiction content:', nonfictionError);
                  return { ...project, content: {} };
                }
              }

              return { ...project, content: nonfictionContent || {} };
            }
          } catch (err) {
            console.error(`Error processing project ${project.id}:`, err);
            return { ...project, content: {} };
          }
        })
      );

      console.log('Projects with content:', projectsWithContent.length);
      setProjects(projectsWithContent);

      // Save to localStorage as backup
      localStorage.setItem('gospelwise_projects', JSON.stringify(projectsWithContent));
    } catch (error) {
      console.error('Error in fetchProjects:', error);
      // Load from localStorage as backup
      const savedProjects = localStorage.getItem('gospelwise_projects');
      if (savedProjects) {
        try {
          const parsed = JSON.parse(savedProjects);
          setProjects(parsed);
          console.log('Loaded projects from localStorage:', parsed.length);
        } catch (e) {
          console.error('Error parsing saved projects:', e);
          setProjects([]);
        }
      } else {
        setProjects([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    try {
      console.log('Creating new project:', projectData);

      // Create the main project
      const { data: project, error: projectError } = await supabase
        .from('projects_storywise')
        .insert([{
          user_id: user.id,
          title: projectData.title,
          type: projectData.type,
          genre: projectData.genre,
          description: projectData.description || '',
          target_audience: projectData.targetAudience || '',
          word_count_goal: projectData.wordCountGoal || null,
          progress: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (projectError) {
        console.error('Error creating project:', projectError);
        throw projectError;
      }

      console.log('Project created:', project);

      // Create associated content table entry with theme in the correct column
      const contentTable = projectData.type === 'fiction' ? 'fiction_content' : 'nonfiction_content';
      const contentInitialData = {
        project_id: project.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Add theme to the correct column based on project type
      if (projectData.type === 'fiction') {
        contentInitialData.theme = projectData.theme || '';
      } else {
        contentInitialData.core_themes = projectData.theme || '';
      }

      const { data: content, error: contentError } = await supabase
        .from(contentTable)
        .insert([contentInitialData])
        .select()
        .single();

      if (contentError) {
        console.error(`Error creating ${contentTable}:`, contentError);
        throw contentError;
      }

      console.log('Content created:', content);

      const newProject = { ...project, content };

      // Update local state
      setProjects(prev => [newProject, ...prev]);

      // Set as current project
      setCurrentProject(newProject);

      // Save to localStorage as backup
      const updatedProjects = [newProject, ...projects];
      localStorage.setItem('gospelwise_projects', JSON.stringify(updatedProjects));

      return newProject;
    } catch (error) {
      console.error('Error in createProject:', error);
      throw error;
    }
  };

  const updateProject = async (projectId, updates) => {
    try {
      console.log('Updating project:', projectId, updates);

      // Find the project in our state
      const project = projects.find(p => p.id === projectId);
      if (!project) {
        console.error('Project not found in state:', projectId);
        throw new Error('Project not found');
      }

      // Update main project data if necessary
      const projectUpdates = {};
      ['title', 'description', 'target_audience', 'word_count_goal', 'progress'].forEach(field => {
        if (field in updates) {
          projectUpdates[field] = updates[field];
        }
      });

      if (Object.keys(projectUpdates).length > 0) {
        console.log('Updating project fields:', projectUpdates);
        const { error: projectError } = await supabase
          .from('projects_storywise')
          .update({
            ...projectUpdates,
            updated_at: new Date().toISOString()
          })
          .eq('id', projectId);

        if (projectError) {
          console.error('Error updating project:', projectError);
          throw projectError;
        }
      }

      // Update content data
      const contentTable = project.type === 'fiction' ? 'fiction_content' : 'nonfiction_content';
      const contentUpdates = {};

      if (project.type === 'fiction') {
        // Map fiction content fields
        if (updates.premise !== undefined) contentUpdates.premise = updates.premise;
        if (updates.theme !== undefined) contentUpdates.theme = updates.theme;
        if (updates.faithElement !== undefined) contentUpdates.faith_element = updates.faithElement;
        if (updates.storyBeginning !== undefined) contentUpdates.story_beginning = updates.storyBeginning;
        if (updates.storyMiddle !== undefined) contentUpdates.story_middle = updates.storyMiddle;
        if (updates.storyEnd !== undefined) contentUpdates.story_end = updates.storyEnd;
        if (updates.readerTransformation !== undefined) contentUpdates.reader_transformation = updates.readerTransformation;
        if (updates.protagonist !== undefined) contentUpdates.protagonist = updates.protagonist;
        if (updates.protagonistGoals !== undefined) contentUpdates.protagonist_goals = updates.protagonistGoals;
        if (updates.protagonistFlaw !== undefined) contentUpdates.protagonist_flaw = updates.protagonistFlaw;
        if (updates.antagonist !== undefined) contentUpdates.antagonist = updates.antagonist;
        if (updates.antagonistMotivations !== undefined) contentUpdates.antagonist_motivations = updates.antagonistMotivations;
        if (updates.supportingCharacters !== undefined) contentUpdates.supporting_characters = updates.supportingCharacters;
        if (updates.setting !== undefined) contentUpdates.setting = updates.setting;
        if (updates.timePeriod !== undefined) contentUpdates.time_period = updates.timePeriod;
        if (updates.worldRules !== undefined) contentUpdates.world_rules = updates.worldRules;
        if (updates.conflict !== undefined) contentUpdates.conflict = updates.conflict;
        if (updates.stakes !== undefined) contentUpdates.stakes = updates.stakes;
        if (updates.spiritualElements !== undefined) contentUpdates.spiritual_elements = updates.spiritualElements;
        if (updates.storyStructure !== undefined) contentUpdates.story_structure = updates.storyStructure;
      } else {
        // Map nonfiction content fields
        if (updates.kingdomConcept !== undefined) contentUpdates.kingdom_concept = updates.kingdomConcept;
        if (updates.readerPersona !== undefined) contentUpdates.reader_persona = updates.readerPersona;
        if (updates.coreThemes !== undefined) contentUpdates.core_themes = updates.coreThemes;
        if (updates.sourceMaterial !== undefined) contentUpdates.source_material = updates.sourceMaterial;
        if (updates.holySpirit !== undefined) contentUpdates.holy_spirit = updates.holySpirit;
        if (updates.nonfictionStructure !== undefined) contentUpdates.nonfiction_structure = updates.nonfictionStructure;
      }

      if (Object.keys(contentUpdates).length > 0) {
        console.log('Updating content fields:', contentUpdates);

        // First check if content exists
        const { data: existingContent, error: checkError } = await supabase
          .from(contentTable)
          .select('*')
          .eq('project_id', projectId)
          .single();

        if (checkError && checkError.code === 'PGRST116') {
          // Content doesn't exist, create it
          console.log('No content found, creating new content record');
          const { error: insertError } = await supabase
            .from(contentTable)
            .insert([{
              project_id: projectId,
              ...contentUpdates,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }]);

          if (insertError) {
            console.error('Error creating content:', insertError);
            throw insertError;
          }
        } else {
          // Content exists, update it
          const { error: contentError } = await supabase
            .from(contentTable)
            .update({
              ...contentUpdates,
              updated_at: new Date().toISOString()
            })
            .eq('project_id', projectId);

          if (contentError) {
            console.error('Error updating content:', contentError);
            throw contentError;
          }
        }
      }

      // Update local state with all changes
      const updatedProject = {
        ...project,
        ...projectUpdates,
        content: {
          ...project.content,
          ...contentUpdates
        },
        updated_at: new Date().toISOString()
      };

      // Update the projects array
      const updatedProjects = projects.map(p => 
        p.id === projectId ? updatedProject : p
      );

      setProjects(updatedProjects);

      // Update current project if it's the one being edited
      if (currentProject && currentProject.id === projectId) {
        setCurrentProject(updatedProject);
      }

      // Save to localStorage as backup
      localStorage.setItem('gospelwise_projects', JSON.stringify(updatedProjects));

      console.log('Project updated successfully');
      return updatedProject;
    } catch (error) {
      console.error('Error in updateProject:', error);
      throw error;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      console.log('Deleting project:', projectId);

      // Delete project (cascading delete will handle content)
      const { error } = await supabase
        .from('projects_storywise')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error('Error deleting project:', error);
        throw error;
      }

      // Update local state
      const updatedProjects = projects.filter(project => project.id !== projectId);
      setProjects(updatedProjects);

      // Clear current project if it's the one being deleted
      if (currentProject && currentProject.id === projectId) {
        setCurrentProject(null);
      }

      // Update localStorage backup
      localStorage.setItem('gospelwise_projects', JSON.stringify(updatedProjects));

      console.log('Project deleted successfully');
    } catch (error) {
      console.error('Error in deleteProject:', error);
      throw error;
    }
  };

  const getProject = async (projectId) => {
    try {
      console.log('Getting project:', projectId);

      // First check local state
      let project = projects.find(p => p.id === projectId);
      if (project) {
        console.log('Project found in local state');
        return project;
      }

      console.log('Project not in local state, fetching from Supabase');

      // Fetch from Supabase if not in local state
      const { data: projectData, error: projectError } = await supabase
        .from('projects_storywise')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) {
        console.error('Error fetching project:', projectError);
        throw projectError;
      }

      console.log('Project data fetched:', projectData);

      // Fetch associated content
      const contentTable = projectData.type === 'fiction' ? 'fiction_content' : 'nonfiction_content';
      let contentData = {};

      const { data, error: contentError } = await supabase
        .from(contentTable)
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (contentError) {
        if (contentError.code === 'PGRST116') {
          // Content not found, create it
          console.log('Content not found, creating new record');
          const { data: newContent, error: createError } = await supabase
            .from(contentTable)
            .insert([{
              project_id: projectId,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }])
            .select()
            .single();

          if (createError) {
            console.error('Error creating content:', createError);
          } else {
            contentData = newContent;
          }
        } else {
          console.error('Error fetching content:', contentError);
        }
      } else {
        contentData = data;
      }

      project = { ...projectData, content: contentData || {} };

      // Add to local state
      setProjects(prev => {
        // Check if project already exists
        const exists = prev.some(p => p.id === project.id);
        if (!exists) {
          // Add to projects array if it doesn't exist
          return [...prev, project];
        }
        return prev;
      });

      return project;
    } catch (error) {
      console.error('Error in getProject:', error);
      throw error;
    }
  };

  const value = {
    projects,
    currentProject,
    setCurrentProject,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    loading,
    fetchProjects
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};