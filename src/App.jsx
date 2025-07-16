import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import MyProjects from './pages/MyProjects';
import StoryWisePlanner from './pages/StoryWisePlanner';
import PublishingTools from './pages/PublishingTools';
import MarketingTools from './pages/MarketingTools';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import SystemSettings from './pages/admin/SystemSettings';
import ContentManagement from './pages/admin/ContentManagement';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes for all logged-in users */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/projects" element={
              <ProtectedRoute>
                <Layout>
                  <MyProjects />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/planner/:projectId?" element={
              <ProtectedRoute>
                <Layout>
                  <StoryWisePlanner />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/publishing" element={
              <ProtectedRoute>
                <Layout>
                  <PublishingTools />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/marketing" element={
              <ProtectedRoute>
                <Layout>
                  <MarketingTools />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Admin-only routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </AdminRoute>
            } />
            
            <Route path="/admin/user-management" element={
              <AdminRoute>
                <Layout>
                  <UserManagement />
                </Layout>
              </AdminRoute>
            } />
            
            <Route path="/admin/system-settings" element={
              <AdminRoute>
                <Layout>
                  <SystemSettings />
                </Layout>
              </AdminRoute>
            } />
            
            <Route path="/admin/content-management" element={
              <AdminRoute>
                <Layout>
                  <ContentManagement />
                </Layout>
              </AdminRoute>
            } />
          </Routes>
        </Router>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;