import React, { useState, useEffect, useCallback } from 'react';
import GlobeComponent from './GlobeComponent';
import Sidebar from './Sidebar';
import LeftSidebar from './LeftSidebar';
import { fetchFSDData } from './services/googleSheetsService';
import './App.css';

function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [fsdData, setFsdData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leftSidebarVisible, setLeftSidebarVisible] = useState(false);

  useEffect(() => {
    const loadFSDData = async () => {
      try {
        setLoading(true);
        const data = await fetchFSDData();
        setFsdData(data.fsdData);
        setError(null);
      } catch (err) {
        console.error('Failed to load FSD data:', err);
        setError('Failed to load FSD data. Please check your configuration and try again.');
        setFsdData({});
      } finally {
        setLoading(false);
      }
    };

    loadFSDData();
  }, []);

  // Handle Escape key to close left sidebar
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && leftSidebarVisible) {
        setLeftSidebarVisible(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [leftSidebarVisible]);

  // Memoize the country selection handler to prevent unnecessary re-renders
  const handleCountrySelect = useCallback((country) => {
    setSelectedCountry(country);
  }, []);

  const toggleLeftSidebar = useCallback(() => {
    setLeftSidebarVisible(prev => !prev);
  }, []);

  if (loading) {
    return (
      <div className="App">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          color: '#666'
        }}>
          Loading FSD data from spreadsheet...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          color: '#d32f2f',
          textAlign: 'center',
          padding: '20px'
        }}>
          <div>
            <div style={{ marginBottom: '20px' }}>⚠️ Error Loading Data</div>
            <div>{error}</div>
            <div style={{ 
              marginTop: '20px', 
              fontSize: '14px', 
              color: '#666',
              maxWidth: '500px'
            }}>
              Please check that you have:
              <ul style={{ textAlign: 'left', marginTop: '10px' }}>
                <li>Set up your Google Sheets API key in the config file</li>
                <li>Made your spreadsheet publicly accessible</li>
                <li>Used the correct spreadsheet ID and sheet name</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <GlobeComponent onCountrySelect={handleCountrySelect} fsdData={fsdData} />
      
      {/* Left Sidebar Toggle Button */}
      <button 
        className={`left-sidebar-toggle ${leftSidebarVisible ? 'active' : ''}`}
        onClick={toggleLeftSidebar}
        title="Toggle About Panel"
      >
        <span className="toggle-icon">ℹ️</span>
      </button>
      
      <LeftSidebar isVisible={leftSidebarVisible} onClose={() => setLeftSidebarVisible(false)} />
      <Sidebar 
        selectedCountry={selectedCountry}
        fsdData={fsdData}
        isVisible={!!selectedCountry}
      />
    </div>
  );
}

export default App;