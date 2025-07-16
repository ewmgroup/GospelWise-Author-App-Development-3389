import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useProjects } from '../../contexts/ProjectContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiChevronDown, FiChevronRight, FiSave, FiBookOpen, FiTarget, FiUsers, FiMessageCircle, FiFileText, FiHeart, FiCompass, FiCheck } = FiIcons;

const NonfictionPlanner = ({ project }) => {
  const { updateProject } = useProjects();

  // Initialize form data from project content
  const [formData, setFormData] = useState({
    // Part 1: Message Mapping
    kingdomConcept: '',
    readerPersona: {
      lifeStage: '',
      struggle: '',
      desire: '',
      objections: ''
    },
    coreThemes: '',
    sourceMaterial: '',
    holySpirit: '',
    // Part 2: StoryWise Nonfiction Structure (9 Movements)
    nonfictionStructure: {
      startingWhereTheyAre: '',
      hookingWithHope: '',
      firstShift: '',
      firstWakeUpCall: '',
      gospelCenteredReframe: '',
      costOfChange: '',
      finalBreakthrough: '',
      livingTheChange: '',
      finalEncouragement: ''
    }
  });

  const [expandedSections, setExpandedSections] = useState({
    // Message Mapping sections
    concept: true,
    reader: true,
    themes: true,
    source: true,
    spirit: true,
    // Structure sections
    structure: true,
    movements: {}
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'saved', null
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const initializedRef = useRef(false);

  // Initialize form data and expanded state ONLY once when project first loads
  useEffect(() => {
    if (project && project.content && !initializedRef.current) {
      console.log('Initializing nonfiction data from project content (first time only)');
      
      // Initialize nonfiction structure with defaults if not present
      const defaultStructure = {
        startingWhereTheyAre: '',
        hookingWithHope: '',
        firstShift: '',
        firstWakeUpCall: '',
        gospelCenteredReframe: '',
        costOfChange: '',
        finalBreakthrough: '',
        livingTheChange: '',
        finalEncouragement: ''
      };

      // Initialize reader persona with defaults if not present
      const defaultReaderPersona = {
        lifeStage: '',
        struggle: '',
        desire: '',
        objections: ''
      };

      setFormData({
        kingdomConcept: project.content.kingdom_concept || '',
        readerPersona: {
          lifeStage: project.content.reader_persona?.lifeStage || '',
          struggle: project.content.reader_persona?.struggle || '',
          desire: project.content.reader_persona?.desire || '',
          objections: project.content.reader_persona?.objections || ''
        },
        coreThemes: project.content.core_themes || '',
        sourceMaterial: project.content.source_material || '',
        holySpirit: project.content.holy_spirit || '',
        nonfictionStructure: project.content.nonfiction_structure || defaultStructure
      });

      // Initialize expanded state for movements
      const movementsExpanded = {};
      Object.keys(project.content.nonfiction_structure || defaultStructure).forEach((key, index) => {
        movementsExpanded[key] = index === 0; // Only expand first movement by default
      });

      setExpandedSections(prev => ({
        ...prev,
        movements: movementsExpanded
      }));

      setIsLoaded(true);
      initializedRef.current = true;
    }
  }, [project?.id]); // Only depend on project ID

  // Separate effect to update form data when project content changes (but preserve expanded state)
  useEffect(() => {
    if (project && project.content && initializedRef.current) {
      console.log('Updating nonfiction data (preserving expanded state)');
      
      const defaultStructure = {
        startingWhereTheyAre: '',
        hookingWithHope: '',
        firstShift: '',
        firstWakeUpCall: '',
        gospelCenteredReframe: '',
        costOfChange: '',
        finalBreakthrough: '',
        livingTheChange: '',
        finalEncouragement: ''
      };

      setFormData({
        kingdomConcept: project.content.kingdom_concept || '',
        readerPersona: {
          lifeStage: project.content.reader_persona?.lifeStage || '',
          struggle: project.content.reader_persona?.struggle || '',
          desire: project.content.reader_persona?.desire || '',
          objections: project.content.reader_persona?.objections || ''
        },
        coreThemes: project.content.core_themes || '',
        sourceMaterial: project.content.source_material || '',
        holySpirit: project.content.holy_spirit || '',
        nonfictionStructure: project.content.nonfiction_structure || defaultStructure
      });
      // Note: We don't touch expandedSections here
    }
  }, [project?.content]);

  // Debounced save function
  const debouncedSave = (updates) => {
    setSaveStatus('saving');

    // Clear any existing timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set new timeout for saving
    const timeoutId = setTimeout(async () => {
      try {
        // Calculate progress based on filled sections
        let totalFields = 5; // Base sections (Message Mapping)
        let filledFields = 0;

        // Check base fields
        if (formData.kingdomConcept.trim()) filledFields++;
        if (
          formData.readerPersona.lifeStage.trim() ||
          formData.readerPersona.struggle.trim() ||
          formData.readerPersona.desire.trim() ||
          formData.readerPersona.objections.trim()
        ) filledFields++;
        if (formData.coreThemes.trim()) filledFields++;
        if (formData.sourceMaterial.trim()) filledFields++;
        if (formData.holySpirit.trim()) filledFields++;

        // Count structure fields
        const structureValues = Object.values(formData.nonfictionStructure);
        totalFields += structureValues.length;
        filledFields += structureValues.filter(val => val.trim()).length;

        const progress = Math.round((filledFields / totalFields) * 100);

        await updateProject(project.id, {
          ...updates,
          progress: progress
        });

        setSaveStatus('saved');
        // Clear the "saved" status after 2 seconds
        setTimeout(() => {
          setSaveStatus(null);
        }, 2000);
      } catch (error) {
        console.error('Error saving nonfiction project:', error);
        setSaveStatus(null);
      }
    }, 500);

    setDebounceTimeout(timeoutId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    
    // Save the specific field
    debouncedSave({ [name]: value });
  };

  const handleReaderChange = (e) => {
    const { name, value } = e.target;
    const updatedReaderPersona = { ...formData.readerPersona, [name]: value };
    const updatedFormData = { ...formData, readerPersona: updatedReaderPersona };
    setFormData(updatedFormData);
    
    // Save the reader persona
    debouncedSave({ readerPersona: updatedReaderPersona });
  };

  const handleMovementChange = (movementKey, value) => {
    const updatedStructure = { ...formData.nonfictionStructure, [movementKey]: value };
    const updatedFormData = { ...formData, nonfictionStructure: updatedStructure };
    setFormData(updatedFormData);
    
    // Save the nonfiction structure
    debouncedSave({ nonfictionStructure: updatedStructure });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleMovement = (movement) => {
    setExpandedSections(prev => ({
      ...prev,
      movements: {
        ...prev.movements,
        [movement]: !prev.movements[movement]
      }
    }));
  };

  const handleManualSave = () => {
    // Force save all data immediately
    setSaveStatus('saving');
    
    // Calculate progress
    let totalFields = 5; // Base sections
    let filledFields = 0;

    if (formData.kingdomConcept.trim()) filledFields++;
    if (
      formData.readerPersona.lifeStage.trim() ||
      formData.readerPersona.struggle.trim() ||
      formData.readerPersona.desire.trim() ||
      formData.readerPersona.objections.trim()
    ) filledFields++;
    if (formData.coreThemes.trim()) filledFields++;
    if (formData.sourceMaterial.trim()) filledFields++;
    if (formData.holySpirit.trim()) filledFields++;

    const structureValues = Object.values(formData.nonfictionStructure);
    totalFields += structureValues.length;
    filledFields += structureValues.filter(val => val.trim()).length;

    const progress = Math.round((filledFields / totalFields) * 100);

    updateProject(project.id, {
      kingdomConcept: formData.kingdomConcept,
      readerPersona: formData.readerPersona,
      coreThemes: formData.coreThemes,
      sourceMaterial: formData.sourceMaterial,
      holySpirit: formData.holySpirit,
      nonfictionStructure: formData.nonfictionStructure,
      progress: progress
    }).then(() => {
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus(null);
      }, 2000);
    }).catch(() => {
      setSaveStatus(null);
    });
  };

  const movements = [
    {
      key: 'startingWhereTheyAre',
      title: 'Movement 1: Starting Where They Are',
      description: 'Describe the reader\'s current experience. Build empathy. Help them feel seen. Set the tone. Make them feel known and safe. No solutions yet—just resonance.',
      placeholder: 'Describe where your reader currently is in their journey. Help them feel understood and seen...'
    },
    {
      key: 'hookingWithHope',
      title: 'Movement 2: Hooking with Hope',
      description: 'Offer the vision. Stir curiosity. Introduce the idea that something better is possible. Frame the tension between where they are and what could be.',
      placeholder: 'What hope can you offer? What vision of transformation will capture their imagination?'
    },
    {
      key: 'firstShift',
      title: 'Movement 3: The First Shift',
      description: 'Introduce your first big truth, reframe, or paradigm shift. What is something that changes their understanding of the problem? This is your first "light bulb" moment.',
      placeholder: 'What is the first major insight or reframe that will begin to shift their perspective?'
    },
    {
      key: 'firstWakeUpCall',
      title: 'Movement 4: The First Wake-Up Call',
      description: 'Expose the real resistance. Help them identify false beliefs, enemy lies, or cultural noise. Name the stakes. Highlight the danger of staying stuck.',
      placeholder: 'What false beliefs or enemy lies need to be exposed? What are the real stakes if they stay where they are?'
    },
    {
      key: 'gospelCenteredReframe',
      title: 'Movement 5: Gospel-Centered Reframe',
      description: 'Bring in a central truth of the gospel that changes everything. Use Scripture, leverage story, bring theological clarity. This is your midpoint catalyst.',
      placeholder: 'What central gospel truth will transform their understanding? What Scripture will anchor this reframe?'
    },
    {
      key: 'costOfChange',
      title: 'Movement 6: The Cost of Change',
      description: 'Introduce a second wake-up: what will it cost to believe this truth and walk it out? This is where conviction builds and decision gets closer.',
      placeholder: 'What will it cost your reader to embrace this truth? What must they be willing to surrender or confront?'
    },
    {
      key: 'finalBreakthrough',
      title: 'Movement 7: The Final Breakthrough',
      description: 'Present the "aha moment" that moves the reader toward final transformation. A Scripture sinks in, a story lands, or a practice gets revealed. This is the moment of resolve.',
      placeholder: 'What is the pivotal breakthrough moment? What insight, story, or revelation will create the final shift?'
    },
    {
      key: 'livingTheChange',
      title: 'Movement 8: Living the Change',
      description: 'Provide clear, doable, Spirit-led steps to apply the truth. Think: reflection questions, journaling prompts, action steps, prayers, spiritual practices. Empower, don\'t overwhelm.',
      placeholder: 'What practical steps will help them live out this transformation? Include specific actions, practices, or reflections.'
    },
    {
      key: 'finalEncouragement',
      title: 'Movement 9: Final Encouragement',
      description: 'What does life look like now? Describe the "after" for your reader. This is the ribbon on the chapter. Give them hope, joy, and clarity about their new normal.',
      placeholder: 'Paint the picture of their transformed life. What does their new normal look like? How will they feel and live differently?'
    }
  ];

  if (!isLoaded) {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-secondary-800">StoryWise™ Framework for Nonfiction</h2>
          <p className="text-secondary-600 mt-2">
            A gospel-centered framework for transformative Christian nonfiction writing
          </p>
        </div>
        <div className="flex items-center space-x-4">
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
          
          <button
            onClick={handleManualSave}
            className="flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-spiritual-600 text-white px-4 py-2 rounded-lg hover:from-primary-700 hover:to-spiritual-700 transition-colors"
          >
            <SafeIcon icon={FiSave} className="w-5 h-5" />
            <span>Save Progress</span>
          </button>
        </div>
      </div>

      {/* Part 1: Message Mapping */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <SafeIcon icon={FiCompass} className="w-6 h-6 text-primary-600" />
          <h3 className="text-xl font-bold text-secondary-800">Part 1: Message Mapping - Pre-Writing Work</h3>
        </div>

        <div className="space-y-6">
          {/* Kingdom Concept */}
          <div className="border border-secondary-200 rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between bg-gradient-to-r from-primary-50 to-spiritual-50 p-4 cursor-pointer"
              onClick={() => toggleSection('concept')}
            >
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiTarget} className="w-5 h-5 text-primary-600" />
                <h4 className="font-semibold text-secondary-800">1. Kingdom Concept (Nonfiction "Hook")</h4>
              </div>
              <SafeIcon
                icon={expandedSections.concept ? FiChevronDown : FiChevronRight}
                className="w-5 h-5 text-secondary-600"
              />
            </div>
            {expandedSections.concept && (
              <div className="p-4 space-y-4">
                <p className="text-secondary-600 mb-2">
                  What is the core "what if" or "why now" of your message? What's the transformation your reader will experience? What kingdom question is your book answering?
                </p>
                <textarea
                  name="kingdomConcept"
                  value={formData.kingdomConcept}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="What if Christian moms stopped striving for spiritual perfection and started parenting from grace? What if we could recover the spiritual practices that shaped the early church for our modern discipleship?"
                />
              </div>
            )}
          </div>

          {/* Reader Persona */}
          <div className="border border-secondary-200 rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between bg-gradient-to-r from-primary-50 to-spiritual-50 p-4 cursor-pointer"
              onClick={() => toggleSection('reader')}
            >
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiUsers} className="w-5 h-5 text-primary-600" />
                <h4 className="font-semibold text-secondary-800">2. Your Reader (Nonfiction "Character")</h4>
              </div>
              <SafeIcon
                icon={expandedSections.reader ? FiChevronDown : FiChevronRight}
                className="w-5 h-5 text-secondary-600"
              />
            </div>
            {expandedSections.reader && (
              <div className="p-4 space-y-4">
                <p className="text-secondary-600 mb-4">
                  Every nonfiction book serves someone specific. Ground your writing in who you're serving, just as fiction grounds the story in the protagonist.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Who are they? What season of life?
                    </label>
                    <textarea
                      name="lifeStage"
                      value={formData.readerPersona.lifeStage}
                      onChange={handleReaderChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      placeholder="Describe your reader's age, life stage, and current circumstances..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      What are they struggling with?
                    </label>
                    <textarea
                      name="struggle"
                      value={formData.readerPersona.struggle}
                      onChange={handleReaderChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      placeholder="What pain points, challenges, or spiritual struggles are they experiencing?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      What do they long for or need?
                    </label>
                    <textarea
                      name="desire"
                      value={formData.readerPersona.desire}
                      onChange={handleReaderChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      placeholder="What is your reader hoping to achieve, experience, or become?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      What objections might they have?
                    </label>
                    <textarea
                      name="objections"
                      value={formData.readerPersona.objections}
                      onChange={handleReaderChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      placeholder="What might prevent your reader from accepting or applying your message?"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Core Themes */}
          <div className="border border-secondary-200 rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between bg-gradient-to-r from-primary-50 to-spiritual-50 p-4 cursor-pointer"
              onClick={() => toggleSection('themes')}
            >
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiMessageCircle} className="w-5 h-5 text-primary-600" />
                <h4 className="font-semibold text-secondary-800">3. Core Themes</h4>
              </div>
              <SafeIcon
                icon={expandedSections.themes ? FiChevronDown : FiChevronRight}
                className="w-5 h-5 text-secondary-600"
              />
            </div>
            {expandedSections.themes && (
              <div className="p-4 space-y-4">
                <p className="text-secondary-600 mb-2">
                  Theme is the emotional + spiritual takeaway. It's not just what your book is about—it's what it means. What gospel-centered truths are you trying to affirm?
                </p>
                <textarea
                  name="coreThemes"
                  value={formData.coreThemes}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="What gospel-centered truths are you affirming? What Scriptures will shape the message? What deeper longings will be stirred? How will the reader feel after reading this?"
                />
              </div>
            )}
          </div>

          {/* Source Material */}
          <div className="border border-secondary-200 rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between bg-gradient-to-r from-primary-50 to-spiritual-50 p-4 cursor-pointer"
              onClick={() => toggleSection('source')}
            >
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiFileText} className="w-5 h-5 text-primary-600" />
                <h4 className="font-semibold text-secondary-800">4. Source Material + Ideas</h4>
              </div>
              <SafeIcon
                icon={expandedSections.source ? FiChevronDown : FiChevronRight}
                className="w-5 h-5 text-secondary-600"
              />
            </div>
            {expandedSections.source && (
              <div className="p-4 space-y-4">
                <p className="text-secondary-600 mb-2">
                  Use this space to gather research, biblical texts, personal stories, quotes, stats, historical insight, and your own journaled reflections. This is your "idea pantry" for when it's time to cook each chapter.
                </p>
                <textarea
                  name="sourceMaterial"
                  value={formData.sourceMaterial}
                  onChange={handleChange}
                  rows={8}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="Research or biblical texts, personal stories and illustrations, quotes/stats/historical insight, your own journaled reflections..."
                />
              </div>
            )}
          </div>

          {/* Holy Spirit Insights */}
          <div className="border border-secondary-200 rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between bg-gradient-to-r from-primary-50 to-spiritual-50 p-4 cursor-pointer"
              onClick={() => toggleSection('spirit')}
            >
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiHeart} className="w-5 h-5 text-primary-600" />
                <h4 className="font-semibold text-secondary-800">5. Message Notes + Holy Spirit Insights</h4>
              </div>
              <SafeIcon
                icon={expandedSections.spirit ? FiChevronDown : FiChevronRight}
                className="w-5 h-5 text-secondary-600"
              />
            </div>
            {expandedSections.spirit && (
              <div className="p-4 space-y-4">
                <p className="text-secondary-600 mb-2">
                  Keep a running log of downloads, insights, structure tweaks, and prophetic nudges. This is a blend of creative journal + Holy Spirit whisper log. Don't edit—just capture.
                </p>
                <textarea
                  name="holySpirit"
                  value={formData.holySpirit}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="Record downloads, insights, structure tweaks, prophetic nudges, creative inspirations, and Holy Spirit whispers as you work..."
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Part 2: StoryWise Nonfiction Structure */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <SafeIcon icon={FiBookOpen} className="w-6 h-6 text-primary-600" />
          <h3 className="text-xl font-bold text-secondary-800">Part 2: StoryWise™ Nonfiction Structure</h3>
        </div>

        <p className="text-secondary-600 mb-6">
          Adapted from the 9-Movement Fiction Outline, this nonfiction movement structure gives shape to your message while keeping the reader emotionally engaged.
        </p>

        <div className="space-y-4">
          {movements.map((movement) => (
            <div key={movement.key} className="border border-secondary-200 rounded-lg overflow-hidden">
              <div
                className="flex items-center justify-between bg-gradient-to-r from-primary-50 to-spiritual-50 p-4 cursor-pointer"
                onClick={() => toggleMovement(movement.key)}
              >
                <h4 className="font-semibold text-secondary-800">{movement.title}</h4>
                <SafeIcon
                  icon={expandedSections.movements[movement.key] ? FiChevronDown : FiChevronRight}
                  className="w-5 h-5 text-secondary-600"
                />
              </div>
              {expandedSections.movements[movement.key] && (
                <div className="p-4 space-y-4">
                  <p className="text-secondary-600 text-sm mb-3">{movement.description}</p>
                  <textarea
                    value={formData.nonfictionStructure[movement.key]}
                    onChange={(e) => handleMovementChange(movement.key, e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder={movement.placeholder}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end">
        <button
          onClick={handleManualSave}
          className="flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-spiritual-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-spiritual-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <SafeIcon icon={FiSave} className="w-5 h-5" />
          <span>Save Progress</span>
        </button>
      </div>
    </div>
  );
};

export default NonfictionPlanner;