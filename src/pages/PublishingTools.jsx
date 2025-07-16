import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBook, FiClock, FiMail } = FiIcons;

const PublishingTools = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-secondary-800 mb-4">Publishing Tools</h1>
        <p className="text-secondary-600 max-w-2xl mx-auto">
          Professional publishing tools to help you format, design, and publish your Christian books.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl p-12 shadow-lg text-center"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-spiritual-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <SafeIcon icon={FiBook} className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-secondary-800 mb-4">Coming Soon</h2>
        <p className="text-secondary-600 mb-6 max-w-md mx-auto">
          We're working hard to bring you comprehensive publishing tools including:
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
          <div className="bg-gradient-to-br from-primary-50 to-spiritual-50 p-6 rounded-lg">
            <h3 className="font-semibold text-secondary-800 mb-2">Manuscript Formatting</h3>
            <p className="text-secondary-600 text-sm">Professional formatting for print and digital publishing</p>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-spiritual-50 p-6 rounded-lg">
            <h3 className="font-semibold text-secondary-800 mb-2">Cover Design</h3>
            <p className="text-secondary-600 text-sm">Create stunning book covers with our design tools</p>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-spiritual-50 p-6 rounded-lg">
            <h3 className="font-semibold text-secondary-800 mb-2">ISBN Management</h3>
            <p className="text-secondary-600 text-sm">Manage your book identifiers and metadata</p>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-spiritual-50 p-6 rounded-lg">
            <h3 className="font-semibold text-secondary-800 mb-2">Distribution</h3>
            <p className="text-secondary-600 text-sm">Publish to major platforms and bookstores</p>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 text-primary-600 mb-6">
          <SafeIcon icon={FiClock} className="w-5 h-5" />
          <span className="font-medium">Expected Launch: Q1 2026</span>
        </div>

        <div className="bg-gradient-to-br from-primary-50 to-spiritual-50 p-6 rounded-lg">
          <h3 className="font-semibold text-secondary-800 mb-2 flex items-center justify-center space-x-2">
            <SafeIcon icon={FiMail} className="w-5 h-5" />
            <span>Get Notified</span>
          </h3>
          <p className="text-secondary-600 text-sm mb-4">
            Be the first to know when Publishing Tools are available
          </p>
          <button className="bg-gradient-to-r from-primary-600 to-spiritual-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-spiritual-700 transition-all duration-300">
            Join Waitlist
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PublishingTools;