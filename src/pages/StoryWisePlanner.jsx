import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects } from '../contexts/ProjectContext';
import ProjectSetup from '../components/planner/ProjectSetup';
import PlannerWorkspace from '../components/planner/PlannerWorkspace';
import NonfictionPlanner from '../components/planner/NonfictionPlanner';
import ExportModal from '../components/ExportModal';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit3, FiArrowLeft, FiDownload } = FiIcons;

const StoryWisePlanner = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, getProject, currentProject, setCurrentProject } = useProjects();
  const [showSetup, setShowSetup] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentProjectData, setCurrentProjectData] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      // If no projectId, show setup form
      if (!projectId) {
        console.log('No projectId, showing setup form');
        setCurrentProject(null);
        setCurrentProjectData(null);
        setShowSetup(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // First check if currentProject matches the projectId
        if (currentProject && currentProject.id === projectId) {
          console.log('Using current project from context:', currentProject.id);
          setCurrentProjectData(currentProject);
          setShowSetup(false);
          setLoading(false);
          return;
        }

        // Then check projects array
        let projectData = projects.find(p => p.id === projectId);
        
        if (!projectData) {
          // If not in array, try to fetch it
          console.log('Project not in local state, fetching from API:', projectId);
          try {
            projectData = await getProject(projectId);
          } catch (fetchError) {
            console.error('Error fetching project:', fetchError);
            throw new Error('Failed to load project');
          }
        }

        if (projectData) {
          console.log('Project loaded successfully:', projectData.id);
          setCurrentProjectData(projectData);
          setCurrentProject(projectData);
          setShowSetup(false);
        } else {
          console.error('Project not found after fetch attempt:', projectId);
          throw new Error('Project not found');
        }
      } catch (err) {
        console.error('Error loading project:', err);
        setError(err.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, projects, currentProject, getProject, setCurrentProject]);

  // Clear state when component unmounts
  useEffect(() => {
    return () => {
      setCurrentProjectData(null);
    };
  }, []);

  const handleProjectCreated = (project) => {
    console.log('Project created successfully, navigating to:', project.id);
    setCurrentProjectData(project);
    setCurrentProject(project);
    setShowSetup(false);
    
    // Use timeout to ensure state updates before navigation
    setTimeout(() => {
      navigate(`/planner/${project.id}`);
    }, 300); // Slightly longer delay to ensure state is updated
  };

  const handleBackToProjects = () => {
    // Navigate first, then clear state
    navigate('/projects');
    setTimeout(() => {
      setCurrentProjectData(null);
      setCurrentProject(null);
    }, 100);
  };

  const openExportModal = () => setShowExportModal(true);
  const closeExportModal = () => setShowExportModal(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
        <button 
          onClick={() => navigate('/projects')}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  if (showSetup) {
    return <ProjectSetup onProjectCreated={handleProjectCreated} />;
  }

  if (!currentProjectData) {
    return (
      <div className="text-center p-4">
        <p>No project selected</p>
        <button 
          onClick={() => navigate('/projects')}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleBackToProjects}
            className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600"
          >
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
            <span>Back to Projects</span>
          </button>
          <div className="h-6 w-px bg-secondary-300" />
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-spiritual-500 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiEdit3} className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-secondary-800">
                {currentProjectData.title}
              </h1>
              <p className="text-secondary-600 text-sm">
                {currentProjectData.type} • {currentProjectData.genre}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-secondary-600">Progress</p>
            <p className="text-xl font-semibold text-primary-600">
              {currentProjectData.progress || 0}%
            </p>
          </div>
          <button
            onClick={openExportModal}
            className="flex items-center space-x-2 bg-gradient-to-r from-spiritual-600 to-primary-600 text-white px-3 py-2 rounded-lg"
          >
            <SafeIcon icon={FiDownload} className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentProjectData.type === 'nonfiction' ? (
          <NonfictionPlanner 
            project={currentProjectData} 
            key={`nonfiction-${currentProjectData.id}`}
          />
        ) : (
          <PlannerWorkspace 
            project={currentProjectData} 
            key={`fiction-${currentProjectData.id}`}
          />
        )}
      </motion.div>

      {/* Export Modal */}
      <ExportModal 
        isOpen={showExportModal} 
        onClose={closeExportModal} 
        project={currentProjectData}
      />
    </div>
  );
};

export default StoryWisePlanner;