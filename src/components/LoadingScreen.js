/**
 * LoadingScreen Component
 * Displays a loading state while FSD data is being fetched
 */

import React from 'react';
import { Loader2, Globe } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="text-center space-y-6 p-4 sm:p-8 max-w-full">
        {/* Animated Globe Icon */}
        <div className="relative">
          <Globe className="w-16 h-16 sm:w-24 sm:h-24 text-primary-400 mx-auto animate-pulse" />
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
        </div>
        
        {/* Loading Text */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-white break-words">
            Tesla FSD Tracker
          </h1>
          <p className="text-base sm:text-lg text-gray-300 break-words">
            Loading FSD data from spreadsheet...
          </p>
        </div>
        
        {/* Loading Bar */}
        <div className="w-48 sm:w-64 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full animate-pulse"></div>
        </div>
        
        {/* Status */}
        <p className="text-xs sm:text-sm text-gray-400 break-words">
          Connecting to Google Sheets API
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
