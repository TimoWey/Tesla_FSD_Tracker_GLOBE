/**
 * ErrorScreen Component
 * Displays error state when FSD data fails to load
 */

import React from 'react';
import { AlertTriangle, RefreshCw, Globe, ExternalLink } from 'lucide-react';

const ErrorScreen = ({ error, onRetry }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-6">
        {/* Error Icon */}
        <div className="relative">
          <Globe className="w-16 h-16 sm:w-20 sm:h-20 text-red-400 mx-auto opacity-50" />
          <AlertTriangle className="w-8 h-8 sm:w-12 sm:h-12 text-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        {/* Error Title */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-white break-words">
            Error Loading Data
          </h1>
          <p className="text-base sm:text-lg text-red-300 break-words">
            {error}
          </p>
        </div>
        
        {/* Troubleshooting Steps */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 sm:p-6 text-left max-w-lg mx-auto">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4 break-words">
            Troubleshooting Steps:
          </h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start space-x-3">
              <span className="text-primary-400 font-bold flex-shrink-0">1.</span>
              <span className="text-sm sm:text-base break-words">Verify your Google Sheets API key is configured correctly</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-primary-400 font-bold flex-shrink-0">2.</span>
              <span className="text-sm sm:text-base break-words">Ensure your spreadsheet is publicly accessible</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-primary-400 font-bold flex-shrink-0">3.</span>
              <span className="text-sm sm:text-base break-words">Check that the spreadsheet ID and sheet name are correct</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-primary-400 font-bold flex-shrink-0">4.</span>
              <span className="text-sm sm:text-base break-words">Verify your Google Cloud Console project has the Sheets API enabled</span>
            </li>
          </ul>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRetry}
            className="inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm sm:text-base"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          
          <a
            href="https://developers.google.com/sheets/api/quickstart/js"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 text-sm sm:text-base"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Setup Guide</span>
          </a>
        </div>
        
        {/* Additional Help */}
        <div className="text-xs sm:text-sm text-gray-400 space-y-2">
          <p className="break-words">
            If the problem persists, check the browser console for detailed error information.
          </p>
          <p className="break-words">
            Need help? Check the{' '}
            <a 
              href="https://github.com/TimoWey/FSD_Progress_Tracker" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 underline"
            >
              GitHub repository
            </a>{' '}
            for support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorScreen;
