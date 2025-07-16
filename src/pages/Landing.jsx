import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit3, FiBook, FiTrendingUp, FiUsers, FiStar, FiArrowRight } = FiIcons;

const Landing = () => {
  const features = [
    {
      icon: FiEdit3,
      title: 'StoryWise Planner',
      description: 'Plan your fiction or non-fiction book with gospel-centered templates and guided frameworks.'
    },
    {
      icon: FiBook,
      title: 'Publishing Tools',
      description: 'Format, design, and publish your book with professional-grade tools built for Christian authors.'
    },
    {
      icon: FiTrendingUp,
      title: 'Marketing Tools',
      description: 'Promote your book effectively with marketing strategies tailored for Christian audiences.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Christian Fiction Author',
      content: 'GospelWise helped me organize my thoughts and create a compelling narrative that truly honors God.',
      rating: 5
    },
    {
      name: 'Pastor Michael Chen',
      role: 'Non-Fiction Author',
      content: 'The planning tools are incredible. I finished my devotional book 3 months ahead of schedule.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-spiritual-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-spiritual-500 rounded-xl flex items-center justify-center shadow-lg">
                  <SafeIcon icon={FiEdit3} className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-secondary-800 mb-6">
                <span className="bg-gradient-to-r from-primary-600 to-spiritual-600 bg-clip-text text-transparent">
                  GospelWise
                </span>{' '}
                Author
              </h1>
              <p className="text-xl md:text-2xl text-secondary-600 mb-8 max-w-3xl mx-auto font-serif">
                Empower your Christian writing journey with gospel-centered tools for planning, publishing, and promoting your books.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary-600 to-spiritual-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-primary-700 hover:to-spiritual-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Start Writing Today
                </Link>
                <Link
                  to="/login"
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-300 shadow-lg border border-primary-200"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-4">
              Everything You Need to Write with Purpose
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              From initial concept to published book, GospelWise provides the tools Christian authors need to succeed.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-gradient-to-br from-primary-50 to-spiritual-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-spiritual-500 rounded-lg flex items-center justify-center mb-6">
                  <SafeIcon icon={feature.icon} className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-4">{feature.title}</h3>
                <p className="text-secondary-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gradient-to-br from-primary-50 to-spiritual-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-4">
              Trusted by Christian Authors
            </h2>
            <p className="text-xl text-secondary-600">
              See how GospelWise is helping writers share their God-given stories.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <SafeIcon key={i} icon={FiStar} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-secondary-700 mb-6 font-serif italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-secondary-800">{testimonial.name}</p>
                  <p className="text-secondary-600">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary-600 to-spiritual-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Share Your God-Given Story?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of Christian authors who are using GospelWise to plan, publish, and promote their books.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span>Get Started Free</span>
              <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing;