import React from 'react';
import './Sidebar.css';

const Sidebar = ({ selectedCountry, fsdData, isVisible }) => {
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
      <div className={`sidebar ${isVisible ? 'visible' : ''}`}>
        <div className="sidebar-header">
          <h2>{selectedCountry}</h2>
          <div className="status-badge no-data">
            No Data
          </div>
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
    <div className={`sidebar ${isVisible ? 'visible' : ''}`}>
      <div className="sidebar-header">
        <h2>{countryData.geoName}</h2>
        <div 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(countryData.status) }}
        >
          {countryData.status}
        </div>
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
