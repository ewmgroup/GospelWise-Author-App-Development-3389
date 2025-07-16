import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects } from '../contexts/ProjectContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit3, FiPlus, FiCalendar, FiTrash2, FiEye, FiFilter } = FiIcons;

const MyProjects = () => {
  const { projects, deleteProject } = useProjects();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated');

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.type.toLowerCase() === filter;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'updated') {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
    if (sortBy === 'created') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      deleteProject(projectId);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'from-green-500 to-green-600';
    if (progress >= 50) return 'from-yellow-500 to-yellow-600';
    return 'from-primary-500 to-spiritual-500';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-800">My Projects</h1>
          <p className="text-secondary-600 mt-2">Manage and track your writing projects</p>
        </div>
        <Link
          to="/planner"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-spiritual-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-spiritual-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="w-5 h-5 text-secondary-600" />
            <span className="text-sm font-medium text-secondary-700">Filter by type:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-secondary-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="all">All Projects</option>
              <option value="fiction">Fiction</option>
              <option value="nonfiction">Non-Fiction</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-secondary-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-secondary-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="updated">Last Updated</option>
              <option value="created">Date Created</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {sortedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-spiritual-500 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiEdit3} className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/planner/${project.id}`}
                    className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="View Project"
                  >
                    <SafeIcon icon={FiEye} className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-2 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Project"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-secondary-800 mb-2 line-clamp-2">
                {project.title}
              </h3>
              
              <div className="flex items-center space-x-2 mb-3">
                <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                  {project.type}
                </span>
                <span className="bg-spiritual-100 text-spiritual-700 px-2 py-1 rounded-full text-xs font-medium">
                  {project.genre}
                </span>
              </div>

              <p className="text-secondary-600 text-sm mb-4 line-clamp-3">
                {project.description || 'No description available'}
              </p>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-secondary-700">Progress</span>
                  <span className="text-sm font-medium text-secondary-700">{project.progress}%</span>
                </div>
                <div className="w-full h-2 bg-secondary-200 rounded-full">
                  <div
                    className={`h-full bg-gradient-to-r ${getProgressColor(project.progress)} rounded-full transition-all duration-300`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-secondary-500">
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiCalendar} className="w-3 h-3" />
                  <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
              </div>

              <Link
                to={`/planner/${project.id}`}
                className="block w-full mt-4 bg-gradient-to-r from-primary-600 to-spiritual-600 text-white text-center py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-spiritual-700 transition-all duration-300"
              >
                Continue Writing
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 shadow-lg text-center">
          <SafeIcon icon={FiEdit3} className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-secondary-800 mb-2">No Projects Found</h3>
          <p className="text-secondary-600 mb-6">
            {filter === 'all' 
              ? "You haven't created any projects yet. Start your first writing project!"
              : `No ${filter} projects found. Try adjusting your filters.`
            }
          </p>
          <Link
            to="/planner"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-spiritual-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-spiritual-700 transition-all duration-300"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
            <span>Create Your First Project</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyProjects;