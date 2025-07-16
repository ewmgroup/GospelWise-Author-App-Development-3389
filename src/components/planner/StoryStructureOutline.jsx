import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useProjects } from '../../contexts/ProjectContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiChevronDown, FiChevronRight, FiCheck } = FiIcons;

const StoryStructureOutline = ({ project }) => {
  const { updateProject } = useProjects();
  const [expandedSections, setExpandedSections] = useState({});
  const [formData, setFormData] = useState({
    storyStructure: {}
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'saved', null
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const initializedRef = useRef(false);

  // Initialize form data and expanded state ONLY once when project first loads
  useEffect(() => {
    if (project && project.content && !initializedRef.current) {
      console.log('Initializing story structure from project content (first time only)');
      const projectStructure = project.content.story_structure || {};
      setFormData({ storyStructure: projectStructure });

      // Initialize expanded state for movements - only expand first movement by default
      const movementsExpanded = {};
      const movements = [
        'openingScene', 'hookingMoment', 'firstPlotPoint', 'firstPinchPoint',
        'midpointShift', 'secondPinchPoint', 'secondPlotPoint', 'finalResolution', 'worldBackToNormal'
      ];
      
      movements.forEach((key, index) => {
        movementsExpanded[key] = index === 0; // Only expand first movement by default
      });
      
      setExpandedSections(movementsExpanded);
      setIsLoaded(true);
      initializedRef.current = true;
    }
  }, [project?.id]); // Only depend on project ID, not the entire project object

  // Separate effect to update form data when project content changes (but preserve expanded state)
  useEffect(() => {
    if (project && project.content && initializedRef.current) {
      console.log('Updating story structure data (preserving expanded state)');
      const projectStructure = project.content.story_structure || {};
      setFormData({ storyStructure: projectStructure });
      // Note: We don't touch expandedSections here
    }
  }, [project?.content?.story_structure]);

  const handleChange = (movementId, value) => {
    // Update local state immediately
    const updatedStructure = { ...formData.storyStructure, [movementId]: value };
    setFormData(prev => ({ ...prev, storyStructure: updatedStructure }));

    // Show saving indicator
    setSaveStatus('saving');

    // Clear any existing timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set new timeout for saving
    const timeoutId = setTimeout(async () => {
      try {
        await updateProject(project.id, { storyStructure: updatedStructure });
        setSaveStatus('saved');
        // Clear the "saved" status after 2 seconds
        setTimeout(() => {
          setSaveStatus(null);
        }, 2000);
      } catch (error) {
        console.error('Error saving structure:', error);
        setSaveStatus(null);
      }
    }, 500);

    setDebounceTimeout(timeoutId);
  };

  const toggleSection = (sectionId) => {
    console.log('Toggling section:', sectionId, 'Current state:', expandedSections[sectionId]);
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const movements = [
    {
      id: 'openingScene',
      title: 'Movement 1: Opening Scene',
      description: 'Orient the reader in the world as the hero knows it. Create depth through emotions, opinions, and 5 senses of the character. Establish the "normal world" before change comes.',
      placeholder: 'Describe your opening scene that establishes the hero and creates reader connection. Show their ordinary world and what makes them relatable...'
    },
    {
      id: 'hookingMoment',
      title: 'Movement 2: Hooking Moment',
      description: 'Introduce the first moment of intrigue that disrupts the status quo. This is where you plant the story question that will drive the reader forward.',
      placeholder: 'What unexpected moment or event captures the reader\'s attention and signals that something is about to change?'
    },
    {
      id: 'firstPlotPoint',
      title: 'Movement 3: First Plot Point',
      description: 'The moment where the protagonist crosses the threshold into the main conflict. Something happens that forces a decision or change of direction.',
      placeholder: 'What event or decision forces your protagonist to engage with the main story problem?'
    },
    {
      id: 'firstPinchPoint',
      title: 'Movement 4: First Pinch Point',
      description: 'A moment where the antagonistic force shows its power or the stakes are raised. The challenge feels more real and dangerous.',
      placeholder: 'How does the antagonistic force (person, situation, or internal struggle) reveal its true threat?'
    },
    {
      id: 'midpointShift',
      title: 'Movement 5: Midpoint Shift',
      description: 'The moment where everything changes - new information is revealed, the protagonist shifts from reactive to proactive, or a major truth is uncovered.',
      placeholder: 'What major revelation, decision, or shift in perspective changes everything at the middle of your story?'
    },
    {
      id: 'secondPinchPoint',
      title: 'Movement 6: Second Pinch Point',
      description: 'The antagonistic force strikes again, harder than before. The protagonist faces serious setbacks that test their resolve.',
      placeholder: 'How does the antagonistic force push back against the protagonist\'s progress? What setbacks occur?'
    },
    {
      id: 'secondPlotPoint',
      title: 'Movement 7: Second Plot Point',
      description: 'The final piece of information or resource the protagonist needs to move into the final confrontation. The last moment of preparation before the climax.',
      placeholder: 'What final revelation, tool, or insight prepares your protagonist for the final confrontation?'
    },
    {
      id: 'finalResolution',
      title: 'Movement 8: Final Resolution',
      description: 'The climactic confrontation where the protagonist faces the antagonistic force and the main story question is answered.',
      placeholder: 'How does your protagonist confront and overcome (or fail to overcome) the central conflict?'
    },
    {
      id: 'worldBackToNormal',
      title: 'Movement 9: World Back to Normal',
      description: 'Show how the protagonist and their world have been transformed by the journey. Tie up loose ends and show the new status quo.',
      placeholder: 'How has your protagonist and their world changed? What does the new normal look like?'
    }
  ];

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading structure data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary-800">StoryWise™ Framework</h2>
          <p className="text-secondary-600 mt-2">
            Structure your story using the proven 9-movement framework for compelling fiction.
          </p>
        </div>

        {/* Autosave Status Indicator */}
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

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="space-y-4">
          {movements.map((movement) => (
            <motion.div
              key={movement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-secondary-200 rounded-lg overflow-hidden"
            >
              <div
                className="flex items-center justify-between bg-gradient-to-r from-primary-50 to-spiritual-50 p-4 cursor-pointer"
                onClick={() => toggleSection(movement.id)}
              >
                <h3 className="font-semibold text-secondary-800">{movement.title}</h3>
                <SafeIcon
                  icon={expandedSections[movement.id] ? FiChevronDown : FiChevronRight}
                  className="w-5 h-5 text-secondary-600"
                />
              </div>
              {expandedSections[movement.id] && (
                <div className="p-4 space-y-4">
                  <p className="text-secondary-600 text-sm">{movement.description}</p>
                  <textarea
                    value={formData.storyStructure[movement.id] || ''}
                    onChange={(e) => handleChange(movement.id, e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder={movement.placeholder}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryStructureOutline;