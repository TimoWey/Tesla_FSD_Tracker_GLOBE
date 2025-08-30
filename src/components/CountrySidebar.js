/**
 * CountrySidebar Component - Simplified Version
 * Displays detailed information about a selected country's FSD status
 */

import React, { forwardRef } from 'react';
import { X, ExternalLink, Calendar, MapPin, Info } from 'lucide-react';
import clsx from 'clsx';

// Constants
import { STATUS_COLORS } from '../services/googleSheetsService';

const CountrySidebar = forwardRef(({ selectedCountry, fsdData, isVisible, onClose, isMobile }, ref) => {
  if (!isVisible || !selectedCountry) {
    return null;
  }

  // Simple country data lookup
  const countryData = fsdData[selectedCountry];
  
  // If no data exists for this country, show "No Data" message
  if (!countryData) {
    return (
      <div 
        ref={ref}
        className={clsx(
          "sidebar-panel right-0 z-50",
          isMobile ? "w-11/12 max-w-md" : "w-96",
          isVisible ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-700/30 bg-gray-800/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold text-white truncate">{selectedCountry}</h2>
              </div>
              <button 
                onClick={onClose}
                className="glass-button w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                title="Close"
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Status Badge - New line within header */}
            <div className="status-badge bg-gray-600 inline-flex items-center text-xs sm:text-sm px-3 py-1.5">
              <span>No Data</span>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto scrollbar-thin">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-400">
                <Info className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Information</span>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                No FSD (Full Self-Driving) data available for this country at this time.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-400">
                <Info className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Note</span>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                This country may not have Tesla vehicles, FSD testing programs, or regulatory frameworks in place yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to check if text is a URL
  const isUrl = (text) => {
    if (!text || typeof text !== 'string') return false;
    return text.includes('http://') || text.includes('https://') || text.includes('www.');
  };

  // Helper function to detect if text contains separators
  const hasSeparators = (text) => {
    if (typeof text !== 'string') return false;
    return text.includes(';') || text.includes('\n') || text.includes('|');
  };

  // Helper function to split text by separators
  const splitBySeparators = (text) => {
    if (typeof text !== 'string') return [text];
    return text
      .split(/[;\n|]/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  // Helper function to render list items
  const renderListItems = (items, icon, className = '') => {
    if (!items) return null;
    
    const itemArray = Array.isArray(items) ? items : [items];
    
    // Check if the single item contains separators (like semicolons)
    if (itemArray.length === 1) {
      const singleItem = itemArray[0];
      
      // Check if the text contains common separators
      if (hasSeparators(singleItem)) {
        // Split by separators and filter out empty items
        const splitItems = splitBySeparators(singleItem);
        
        // If we have multiple items after splitting, show as list
        if (splitItems.length > 1) {
          return (
            <ul className={clsx("space-y-2", className)}>
              {splitItems.map((item, index) => (
                <li key={index} className="flex items-start space-x-3 text-gray-300">
                  <span className="text-primary-400 text-lg leading-none mt-0.5 flex-shrink-0">{icon}</span>
                  <span className="flex-1 text-sm sm:text-base leading-relaxed break-words">{item}</span>
                </li>
              ))}
            </ul>
          );
        }
      }
      
      // Single item with no separators - display as plain text without bullet points
      return (
        <p className={clsx("text-gray-300 text-sm sm:text-base leading-relaxed break-words", className)}>
          {singleItem}
        </p>
      );
    }
    
    // Multiple items - display as list with bullet points
    return (
      <ul className={clsx("space-y-2", className)}>
        {itemArray.map((item, index) => (
          <li key={index} className="flex items-start space-x-3 text-gray-300">
            <span className="text-primary-400 text-lg leading-none mt-0.5 flex-shrink-0">{icon}</span>
            <span className="flex-1 text-sm sm:text-base leading-relaxed break-words">{item}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Helper function to render links
  const renderLinks = (items) => {
    if (!items) return null;
    
    const itemArray = Array.isArray(items) ? items : [items];
    
    // Check if the single item contains separators (like semicolons)
    if (itemArray.length === 1) {
      const singleItem = itemArray[0];
      
      // Check if the text contains common separators
      if (hasSeparators(singleItem)) {
        // Split by separators and filter out empty items
        const splitItems = splitBySeparators(singleItem);
        
        // If we have multiple items after splitting, show as list
        if (splitItems.length > 1) {
          return (
            <ul className="space-y-2">
              {splitItems.map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-primary-400 text-lg leading-none mt-0.5 flex-shrink-0">•</span>
                  {isUrl(item) ? (
                    <a 
                      href={item} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 underline transition-colors duration-200 text-sm sm:text-base leading-relaxed break-all"
                      title={`Click to open: ${item}`}
                    >
                      {item}
                      <ExternalLink className="inline w-3 h-3 ml-1 flex-shrink-0" />
                    </a>
                  ) : (
                    <span className="text-gray-300 flex-1 text-sm sm:text-base leading-relaxed break-words">{item}</span>
                  )}
                </li>
              ))}
            </ul>
          );
        }
      }
      
      // Single item with no separators - display as plain text without bullet points
      const item = singleItem;
      if (isUrl(item)) {
        return (
          <a 
            href={item} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-400 hover:text-primary-300 underline transition-colors duration-200 text-sm sm:text-base leading-relaxed break-all"
            title={`Click to open: ${item}`}
          >
            {item}
            <ExternalLink className="inline w-3 h-3 ml-1 flex-shrink-0" />
          </a>
        );
      } else {
        return (
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed break-words">
            {item}
          </p>
        );
      }
    }
    
    // Multiple items - display as list with bullet points
    return (
      <ul className="space-y-2">
        {itemArray.map((item, index) => (
          <li key={index} className="flex items-start space-x-3">
            <span className="text-primary-400 text-lg leading-none mt-0.5 flex-shrink-0">•</span>
            {isUrl(item) ? (
              <a 
                href={item} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 underline transition-colors duration-200 text-sm sm:text-base leading-relaxed break-all"
                title={`Click to open: ${item}`}
              >
                {item}
                <ExternalLink className="inline w-3 h-3 ml-1 flex-shrink-0" />
              </a>
            ) : (
              <span className="text-gray-300 flex-1 text-sm sm:text-base leading-relaxed break-words">{item}</span>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div 
      ref={ref}
      className={clsx(
        "sidebar-panel right-0 z-50",
        isMobile ? "w-11/12 max-w-md" : "w-96",
        isVisible ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-700/30 bg-gray-800/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <h2 className="text-lg sm:text-xl font-bold text-white truncate">{selectedCountry}</h2>
            </div>
            <button 
              onClick={onClose}
              className="glass-button w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              title="Close"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Status Badge - New line within header */}
          <div 
            className="status-badge inline-flex items-center text-xs sm:text-sm px-3 py-1.5"
            style={{ backgroundColor: STATUS_COLORS[countryData.status] || '#6B7280' }}
          >
            <span>{countryData.status}</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto scrollbar-thin">
          {/* Details Section */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-white border-b border-gray-700/30 pb-2">
              Details
            </h3>
            {renderListItems(countryData.details, '•')}
          </div>

          {/* Latest Update Section */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-white border-b border-gray-700/30 pb-2">
              Latest Update
            </h3>
            {renderListItems(countryData.latestUpdate, '•')}
          </div>

          {/* Milestones Section */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-white border-b border-gray-700/30 pb-2">
              Milestones
            </h3>
            {renderListItems(countryData.milestones, '•')}
          </div>

          {/* Source Section */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-white border-b border-gray-700/30 pb-2">
              Sources
            </h3>
            {renderLinks(countryData.source)}
          </div>

          {/* Last Updated Section */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-white border-b border-gray-700/30 pb-2">
              Last Updated
            </h3>
            <div className="flex items-center space-x-2 text-primary-400">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base break-words">{countryData.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CountrySidebar.displayName = 'CountrySidebar';

export default CountrySidebar;
