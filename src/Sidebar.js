import React, { useEffect, useRef } from 'react';
import './Sidebar.css';

const Sidebar = ({ selectedCountry, fsdData, isVisible, onClose }) => {
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  // Add touch/swipe gesture support for mobile
  useEffect(() => {
    if (!isVisible || !sidebarRef.current) return;

    const sidebar = sidebarRef.current;
    let startX = 0;
    let startY = 0;
    let isSwiping = false;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isSwiping = false;
    };

    const handleTouchMove = (e) => {
      if (!isSwiping) {
        const deltaX = Math.abs(e.touches[0].clientX - startX);
        const deltaY = Math.abs(e.touches[0].clientY - startY);
        
        // Start swiping if horizontal movement is greater than vertical
        if (deltaX > 10 && deltaX > deltaY) {
          isSwiping = true;
        }
      }
    };

    const handleTouchEnd = (e) => {
      if (isSwiping) {
        const deltaX = e.changedTouches[0].clientX - startX;
        const deltaY = Math.abs(e.changedTouches[0].clientY - startY);
        
        // Close sidebar if swiped left with sufficient distance and minimal vertical movement
        if (deltaX < -50 && deltaY < 100) {
          onClose();
        }
      }
    };

    sidebar.addEventListener('touchstart', handleTouchStart, { passive: true });
    sidebar.addEventListener('touchmove', handleTouchMove, { passive: true });
    sidebar.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      sidebar.removeEventListener('touchstart', handleTouchStart);
      sidebar.removeEventListener('touchmove', handleTouchMove);
      sidebar.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isVisible, onClose]);

  // Simple function to detect if something is a URL
  const isUrl = (text) => {
    if (!text || typeof text !== 'string') return false;
    return text.includes('http://') || text.includes('https://') || text.includes('www.');
  };



  if (!isVisible || !selectedCountry) {
    return null;
  }

  // Function to find matching country data
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
      <div className={`sidebar ${isVisible ? 'visible' : ''}`} ref={sidebarRef}>
        <div className="sidebar-header">
          <h2>{selectedCountry}</h2>
          <div className="status-badge no-data">
            No Data
          </div>
          <button className="close-button" onClick={onClose} title="Close">
            ×
          </button>
        </div>
        
        <div className="sidebar-content">
          <div className="info-section">
            <h3>Information</h3>
            <p>No FSD (Full Self-Driving) data available for this country at this time.</p>
          </div>
          
          <div className="info-section">
            <h3>Note</h3>
            <p>This country may not have Tesla vehicles, FSD testing programs, or regulatory frameworks in place yet.</p>
          </div>
        </div>
      </div>
    );
  }

  const countryData = countryMatch.data;

  const getStatusColor = (status) => {
    // Normalize the status by trimming whitespace
    const normalizedStatus = status ? status.trim() : '';
    
    const statusColors = {
      "Fully Released": "#22C55E", // Grass Green
      "Partially Released": "#86EFAC", // Light Green
      "Testing": "#F97316",        // Orange
      "Pending": "#3B82F6",        // Blue
      "Not Available": "#EF4444"   // Red
    };
    
    // Try exact match first
    let color = statusColors[normalizedStatus];
    
    // If no exact match, try case-insensitive match
    if (!color) {
      for (const [key, value] of Object.entries(statusColors)) {
        if (key.toLowerCase() === normalizedStatus.toLowerCase()) {
          color = value;
          break;
        }
      }
    }
    
    // If still no match, use fallback color
    if (!color) {
      color = "#6B7280";
    }
    
    return color;
  };

  return (
    <div className={`sidebar ${isVisible ? 'visible' : ''}`} ref={sidebarRef}>
      <div className="sidebar-header">
        <h2>{countryData.geoName}</h2>
        <div 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(countryData.status) }}
        >
          {countryData.status}
        </div>
        <button className="close-button" onClick={onClose} title="Close">
          ×
        </button>
      </div>
      
      <div className="sidebar-content">
        <div className="info-section">
          <h3>Details</h3>
          <ul className="details-list">
            {Array.isArray(countryData.details) 
              ? countryData.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))
              : <li>{countryData.details || "No FSD availability or testing reported"}</li>
            }
          </ul>
        </div>

        <div className="info-section">
          <h3>Latest Update</h3>
          <ul className="updates-list">
            {Array.isArray(countryData.latestUpdate)
              ? countryData.latestUpdate.map((update, index) => (
                  <li key={index}>{update}</li>
                ))
              : <li>{countryData.latestUpdate || "No updates available"}</li>
            }
          </ul>
        </div>

        <div className="info-section">
          <h3>Milestones</h3>
          <ul className="milestones-list">
            {Array.isArray(countryData.milestones)
              ? countryData.milestones.map((milestone, index) => (
                  <li key={index}>{milestone}</li>
                ))
              : <li>{countryData.milestones || "No milestones recorded"}</li>
            }
          </ul>
        </div>

        <div className="info-section">
          <h3>Source</h3>
          <ul className="source-list">
            {Array.isArray(countryData.source)
              ? countryData.source.map((source, index) => (
                  <li key={index}>
                    {isUrl(source) ? (
                      <a 
                        href={source} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="regular-link"
                        title={`Click to open: ${source}`}
                      >
                        {source}
                      </a>
                    ) : (
                      source
                    )}
                  </li>
                ))
              : (
                <li>
                  {isUrl(countryData.source) ? (
                    <a 
                      href={countryData.source} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="regular-link"
                      title={`Click to open: ${countryData.source}`}
                    >
                      {countryData.source}
                    </a>
                  ) : (
                    countryData.source || "Tesla website and various reports"
                  )}
                </li>
              )
            }
          </ul>
        </div>

        <div className="info-section">
          <h3>Last Updated</h3>
          <p className="date-text">{countryData.lastUpdated}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
