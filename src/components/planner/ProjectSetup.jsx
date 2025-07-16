import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProjects } from '../../contexts/ProjectContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBook, FiUser, FiTarget, FiEdit3 } = FiIcons;

const ProjectSetup = ({ onProjectCreated }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    genre: '',
    description: '',
    targetAudience: '',
    wordCountGoal: '',
    theme: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createProject } = useProjects();

  // Validation functions for each step
  const validateStep1 = () => {
    return formData.title && formData.type && formData.genre;
  };

  const validateStep2 = () => {
    // Step 2 is optional but should at least have description
    return formData.description && formData.description.trim() !== '';
  };

  const validateStep3 = () => {
    // Theme is required before final submission
    return formData.theme && formData.theme.trim() !== '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent form submission unless on step 3
    if (step !== 3) {
      console.log("Not on step 3 yet, stopping submission");
      return;
    }

    // Validate all steps before submission
    if (!validateStep1()) {
      console.log("Step 1 validation failed");
      setStep(1);
      return;
    }
    
    if (!validateStep2()) {
      console.log("Step 2 validation failed");
      setStep(2);
      return;
    }
    
    if (!validateStep3()) {
      console.log("Step 3 validation failed");
      alert('Please enter a theme for your project.');
      return;
    }

    if (isSubmitting) {
      console.log("Already submitting, preventing duplicate submission");
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log("Creating project with data:", formData);
      
      const project = await createProject(formData);
      console.log("Project created successfully:", project);
      
      if (project && project.id) {
        // Add slight delay before navigation
        setTimeout(() => {
          onProjectCreated(project);
        }, 500);
      } else {
        console.error("Created project is missing ID or invalid", project);
        alert("There was an error creating your project. Please try again.");
      }
    } catch (error) {
      console.error("Error in project creation:", error);
      alert("There was an error creating your project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fictionGenres = [
    'Christian Fiction', 'Historical Fiction', 'Contemporary Fiction', 'Biblical Fiction', 
    'Romance', 'Mystery/Thriller', 'Young Adult', 'Children\'s Fiction', 
    'Fantasy/Sci-Fi', 'Literary Fiction'
  ];

  const nonfictionGenres = [
    'Devotional', 'Bible Study', 'Theology', 'Christian Living', 
    'Biography/Memoir', 'Self-Help', 'Parenting', 'Marriage/Relationships', 
    'Leadership', 'Ministry/Pastoral'
  ];

  const genres = formData.type === 'fiction' ? fictionGenres : nonfictionGenres;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-spiritual-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiEdit3} className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-secondary-800">Create New Project</h2>
          <p className="text-secondary-600 mt-2">Let's set up your writing project step by step</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-600">Step {step} of 3</span>
            <span className="text-sm font-medium text-secondary-600">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-secondary-200 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-spiritual-500 rounded-full transition-all duration-300" 
              style={{ width: `${(step / 3) * 100}%` }} 
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Project Title *
                </label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" 
                  placeholder="Enter your book title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Project Type *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setFormData({ ...formData, type: 'fiction', genre: '' })}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.type === 'fiction' ? 'border-primary-500 bg-primary-50' : 'border-secondary-300 hover:border-primary-300'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiBook} className="w-6 h-6 text-primary-600" />
                      <div>
                        <h3 className="font-semibold text-secondary-800">Fiction</h3>
                        <p className="text-sm text-secondary-600">Novels, stories, narratives</p>
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={() => setFormData({ ...formData, type: 'nonfiction', genre: '' })}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.type === 'nonfiction' ? 'border-primary-500 bg-primary-50' : 'border-secondary-300 hover:border-primary-300'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiTarget} className="w-6 h-6 text-primary-600" />
                      <div>
                        <h3 className="font-semibold text-secondary-800">Non-Fiction</h3>
                        <p className="text-sm text-secondary-600">Devotionals, teaching, memoirs</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {formData.type && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Genre *
                  </label>
                  <select 
                    name="genre" 
                    value={formData.genre} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Select a genre</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Project Details */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Project Description *
                </label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="Brief description of your book..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Target Audience
                </label>
                <input 
                  type="text" 
                  name="targetAudience" 
                  value={formData.targetAudience} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="Who is your intended reader?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Word Count Goal
                </label>
                <input 
                  type="number" 
                  name="wordCountGoal" 
                  value={formData.wordCountGoal} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="Target word count"
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: Theme & Purpose */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Central Theme or Message *
                </label>
                <textarea 
                  name="theme" 
                  value={formData.theme} 
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="What is the central theme or message of your book?"
                />
                <p className="mt-1 text-sm text-secondary-500">
                  This field is required to create your project.
                </p>
              </div>

              <div className="bg-gradient-to-br from-primary-50 to-spiritual-50 p-6 rounded-lg">
                <h3 className="font-semibold text-secondary-800 mb-2">Project Summary</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Title:</span> {formData.title}</p>
                  <p><span className="font-medium">Type:</span> {formData.type}</p>
                  <p><span className="font-medium">Genre:</span> {formData.genre}</p>
                  {formData.targetAudience && (
                    <p><span className="font-medium">Audience:</span> {formData.targetAudience}</p>
                  )}
                  {formData.wordCountGoal && (
                    <p><span className="font-medium">Word Goal:</span> {formData.wordCountGoal.toLocaleString()} words</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1 || isSubmitting}
              className="px-6 py-3 text-secondary-600 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>

            <div className="flex space-x-4">
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={(step === 1 && !validateStep1()) || (step === 2 && !validateStep2())}
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-spiritual-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-spiritual-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !validateStep3()}
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-spiritual-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-spiritual-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isSubmitting ? 'Creating Project...' : 'Create Project'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectSetup;