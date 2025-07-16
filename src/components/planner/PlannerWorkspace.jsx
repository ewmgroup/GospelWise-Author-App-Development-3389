import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProjects } from '../../contexts/ProjectContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import StoryStructureOutline from './StoryStructureOutline';

const { FiChevronDown, FiChevronRight, FiEdit, FiCheck } = FiIcons;

const PlannerWorkspace = ({ project }) => {
  const { updateProject } = useProjects();
  const [activeTab, setActiveTab] = useState('brief');
  const [expandedSections, setExpandedSections] = useState({});
  const [editingOverview, setEditingOverview] = useState(false);
  const [overviewData, setOverviewData] = useState({
    title: '',
    genre: '',
    targetAudience: '',
    wordCountGoal: ''
  });
  const [formData, setFormData] = useState({
    premise: '',
    theme: '',
    faithElement: '',
    storyBeginning: '',
    storyMiddle: '',
    storyEnd: '',
    readerTransformation: '',
    protagonist: '',
    protagonistGoals: '',
    protagonistFlaw: '',
    antagonist: '',
    antagonistMotivations: '',
    supportingCharacters: '',
    setting: '',
    timePeriod: '',
    worldRules: '',
    conflict: '',
    stakes: '',
    spiritualElements: ''
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'saved', null

  // Initialize data when project changes
  useEffect(() => {
    if (project) {
      setOverviewData({
        title: project.title || '',
        genre: project.genre || '',
        targetAudience: project.target_audience || '',
        wordCountGoal: project.word_count_goal || ''
      });

      // Initialize form data from project content
      setFormData({
        premise: project.content?.premise || '',
        theme: project.content?.theme || '',
        faithElement: project.content?.faith_element || '',
        storyBeginning: project.content?.story_beginning || '',
        storyMiddle: project.content?.story_middle || '',
        storyEnd: project.content?.story_end || '',
        readerTransformation: project.content?.reader_transformation || '',
        protagonist: project.content?.protagonist || '',
        protagonistGoals: project.content?.protagonist_goals || '',
        protagonistFlaw: project.content?.protagonist_flaw || '',
        antagonist: project.content?.antagonist || '',
        antagonistMotivations: project.content?.antagonist_motivations || '',
        supportingCharacters: project.content?.supporting_characters || '',
        setting: project.content?.setting || '',
        timePeriod: project.content?.time_period || '',
        worldRules: project.content?.world_rules || '',
        conflict: project.content?.conflict || '',
        stakes: project.content?.stakes || '',
        spiritualElements: project.content?.spiritual_elements || ''
      });
      
      setIsLoaded(true);
    }
  }, [project]);

  // Handle form input changes with debouncing
  const handleChange = (field, value) => {
    // Update local state immediately
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Show saving indicator
    setSaveStatus('saving');

    // Clear any existing timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set new timeout for saving
    const timeoutId = setTimeout(() => {
      updateProject(project.id, { [field]: value });
      setSaveStatus('saved');
      // Clear the "saved" status after 2 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 2000);
    }, 500);

    setDebounceTimeout(timeoutId);
  };

  const handleOverviewChange = (field, value) => {
    setOverviewData(prev => ({
      ...prev,
      [field]: field === 'wordCountGoal' ? (value ? parseInt(value) : '') : value
    }));
  };

  const saveOverview = () => {
    updateProject(project.id, {
      title: overviewData.title,
      genre: overviewData.genre,
      target_audience: overviewData.targetAudience,
      word_count_goal: overviewData.wordCountGoal
    });
    setEditingOverview(false);
  };

  if (!project || !isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading project data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Tabs */}
      <div className="flex border-b border-secondary-200 mb-6 overflow-x-auto">
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === 'brief'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-secondary-600 hover:text-primary-500'
          }`}
          onClick={() => setActiveTab('brief')}
        >
          Story Concept
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === 'structure'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-secondary-600 hover:text-primary-500'
          }`}
          onClick={() => setActiveTab('structure')}
        >
          StoryWise Structure
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === 'characters'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-secondary-600 hover:text-primary-500'
          }`}
          onClick={() => setActiveTab('characters')}
        >
          Characters
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === 'world'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-secondary-600 hover:text-primary-500'
          }`}
          onClick={() => setActiveTab('world')}
        >
          Story World
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'brief' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary-800">Story Concept</h2>
            {saveStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
                  saveStatus === 'saving'
                    ? 'bg-primary-50 text-primary-600'
                    : 'bg-green-50 text-green-600'
                }`}
              >
                {saveStatus === 'saving' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    <span className="text-sm">Saving...</span>
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiCheck} className="w-4 h-4" />
                    <span className="text-sm">Saved</span>
                  </>
                )}
              </motion.div>
            )}
          </div>
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary-50 to-spiritual-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-secondary-800">Project Overview</h3>
                <button
                  onClick={() => setEditingOverview(!editingOverview)}
                  className="text-primary-600 hover:text-primary-700 transition-colors flex items-center space-x-1"
                >
                  <SafeIcon icon={FiEdit} className="w-4 h-4" />
                  <span className="text-sm">{editingOverview ? 'Cancel' : 'Edit'}</span>
                </button>
              </div>

              {editingOverview ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={overviewData.title}
                      onChange={(e) => handleOverviewChange('title', e.target.value)}
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      placeholder="Project title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Genre</label>
                    <input
                      type="text"
                      value={overviewData.genre}
                      onChange={(e) => handleOverviewChange('genre', e.target.value)}
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      placeholder="Story genre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      value={overviewData.targetAudience}
                      onChange={(e) => handleOverviewChange('targetAudience', e.target.value)}
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      placeholder="Who is your intended reader?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Word Count Goal
                    </label>
                    <input
                      type="number"
                      value={overviewData.wordCountGoal}
                      onChange={(e) => handleOverviewChange('wordCountGoal', e.target.value)}
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      placeholder="Target word count"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={saveOverview}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-secondary-700">Title:</span>
                    <p className="text-secondary-600">{project.title || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-secondary-700">Genre:</span>
                    <p className="text-secondary-600">{project.genre || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-secondary-700">Target Audience:</span>
                    <p className="text-secondary-600">{project.target_audience || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-secondary-700">Word Goal:</span>
                    <p className="text-secondary-600">
                      {project.word_count_goal
                        ? `${project.word_count_goal.toLocaleString()} words`
                        : 'Not specified'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-800">One-Line Premise</h3>
              <textarea
                value={formData.premise}
                onChange={(e) => handleChange('premise', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="Write a compelling one-sentence summary of your story..."
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-800">Central Theme</h3>
              <textarea
                value={formData.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="What is the central theme or message of your story?"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-800">Faith Element</h3>
              <textarea
                value={formData.faithElement}
                onChange={(e) => handleChange('faithElement', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="How does faith or spiritual truth appear in your story? What biblical principles are you exploring?"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-800">Key Story Arc</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Beginning</label>
                  <textarea
                    value={formData.storyBeginning}
                    onChange={(e) => handleChange('storyBeginning', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="How does your story begin?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Middle</label>
                  <textarea
                    value={formData.storyMiddle}
                    onChange={(e) => handleChange('storyMiddle', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="What happens in the middle?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">End</label>
                  <textarea
                    value={formData.storyEnd}
                    onChange={(e) => handleChange('storyEnd', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="How does your story resolve?"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-800">Reader Transformation</h3>
              <textarea
                value={formData.readerTransformation}
                onChange={(e) => handleChange('readerTransformation', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="What do you want readers to think, feel, or do after reading your story?"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'structure' && <StoryStructureOutline project={project} />}

      {activeTab === 'characters' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary-800">Characters</h2>
            {saveStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
                  saveStatus === 'saving'
                    ? 'bg-primary-50 text-primary-600'
                    : 'bg-green-50 text-green-600'
                }`}
              >
                {saveStatus === 'saving' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    <span className="text-sm">Saving...</span>
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiCheck} className="w-4 h-4" />
                    <span className="text-sm">Saved</span>
                  </>
                )}
              </motion.div>
            )}
          </div>
          <div className="space-y-6">
            {/* Protagonist Section */}
            <div className="border border-secondary-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Protagonist</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Character Name & Background
                  </label>
                  <textarea
                    value={formData.protagonist}
                    onChange={(e) => handleChange('protagonist', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="Describe your protagonist's name, age, background, and key characteristics..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Character Goals & Motivations
                  </label>
                  <textarea
                    value={formData.protagonistGoals}
                    onChange={(e) => handleChange('protagonistGoals', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="What does your protagonist want? What drives them?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Character Flaws & Growth Arc
                  </label>
                  <textarea
                    value={formData.protagonistFlaw}
                    onChange={(e) => handleChange('protagonistFlaw', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="What are their weaknesses? How will they grow throughout the story?"
                  />
                </div>
              </div>
            </div>

            {/* Antagonist Section */}
            <div className="border border-secondary-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Antagonist</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Antagonist Description
                  </label>
                  <textarea
                    value={formData.antagonist}
                    onChange={(e) => handleChange('antagonist', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="Describe your antagonist (person, force, or internal struggle)..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Antagonist Motivations
                  </label>
                  <textarea
                    value={formData.antagonistMotivations}
                    onChange={(e) => handleChange('antagonistMotivations', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="What drives the antagonist? Why do they oppose your protagonist?"
                  />
                </div>
              </div>
            </div>

            {/* Supporting Characters Section */}
            <div className="border border-secondary-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Supporting Characters</h3>
              <textarea
                value={formData.supportingCharacters}
                onChange={(e) => handleChange('supportingCharacters', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="Describe key supporting characters, their roles, and how they impact the story..."
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'world' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary-800">Story World</h2>
            {saveStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
                  saveStatus === 'saving'
                    ? 'bg-primary-50 text-primary-600'
                    : 'bg-green-50 text-green-600'
                }`}
              >
                {saveStatus === 'saving' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    <span className="text-sm">Saving...</span>
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiCheck} className="w-4 h-4" />
                    <span className="text-sm">Saved</span>
                  </>
                )}
              </motion.div>
            )}
          </div>
          <div className="space-y-6">
            {/* Setting Section */}
            <div className="border border-secondary-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Setting & Time Period</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Primary Location(s)
                  </label>
                  <textarea
                    value={formData.setting}
                    onChange={(e) => handleChange('setting', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="Describe where your story takes place. Include physical details, atmosphere, and mood..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Time Period & Historical Context
                  </label>
                  <textarea
                    value={formData.timePeriod}
                    onChange={(e) => handleChange('timePeriod', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="When does your story take place? What historical or cultural context is important?"
                  />
                </div>
              </div>
            </div>

            {/* World Rules Section */}
            <div className="border border-secondary-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">World Rules & Logic</h3>
              <textarea
                value={formData.worldRules}
                onChange={(e) => handleChange('worldRules', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="What are the rules of your story world? Include spiritual elements, social structures, or any unique aspects..."
              />
            </div>

            {/* Conflict & Stakes Section */}
            <div className="border border-secondary-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Central Conflict & Stakes</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Main Conflict
                  </label>
                  <textarea
                    value={formData.conflict}
                    onChange={(e) => handleChange('conflict', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="What is the central conflict driving your story?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    What's at Stake?
                  </label>
                  <textarea
                    value={formData.stakes}
                    onChange={(e) => handleChange('stakes', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="What will happen if your protagonist fails? What are they fighting for?"
                  />
                </div>
              </div>
            </div>

            {/* Spiritual Elements Section */}
            <div className="border border-secondary-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Faith & Spiritual Elements</h3>
              <textarea
                value={formData.spiritualElements}
                onChange={(e) => handleChange('spiritualElements', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="How does faith play a role in your story world? What spiritual themes or elements are present?"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlannerWorkspace;