import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../lib/supabase';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiArrowLeft, FiSearch, FiEdit, FiTrash2, FiUserPlus, FiCheck, FiX } = FiIcons;

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    subscription: 'free',
    role: 'user'
  });
  const [editingUser, setEditingUser] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [actionStatus, setActionStatus] = useState(null); // success, error

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setUsers(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open add user modal
  const openAddUserModal = () => {
    setFormData({
      email: '',
      full_name: '',
      password: '',
      subscription: 'free',
      role: 'user'
    });
    setShowAddUserModal(true);
    setActionStatus(null);
  };

  // Open edit user modal
  const openEditUserModal = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      full_name: user.full_name || '',
      subscription: user.subscription || 'free',
      role: user.role || 'user'
    });
    setShowEditUserModal(true);
    setActionStatus(null);
  };

  // Add a new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    setActionInProgress(true);
    setActionStatus(null);

    try {
      // 1. Create the auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true, // Skip email confirmation
        user_metadata: {
          full_name: formData.full_name
        }
      });

      if (authError) throw authError;

      // 2. Create or update the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: formData.email,
          full_name: formData.full_name,
          subscription: formData.subscription,
          role: formData.role,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // Success
      setActionStatus('success');
      fetchUsers();

      // Close modal after a delay
      setTimeout(() => {
        setShowAddUserModal(false);
        setActionStatus(null);
      }, 1500);
    } catch (error) {
      console.error("Error adding user:", error);
      setActionStatus('error');
    } finally {
      setActionInProgress(false);
    }
  };

  // Update a user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setActionInProgress(true);
    setActionStatus(null);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          subscription: formData.subscription,
          role: formData.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUser.id);

      if (profileError) throw profileError;

      // Success
      setActionStatus('success');
      fetchUsers();

      // Close modal after a delay
      setTimeout(() => {
        setShowEditUserModal(false);
        setActionStatus(null);
      }, 1500);
    } catch (error) {
      console.error("Error updating user:", error);
      setActionStatus('error');
    } finally {
      setActionInProgress(false);
    }
  };

  // Delete a user
  const handleDeleteUser = async (userId) => {
    try {
      setActionInProgress(true);
      
      // Delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) throw authError;
      
      // Delete the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
        
      if (profileError) throw profileError;
      
      // Success
      setShowDeleteConfirm(null);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    } finally {
      setActionInProgress(false);
    }
  };

  // Filtered users based on search
  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
              <SafeIcon icon={FiUsers} className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-800">User Management</h1>
          </div>
        </div>
        <button
          onClick={openAddUserModal}
          className="flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-spiritual-600 text-white px-4 py-2 rounded-lg hover:from-primary-700 hover:to-spiritual-700 transition-colors"
        >
          <SafeIcon icon={FiUserPlus} className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-64">
            <SafeIcon
              icon={FiSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-secondary-50 border-b border-secondary-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-secondary-800">{user.full_name || 'Unnamed User'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-secondary-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-secondary-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.subscription === 'premium'
                          ? 'bg-spiritual-100 text-spiritual-800'
                          : 'bg-secondary-100 text-secondary-800'
                      }`}>
                        {user.subscription === 'premium' ? 'Premium' : 'Free'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'admin'
                          ? 'bg-primary-100 text-primary-800'
                          : 'bg-secondary-100 text-secondary-800'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openEditUserModal(user)}
                          className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
                          title="Edit"
                        >
                          <SafeIcon icon={FiEdit} className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(user.id)}
                          className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete"
                        >
                          <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                        </button>
                        {showDeleteConfirm === user.id && (
                          <div className="absolute mt-8 bg-white rounded-md shadow-lg border border-secondary-200 z-10 p-3 right-8">
                            <p className="text-sm text-secondary-700 mb-2">Delete this user?</p>
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-3 py-1 text-xs text-secondary-700 hover:bg-secondary-100 rounded"
                                disabled={actionInProgress}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                disabled={actionInProgress}
                              >
                                {actionInProgress ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-secondary-500">
                    {searchTerm ? "No users match your search" : "No users found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-secondary-800">Add New User</h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-secondary-500 hover:text-secondary-700 transition-colors"
                disabled={actionInProgress}
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>

            {actionStatus === 'success' ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-secondary-800 font-medium">User added successfully!</p>
              </div>
            ) : actionStatus === 'error' ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                Failed to add user. Please check the information and try again.
              </div>
            ) : (
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Subscription
                  </label>
                  <select
                    name="subscription"
                    value={formData.subscription}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800 transition-colors"
                    disabled={actionInProgress}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-primary-600 to-spiritual-600 text-white rounded-lg hover:from-primary-700 hover:to-spiritual-700 transition-colors"
                    disabled={actionInProgress}
                  >
                    {actionInProgress ? 'Adding User...' : 'Add User'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-secondary-800">Edit User</h3>
              <button
                onClick={() => setShowEditUserModal(false)}
                className="text-secondary-500 hover:text-secondary-700 transition-colors"
                disabled={actionInProgress}
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>

            {actionStatus === 'success' ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-secondary-800 font-medium">User updated successfully!</p>
              </div>
            ) : actionStatus === 'error' ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                Failed to update user. Please try again.
              </div>
            ) : (
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-secondary-100"
                    disabled
                  />
                  <p className="text-xs text-secondary-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Subscription
                  </label>
                  <select
                    name="subscription"
                    value={formData.subscription}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditUserModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800 transition-colors"
                    disabled={actionInProgress}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-primary-600 to-spiritual-600 text-white rounded-lg hover:from-primary-700 hover:to-spiritual-700 transition-colors"
                    disabled={actionInProgress}
                  >
                    {actionInProgress ? 'Updating...' : 'Update User'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;