import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProjects } from '../../contexts/ProjectContext';
import supabase from '../../lib/supabase';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiBook, FiActivity, FiSettings, FiPieChart } = FiIcons;

const AdminDashboard = () => {
  const { user } = useAuth();
  const { projects } = useProjects();
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setRegisteredUsers(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading dashboard: {error}</p>
        </div>
      </div>
    );
  }

  const totalUsers = registeredUsers.length;
  const premiumUsers = registeredUsers.filter(u => u.subscription === 'premium').length;
  const activeUsers = registeredUsers.filter(u => {
    const lastActivity = new Date(u.last_sign_in_at || u.created_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastActivity >= thirtyDaysAgo;
  }).length;

  const stats = [
    { title: 'Total Users', value: totalUsers, icon: FiUsers, color: 'from-blue-500 to-blue-600' },
    { title: 'Total Projects', value: projects.length, icon: FiBook, color: 'from-primary-500 to-primary-600' },
    { title: 'Active Users', value: activeUsers, icon: FiActivity, color: 'from-green-500 to-green-600' },
    { title: 'Premium Users', value: premiumUsers, icon: FiPieChart, color: 'from-spiritual-500 to-spiritual-600' }
  ];

  // Get recent users (last 5)
  const recentUsers = [...registeredUsers]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-secondary-700 to-secondary-900 rounded-xl p-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-secondary-200 text-lg">
            Manage GospelWise Author platform and users
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Admin Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-secondary-800">Recent Users</h2>
            <span className="text-primary-600 font-medium text-sm">
              {totalUsers} Total Users
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-secondary-200">
                  <th className="py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">User</th>
                  <th className="py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Email</th>
                  <th className="py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Joined</th>
                  <th className="py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Plan</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <tr key={user.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                      <td className="py-4 whitespace-nowrap">
                        <div className="font-medium text-secondary-800">{user.full_name || 'Unnamed User'}</div>
                      </td>
                      <td className="py-4 whitespace-nowrap text-secondary-600">{user.email}</td>
                      <td className="py-4 whitespace-nowrap text-secondary-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.subscription === 'premium'
                              ? 'bg-spiritual-100 text-spiritual-800'
                              : 'bg-secondary-100 text-secondary-800'
                          }`}
                        >
                          {user.subscription === 'premium' ? 'Premium' : 'Free'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-secondary-500">
                      No registered users yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-secondary-800 mb-6">Quick Settings</h2>
          <div className="space-y-4">
            <Link to="/admin/user-management" className="block">
              <div className="p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={FiUsers} className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary-800">User Management</h3>
                    <p className="text-sm text-secondary-600">Manage accounts and permissions</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/admin/system-settings" className="block">
              <div className="p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={FiSettings} className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary-800">System Settings</h3>
                    <p className="text-sm text-secondary-600">Configure app parameters</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/admin/content-management" className="block">
              <div className="p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={FiBook} className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary-800">Content Management</h3>
                    <p className="text-sm text-secondary-600">Manage app content and resources</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;