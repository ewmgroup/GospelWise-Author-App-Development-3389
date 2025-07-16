import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiClock, FiMail } = FiIcons;

const MarketingTools = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-secondary-800 mb-4">Marketing Tools</h1>
        <p className="text-secondary-600 max-w-2xl mx-auto">
          Powerful marketing tools designed specifically for Christian authors to reach their target audience.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl p-12 shadow-lg text-center"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-spiritual-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <SafeIcon icon={FiTrendingUp} className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-secondary-800 mb-4">Coming Soon</h2>
        <p className="text-secondary-600 mb-6 max-w-md mx-auto">
          We're developing comprehensive marketing tools to help you promote your Christian books effectively:
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
          <div className="bg-gradient-to-br from-primary-50 to-spiritual-50 p-6 rounded-lg">
            <h3 className="font-semibold text-secondary-800 mb-2">Social Media Campaigns</h3>
            <p className="text-secondary-600 text-sm">Create and schedule content across multiple platforms</p>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-spiritual-50 p-6 rounded-lg">
            <h3 className="font-semibold text-secondary-800 mb-2">Email Marketing</h3>
            <p className="text-secondary-600 text-sm">Build and nurture your reader community</p>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-spiritual-50 p-6 rounded-lg">
            <h3 className="font-semibold text-secondary-800 mb-2">Launch Strategy</h3>
            <p className="text-secondary-600 text-sm">Plan and execute successful book launches</p>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-spiritual-50 p-6 rounded-lg">
            <h3 className="font-semibold text-secondary-800 mb-2">Analytics & Insights</h3>
            <p className="text-secondary-600 text-sm">Track your marketing performance and ROI</p>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 text-primary-600 mb-6">
          <SafeIcon icon={FiClock} className="w-5 h-5" />
          <span className="font-medium">Expected Launch: Q3 2026</span>
        </div>

        <div className="bg-gradient-to-br from-primary-50 to-spiritual-50 p-6 rounded-lg">
          <h3 className="font-semibold text-secondary-800 mb-2 flex items-center justify-center space-x-2">
            <SafeIcon icon={FiMail} className="w-5 h-5" />
            <span>Get Notified</span>
          </h3>
          <p className="text-secondary-600 text-sm mb-4">
            Be the first to know when Marketing Tools are available
          </p>
          <button className="bg-gradient-to-r from-primary-600 to-spiritual-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-spiritual-700 transition-all duration-300">
            Join Waitlist
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MarketingTools;