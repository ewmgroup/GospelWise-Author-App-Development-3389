import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { exportToPDF, exportToWord } from '../utils/exportUtils';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiDownload, FiFileText, FiFilePlus, FiCheck, FiAlertTriangle } = FiIcons;

const ExportModal = ({ isOpen, onClose, project }) => {
  const { user } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState('');
  const [exportStatus, setExportStatus] = useState(null); // 'success', 'error', null

  const handleExport = async (type) => {
    setExportType(type);
    setExporting(true);
    setExportStatus(null);
    
    try {
      if (type === 'pdf') {
        exportToPDF(project, user);
        setExportStatus('success');
      } else if (type === 'word') {
        await exportToWord(project, user);
        setExportStatus('success');
      }
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('error');
    } finally {
      setExporting(false);
      // Close the modal after a short delay if successful
      if (exportStatus === 'success') {
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-secondary-800">Export Project</h3>
            <button
              onClick={onClose}
              className="text-secondary-500 hover:text-secondary-700 transition-colors"
            >
              <SafeIcon icon={FiX} className="w-5 h-5" />
            </button>
          </div>

          {exporting ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-secondary-600 mb-2">Exporting your project...</p>
              <p className="text-primary-600 font-medium">
                {exportType === 'pdf' ? 'Generating PDF document' : 'Generating Word document'}
              </p>
            </div>
          ) : exportStatus === 'success' ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-secondary-800 font-medium mb-2">Export Successful!</p>
              <p className="text-secondary-600">Your document has been downloaded.</p>
            </div>
          ) : exportStatus === 'error' ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiAlertTriangle} className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-secondary-800 font-medium mb-2">Export Failed</p>
              <p className="text-secondary-600 mb-4">There was an error exporting your document.</p>
              <button 
                onClick={() => setExportStatus(null)} 
                className="bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <p className="text-secondary-600 mb-6">
                Choose a format to export your {project.type} project. The export will include all your content in a professionally formatted document.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => handleExport('pdf')}
                  className="flex flex-col items-center justify-center p-6 border-2 border-secondary-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
                >
                  <SafeIcon
                    icon={FiFileText}
                    className="w-12 h-12 text-secondary-500 group-hover:text-primary-600 mb-4 transition-colors"
                  />
                  <span className="text-secondary-700 font-medium">PDF Format</span>
                  <span className="text-secondary-500 text-sm">Readable on any device</span>
                </button>
                <button
                  onClick={() => handleExport('word')}
                  className="flex flex-col items-center justify-center p-6 border-2 border-secondary-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
                >
                  <SafeIcon
                    icon={FiFilePlus}
                    className="w-12 h-12 text-secondary-500 group-hover:text-primary-600 mb-4 transition-colors"
                  />
                  <span className="text-secondary-700 font-medium">Word Format</span>
                  <span className="text-secondary-500 text-sm">Editable document</span>
                </button>
              </div>
              <div className="bg-primary-50 border border-primary-200 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-primary-700 mb-2">What's included in your export:</h4>
                <ul className="text-sm text-secondary-600">
                  <li className="flex items-center space-x-2 mb-1">
                    <SafeIcon icon={FiIcons.FiCheck} className="w-4 h-4 text-primary-600" />
                    <span>Cover page with project title and author</span>
                  </li>
                  <li className="flex items-center space-x-2 mb-1">
                    <SafeIcon icon={FiIcons.FiCheck} className="w-4 h-4 text-primary-600" />
                    <span>All sections from your {project.type} planner</span>
                  </li>
                  <li className="flex items-center space-x-2 mb-1">
                    <SafeIcon icon={FiIcons.FiCheck} className="w-4 h-4 text-primary-600" />
                    <span>Professional formatting and layout</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <SafeIcon icon={FiIcons.FiCheck} className="w-4 h-4 text-primary-600" />
                    <span>Page numbering and branding</span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ExportModal;