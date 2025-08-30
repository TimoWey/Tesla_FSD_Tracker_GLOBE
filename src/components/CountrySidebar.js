/**
 * CountrySidebar Component
 * Displays detailed information about a selected country's FSD status
 */

import React, { forwardRef } from 'react';
import { X, ExternalLink, Calendar, MapPin, Info } from 'lucide-react';
import clsx from 'clsx';

// Constants
import { STATUS_COLORS } from '../constants';

const CountrySidebar = forwardRef(({ selectedCountry, fsdData, isVisible, onClose, isMobile }, ref) => {
  if (!isVisible || !selectedCountry) {
    return null;
  }

  // Find matching country data
  const findCountryData = (countryName) => {
    // Direct match first
    if (fsdData[countryName]) {
      return { data: fsdData[countryName], key: countryName };
    }
    
    // Try to find by geoName
    for (const [key, data] of Object.entries(fsdData)) {
      if (data.geoName === countryName) {
        return { data, key };
      }
    }
    
    // Try partial matches for common variations
    const normalizedName = countryName.toLowerCase().replace(/[^a-z]/g, '');
    for (const [key, data] of Object.entries(fsdData)) {
      const normalizedKey = key.toLowerCase().replace(/[^a-z]/g, '');
      const normalizedGeoName = data.geoName.toLowerCase().replace(/[^a-z]/g, '');
      
      if (normalizedKey === normalizedName || normalizedGeoName === normalizedName) {
        return { data, key };
      }
    }
    
    return null;
  };

  const countryMatch = findCountryData(selectedCountry);
  
  // If no data exists for this country, show "No Data" message
  if (!countryMatch) {
    return (
      <div 
        ref={ref}
        className={clsx(
          "sidebar-panel right-0 z-50",
          isMobile ? "w-full" : "w-96",
          isVisible ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/30 bg-gray-800/50">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl font-bold text-white">{selectedCountry}</h2>
            </div>
            <div className="status-badge bg-gray-600">
              No Data
            </div>
            <button 
              onClick={onClose}
              className="glass-button w-8 h-8 flex items-center justify-center"
              title="Close"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-thin">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-400">
                <Info className="w-4 h-4" />
                <span className="text-sm">Information</span>
              </div>
              <p className="text-gray-300">
                No FSD (Full Self-Driving) data available for this country at this time.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-400">
                <Info className="w-4 h-4" />
                <span className="text-sm">Note</span>
              </div>
              <p className="text-gray-300">
                This country may not have Tesla vehicles, FSD testing programs, or regulatory frameworks in place yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const countryData = countryMatch.data;

  // Helper function to check if text is a URL
  const isUrl = (text) => {
    if (!text || typeof text !== 'string') return false;
    return text.includes('http://') || text.includes('https://') || text.includes('www.');
  };

  // Helper function to render list items
  const renderListItems = (items, icon, className = '') => {
    if (!items) return null;
    
    const itemArray = Array.isArray(items) ? items : [items];
    
    return (
      <ul className={clsx("space-y-2", className)}>
        {itemArray.map((item, index) => (
          <li key={index} className="flex items-start space-x-3 text-gray-300">
            <span className="text-primary-400 mt-1">{icon}</span>
            <span className="flex-1">{item}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Helper function to render links
  const renderLinks = (items) => {
    if (!items) return null;
    
    const itemArray = Array.isArray(items) ? items : [items];
    
    return (
      <ul className="space-y-2">
        {itemArray.map((item, index) => (
          <li key={index} className="flex items-start space-x-3">
            <span className="text-primary-400 mt-1">•</span>
            {isUrl(item) ? (
              <a 
                href={item} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 underline transition-colors duration-200"
                title={`Click to open: ${item}`}
              >
                {item}
                <ExternalLink className="inline w-3 h-3 ml-1" />
              </a>
            ) : (
              <span className="text-gray-300 flex-1">{item}</span>
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
        isMobile ? "w-full" : "w-96",
        isVisible ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/30 bg-gray-800/50">
          <div className="flex items-center space-x-3 min-w-0">
            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <h2 className="text-xl font-bold text-white truncate">{countryData.geoName}</h2>
          </div>
          <div 
            className="status-badge flex-shrink-0"
            style={{ backgroundColor: STATUS_COLORS[countryData.status] || '#6B7280' }}
          >
            {countryData.status}
          </div>
          <button 
            onClick={onClose}
            className="glass-button w-8 h-8 flex items-center justify-center flex-shrink-0"
            title="Close"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-thin">
          {/* Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700/30 pb-2">
              Details
            </h3>
            {renderListItems(countryData.details, '•')}
          </div>

          {/* Latest Update Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700/30 pb-2">
              Latest Update
            </h3>
            {renderListItems(countryData.latestUpdate, '•')}
          </div>

          {/* Milestones Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700/30 pb-2">
              Milestones
            </h3>
            {renderListItems(countryData.milestones, '•')}
          </div>

          {/* Source Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700/30 pb-2">
              Sources
            </h3>
            {renderLinks(countryData.source)}
          </div>

          {/* Last Updated Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700/30 pb-2">
              Last Updated
            </h3>
            <div className="flex items-center space-x-2 text-primary-400">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">{countryData.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CountrySidebar.displayName = 'CountrySidebar';

export default CountrySidebar;
