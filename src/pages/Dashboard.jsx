import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../contexts/ProjectContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit3, FiFolder, FiBook, FiTrendingUp, FiPlus, FiClock, FiTarget, FiX, FiBell } = FiIcons;

const Dashboard = () => {
  const { user } = useAuth();
  const { projects } = useProjects();
  const [announcements, setAnnouncements] = useState([]);
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Set user name
    if (user && user.name) {
      setUserName(user.name);
    }

    // Load announcements from content management
    const savedContent = localStorage.getItem('gospelwise_content');
    if (savedContent) {
      const content = JSON.parse(savedContent);
      if (content.announcements) {
        // Filter for published announcements
        const publishedAnnouncements = content.announcements.filter(
          item => item.status === 'published'
        );
        setAnnouncements(publishedAnnouncements);
      }
    }

    // Load dismissed announcements for this user
    const dismissed = localStorage.getItem(`gospelwise_dismissed_announcements_${user.id}`);
    if (dismissed) {
      setDismissedAnnouncements(JSON.parse(dismissed));
    }
  }, [user.id, user.name]);

  const dismissAnnouncement = (id) => {
    const updatedDismissed = [...dismissedAnnouncements, id];
    setDismissedAnnouncements(updatedDismissed);
    localStorage.setItem(`gospelwise_dismissed_announcements_${user.id}`, JSON.stringify(updatedDismissed));
  };

  const recentProjects = projects.slice(0, 3);
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.progress === 100).length;

  const quickActions = [
    {
      title: 'Start New Project',
      description: 'Begin planning your next book',
      icon: FiPlus,
      href: '/planner',
      color: 'from-primary-500 to-spiritual-500'
    },
    {
      title: 'View All Projects',
      description: 'Manage your writing portfolio',
      icon: FiFolder,
      href: '/projects',
      color: 'from-spiritual-500 to-primary-500'
    }
  ];

  const stats = [
    {
      title: 'Total Projects',
      value: totalProjects,
      icon: FiBook,
      color: 'text-primary-600'
    },
    {
      title: 'Completed',
      value: completedProjects,
      icon: FiTarget,
      color: 'text-spiritual-600'
    },
    {
      title: 'In Progress',
      value: totalProjects - completedProjects,
      icon: FiClock,
      color: 'text-secondary-600'
    }
  ];

  // Filter out dismissed announcements
  const activeAnnouncements = announcements.filter(
    announcement => !dismissedAnnouncements.includes(announcement.id)
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-spiritual-600 rounded-xl p-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userName || 'Writer'}!</h1>
          <p className="text-primary-100 text-lg">
            Continue your writing journey with God's guidance and wisdom.
          </p>
        </motion.div>
      </div>

      {/* Announcements */}
      {activeAnnouncements.length > 0 && (
        <div className="space-y-3">
          {activeAnnouncements.map(announcement => (
            <div key={announcement.id} className="bg-spiritual-50 border border-spiritual-200 rounded-xl p-4 relative">
              <div className="flex items-start">
                <div className="bg-spiritual-100 rounded-lg p-2 mr-4">
                  <SafeIcon icon={FiBell} className="w-5 h-5 text-spiritual-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-secondary-800 mb-1">{announcement.title}</h3>
                  <p className="text-secondary-600 text-sm">{announcement.description}</p>
                </div>
                <button
                  onClick={() => dismissAnnouncement(announcement.id)}
                  className="text-secondary-400 hover:text-secondary-600 p-1"
                  title="Dismiss"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-secondary-800 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-primary-50 to-spiritual-50 flex items-center justify-center`}>
                <SafeIcon icon={stat.icon} className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <Link
              to={action.href}
              className="block bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <SafeIcon icon={action.icon} className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary-800 group-hover:text-primary-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-secondary-600">{action.description}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary-800">Recent Projects</h2>
          <Link to="/projects" className="text-primary-600 hover:text-primary-700 font-semibold flex items-center space-x-1">
            <span>View All</span>
            <SafeIcon icon={FiFolder} className="w-4 h-4" />
          </Link>
        </div>

        {recentProjects.length > 0 ? (
          <div className="space-y-4">
            {recentProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border border-secondary-200 rounded-lg p-4 hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-spiritual-500 rounded-lg flex items-center justify-center">
                      <SafeIcon icon={FiEdit3} className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-800">{project.title}</h3>
                      <p className="text-sm text-secondary-600">{project.type} • {project.genre}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-secondary-600">{project.progress}% Complete</p>
                    <div className="w-24 h-2 bg-secondary-200 rounded-full mt-1">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-spiritual-500 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <SafeIcon icon={FiEdit3} className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-800 mb-2">No Projects Yet</h3>
            <p className="text-secondary-600 mb-6">Start your first writing project to see it here.</p>
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
    </div>
  );
};

export default Dashboard;