import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBook, FiArrowLeft, FiSave, FiPlus, FiEdit, FiTrash2, FiCheckCircle } = FiIcons;

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('devotionals');
  const [content, setContent] = useState({
    devotionals: [],
    resources: [],
    announcements: []
  });
  const [editingItem, setEditingItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    content: '',
    type: 'devotional',
    author: '',
    status: 'published',
    date: ''
  });

  useEffect(() => {
    // Load content from localStorage
    const savedContent = localStorage.getItem('gospelwise_content');
    if (savedContent) {
      setContent(JSON.parse(savedContent));
    } else {
      // Initialize with sample content
      const initialContent = {
        devotionals: [
          {
            id: '1',
            title: 'Finding Peace in Chaos',
            description: 'A devotional about finding God\'s peace during difficult times',
            content: 'In the midst of life\'s storms, God offers a peace that surpasses all understanding...',
            author: 'Pastor John Davis',
            status: 'published',
            date: '2024-01-15'
          },
          {
            id: '2',
            title: 'Writing with Purpose',
            description: 'Discover how your writing can serve God\'s kingdom',
            content: 'God has given you a unique voice and perspective for a reason...',
            author: 'Sarah Johnson',
            status: 'published',
            date: '2024-02-20'
          }
        ],
        resources: [
          {
            id: '1',
            title: 'Christian Writer\'s Guide',
            description: 'A comprehensive guide for Christian authors',
            content: 'This guide covers everything from finding your voice to marketing your book...',
            type: 'guide',
            status: 'published',
            date: '2024-01-10'
          }
        ],
        announcements: [
          {
            id: '1',
            title: 'GospelWise Author Launching July 2025!',
            description: 'Our official launch date has been set',
            content: 'We\'re excited to announce that GospelWise Author will officially launch in July 2025. The platform will include all core writing and planning tools, with Publishing Tools coming in Q1 2026 and Marketing Tools in Q3 2026.',
            status: 'published',
            date: '2024-03-01'
          }
        ]
      };
      setContent(initialContent);
      localStorage.setItem('gospelwise_content', JSON.stringify(initialContent));
    }
  }, []);

  const openAddModal = (type) => {
    const today = new Date().toISOString().split('T')[0];
    setEditingItem(null);
    setFormData({
      id: Date.now().toString(),
      title: '',
      description: '',
      content: '',
      type: type === 'resources' ? 'guide' : 'devotional',
      author: '',
      status: 'published',
      date: today
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      id: item.id,
      title: item.title,
      description: item.description,
      content: item.content,
      type: item.type || 'devotional',
      author: item.author || '',
      status: item.status || 'published',
      date: item.date
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    
    // Create updated content
    const updatedContent = { ...content };
    
    if (editingItem) {
      // Update existing item
      updatedContent[activeTab] = content[activeTab].map(item => 
        item.id === formData.id ? formData : item
      );
    } else {
      // Add new item
      updatedContent[activeTab] = [...content[activeTab], formData];
    }
    
    // Save to localStorage
    localStorage.setItem('gospelwise_content', JSON.stringify(updatedContent));
    setContent(updatedContent);
    
    // Show success message and close modal
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => {
        setSaveStatus(null);
        setShowModal(false);
      }, 1000);
    }, 800);
  };

  const handleDelete = (id) => {
    const updatedContent = { ...content };
    updatedContent[activeTab] = content[activeTab].filter(item => item.id !== id);
    
    localStorage.setItem('gospelwise_content', JSON.stringify(updatedContent));
    setContent(updatedContent);
    setShowDeleteConfirm(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin" className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors">
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="h-6 w-px bg-secondary-300" />
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-spiritual-500 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiBook} className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-800">Content Management</h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex border-b border-secondary-200">
          <button 
            className={`px-6 py-3 font-medium ${activeTab === 'devotionals' 
              ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50' 
              : 'text-secondary-600 hover:text-primary-500 hover:bg-primary-50'}`}
            onClick={() => setActiveTab('devotionals')}
          >
            Devotionals
          </button>
          <button 
            className={`px-6 py-3 font-medium ${activeTab === 'resources' 
              ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50' 
              : 'text-secondary-600 hover:text-primary-500 hover:bg-primary-50'}`}
            onClick={() => setActiveTab('resources')}
          >
            Resources
          </button>
          <button 
            className={`px-6 py-3 font-medium ${activeTab === 'announcements' 
              ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50' 
              : 'text-secondary-600 hover:text-primary-500 hover:bg-primary-50'}`}
            onClick={() => setActiveTab('announcements')}
          >
            Announcements
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-secondary-800">
              {activeTab === 'devotionals' && 'Daily Devotionals'}
              {activeTab === 'resources' && 'Author Resources'}
              {activeTab === 'announcements' && 'System Announcements'}
            </h2>
            <button
              onClick={() => openAddModal(activeTab)}
              className="flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-spiritual-600 text-white px-4 py-2 rounded-lg hover:from-primary-700 hover:to-spiritual-700 transition-colors"
            >
              <SafeIcon icon={FiPlus} className="w-5 h-5" />
              <span>Add New</span>
            </button>
          </div>

          {/* Content List */}
          <div className="space-y-4">
            {content[activeTab].length > 0 ? (
              content[activeTab].map(item => (
                <div 
                  key={item.id}
                  className="border border-secondary-200 rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-secondary-800 mb-1">{item.title}</h3>
                      <p className="text-secondary-600 text-sm mb-2">{item.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-secondary-500">
                        <span>{formatDate(item.date)}</span>
                        {item.author && <span>By: {item.author}</span>}
                        <span className={`px-2 py-0.5 rounded-full ${
                          item.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
                        title="Edit"
                      >
                        <SafeIcon icon={FiEdit} className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(item.id)}
                        className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete"
                      >
                        <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Delete Confirmation */}
                  {showDeleteConfirm === item.id && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-secondary-200 z-10">
                      <div className="p-3">
                        <p className="text-sm text-secondary-700 mb-2">Delete this item?</p>
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-3 py-1 text-xs text-secondary-700 hover:bg-secondary-100 rounded"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-secondary-500">
                <p>No content found. Click "Add New" to create some content.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold text-secondary-800 mb-6">
              {editingItem ? 'Edit Content' : 'Add New Content'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Title</label>
                <input 
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="Enter title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Description</label>
                <input 
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="Brief description"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeTab === 'resources' && (
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Resource Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="guide">Guide</option>
                      <option value="template">Template</option>
                      <option value="tutorial">Tutorial</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                )}
                
                {activeTab === 'devotionals' && (
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Author</label>
                    <input 
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="Author name"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Date</label>
                  <input 
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Content</label>
                <textarea 
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="8"
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="Enter full content here..."
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={saveStatus === 'saving'}
                  className="px-4 py-2 bg-gradient-to-r from-primary-600 to-spiritual-600 text-white rounded-lg hover:from-primary-700 hover:to-spiritual-700 transition-colors flex items-center space-x-2"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : saveStatus === 'success' ? (
                    <>
                      <SafeIcon icon={FiCheckCircle} className="w-5 h-5" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={FiSave} className="w-5 h-5" />
                      <span>Save Content</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;