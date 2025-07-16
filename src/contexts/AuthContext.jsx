import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrationStatus, setRegistrationStatus] = useState(null);

  // Hardcoded admin credentials - these bypass Supabase authentication
  const HARDCODED_ADMIN = {
    email: 'admin@gospelwiseauthor.com',
    password: '60163fsnje',
    id: 'admin-1',
    name: 'Admin',
    subscription: 'admin',
    role: 'superadmin'
  };

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        // Check Supabase session first
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Get user metadata from auth
          const { data: { user: authUser } } = await supabase.auth.getUser();
          const userMetadata = authUser?.user_metadata || {};

          // Get user profile from Supabase profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          // Priority for name: 1. Profile name, 2. Auth metadata name, 3. Default
          const displayName = profile?.name || profile?.full_name || userMetadata?.full_name || 'User';

          const userSession = {
            id: session.user.id,
            email: session.user.email,
            name: displayName,
            subscription: profile?.subscription || 'free',
            role: profile?.role || 'user'
          };

          setUser(userSession);
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email, password) => {
    // Check for hardcoded admin first
    if (email.toLowerCase() === HARDCODED_ADMIN.email.toLowerCase()) {
      if (password !== HARDCODED_ADMIN.password) {
        throw new Error('Invalid admin credentials');
      }
      setUser(HARDCODED_ADMIN);
      return HARDCODED_ADMIN;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Get user metadata from auth
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const userMetadata = authUser?.user_metadata || {};

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      // Priority for name: 1. Profile name, 2. Auth metadata name, 3. Default
      const displayName = profile?.name || profile?.full_name || userMetadata?.full_name || 'User';

      const userSession = {
        id: data.user.id,
        email: data.user.email,
        name: displayName,
        subscription: profile?.subscription || 'free',
        role: profile?.role || 'user'
      };

      setUser(userSession);
      return userSession;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    setRegistrationStatus(null);

    // Prevent registration with admin email
    if (email.toLowerCase() === HARDCODED_ADMIN.email.toLowerCase()) {
      throw new Error('Cannot register with this email address');
    }

    try {
      console.log("Starting registration process for:", email);
      
      // First, create the auth user (without email confirmation for now)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          // Disable email confirmation for testing
          emailRedirectTo: `${window.location.origin}/#/login?verified=true`
        }
      });

      if (authError) {
        console.error("Auth signup error:", authError);
        throw authError;
      }

      if (!authData || !authData.user) {
        console.error("No user data returned from auth signup");
        throw new Error('Failed to create user account');
      }

      console.log("Auth user created successfully:", authData.user.id);

      // Create profile with correct fields
      const newProfile = {
        id: authData.user.id,
        full_name: name,
        name: name, // Add name field too
        email: email,
        subscription: 'free',
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log("Attempting to create profile with data:", newProfile);

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([newProfile]);

      if (profileError) {
        console.error("Profile creation error:", profileError);
        throw new Error(`Database error saving new user: ${profileError.message}`);
      }

      console.log("Profile created successfully");

      // Set registration status
      setRegistrationStatus({
        success: true,
        message: "Your account has been created successfully! You can now log in."
      });

      return {
        success: true,
        requiresEmailConfirmation: false // Changed for testing
      };
    } catch (error) {
      console.error("Registration error:", error);
      setRegistrationStatus({
        success: false,
        message: error.message || "Registration failed. Please try again."
      });
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    await supabase.auth.signOut();
  };

  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'superadmin';
  };

  const isSuperAdmin = () => {
    return user?.role === 'superadmin';
  };

  // Get all registered users (admin only)
  const getAllUsers = async () => {
    if (!isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(user => ({
        id: user.id,
        name: user.name || user.full_name,
        email: user.email,
        subscription: user.subscription,
        role: user.role,
        createdAt: user.created_at
      }));
    } catch (error) {
      console.error("Error getting users:", error);
      throw error;
    }
  };

  // Update user profile data
  const updateUserProfile = async (userData) => {
    if (!user) return null;

    try {
      // If email is being updated, we need to update it in auth first
      if (userData.email && userData.email !== user.email) {
        const { data, error: updateAuthError } = await supabase.auth.updateUser({
          email: userData.email
        });

        if (updateAuthError) throw updateAuthError;
      }

      // Update profile fields
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({
          ...userData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateProfileError) throw updateProfileError;

      // Update local user state
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAdmin,
    isSuperAdmin,
    getAllUsers,
    updateUserProfile,
    registrationStatus,
    setRegistrationStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};