/**
 * LoadingScreen Component
 * Displays a loading state while FSD data is being fetched
 */

import React from 'react';
import { Loader2, Globe } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        {/* Animated Globe Icon */}
        <div className="relative">
          <Globe className="w-24 h-24 text-primary-400 mx-auto animate-pulse" />
          <Loader2 className="w-8 h-8 text-primary-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
        </div>
        
        {/* Loading Text */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-white">
            Tesla FSD Tracker
          </h1>
          <p className="text-lg text-gray-300">
            Loading FSD data from spreadsheet...
          </p>
        </div>
        
        {/* Loading Bar */}
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full animate-pulse"></div>
        </div>
        
        {/* Status */}
        <p className="text-sm text-gray-400">
          Connecting to Google Sheets API
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
