import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiFolder, FiEdit3, FiBook, FiTrendingUp, FiUser, FiLogOut, FiSettings, FiShield } = FiIcons;

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin, isSuperAdmin } = useAuth();
  const [scriptureText, setScriptureText] = useState('');
  const [userDisplayName, setUserDisplayName] = useState('User');

  useEffect(() => {
    // Set user display name
    if (user && user.name) {
      setUserDisplayName(user.name);
    } else {
      setUserDisplayName('User');
    }

    // Load scripture text
    const systemSettings = JSON.parse(localStorage.getItem('gospelwise_system_settings') || '{}');
    if (systemSettings.scriptures && systemSettings.scriptures.length > 0) {
      // Use scriptures from system settings
      const randomIndex = Math.floor(Math.random() * systemSettings.scriptures.length);
      setScriptureText(systemSettings.scriptures[randomIndex]);
    } else {
      // Use default scriptures
      const scriptures = [
        "\"For I know the plans I have for you,\" declares the Lord, \"plans to prosper you and not to harm you, to give you hope and a future.\" - Jeremiah 29:11",
        "\"She is clothed with strength and dignity; she can laugh at the days to come.\" - Proverbs 31:25",
        "\"Trust in the Lord with all your heart and lean not on your own understanding.\" - Proverbs 3:5",
        "\"The heart of man plans his way, but the Lord establishes his steps.\" - Proverbs 16:9"
      ];
      const randomIndex = Math.floor(Math.random() * scriptures.length);
      setScriptureText(scriptures[randomIndex]);
    }
  }, [location.pathname, user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'My Projects', href: '/projects', icon: FiFolder },
    { name: 'StoryWise Planner', href: '/planner', icon: FiEdit3 },
    { name: 'Publishing Tools', href: '/publishing', icon: FiBook, comingSoon: true },
    { name: 'Marketing Tools', href: '/marketing', icon: FiTrendingUp, comingSoon: true },
  ];

  // Admin navigation items
  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-spiritual-50">
      {/* Scripture Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-spiritual-600 text-white py-3 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm font-medium font-serif italic">
            {scriptureText}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-spiritual-500 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiEdit3} className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-secondary-800">GospelWise</span>
              </Link>

              <div className="hidden md:flex space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                    } ${item.comingSoon ? 'opacity-60' : ''}`}
                  >
                    <SafeIcon icon={item.icon} className="w-4 h-4" />
                    <span>{item.name}</span>
                    {item.comingSoon && (
                      <span className="text-xs bg-primary-200 text-primary-700 px-2 py-0.5 rounded-full">
                        Soon
                      </span>
                    )}
                  </Link>
                ))}

                {/* Show admin navigation items if user is admin */}
                {isAdmin() && adminNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname.startsWith('/admin')
                        ? 'bg-spiritual-100 text-spiritual-700'
                        : 'text-secondary-600 hover:text-spiritual-600 hover:bg-spiritual-50'
                    }`}
                  >
                    <SafeIcon icon={item.icon} className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-secondary-600">
                <SafeIcon icon={FiUser} className="w-4 h-4" />
                <span>{userDisplayName}</span>
                {isSuperAdmin() ? (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                    Super Admin
                  </span>
                ) : isAdmin() && (
                  <span className="text-xs bg-spiritual-100 text-spiritual-700 px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
              >
                <SafeIcon icon={FiLogOut} className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;