/**
 * Tesla FSD Tracker Globe - Main Application Component
 * 
 * This component serves as the main entry point for the application,
 * managing the overall state and rendering the 3D globe with sidebars.
 * 
 * Key Features:
 * - 3D Interactive Globe visualization
 * - Country selection and information display
 * - About panel with project information
 * - Responsive design for mobile and desktop
 * - Real-time data from Google Sheets
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Info } from 'lucide-react';
import clsx from 'clsx';

// Components
import GlobeComponent from './components/GlobeComponent';
import CountrySidebar from './components/CountrySidebar';
import AboutSidebar from './components/AboutSidebar';
import LoadingScreen from './components/LoadingScreen';
import ErrorScreen from './components/ErrorScreen';

// Hooks
import { useGoogleSheets } from './hooks/useGoogleSheets';
import { useSidebar } from './hooks/useSidebar';

// Constants
import { BREAKPOINTS } from './constants';

function App() {
  // Custom hooks for data and sidebar management
  const { data: fsdData, loading, error, refreshData } = useGoogleSheets();
  const { isVisible: isAboutVisible, show: showAbout, hide: hideAbout, sidebarRef: aboutSidebarRef } = useSidebar();
  
  // Local state
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= BREAKPOINTS.MOBILE);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle Escape key to close sidebars
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        if (isAboutVisible) {
          hideAbout();
        }
        if (selectedCountry) {
          setSelectedCountry(null);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isAboutVisible, hideAbout, selectedCountry]);

  // Country selection handler
  const handleCountrySelect = useCallback((country, showInfo = false) => {
    if (showInfo) {
      setSelectedCountry(country);
    } else {
      setSelectedCountry(null);
    }
  }, []);

  // Close country sidebar
  const closeCountrySidebar = useCallback(() => {
    setSelectedCountry(null);
  }, []);

  // Loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // Error state
  if (error) {
    return <ErrorScreen error={error} onRetry={refreshData} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Main 3D Globe */}
      <GlobeComponent 
        onCountrySelect={handleCountrySelect} 
        fsdData={fsdData} 
      />
      
      {/* About Sidebar Toggle Button */}
      <button 
        className={clsx(
          "fixed top-5 left-5 z-40 w-12 h-12 rounded-full",
          "glass-button flex items-center justify-center",
          "transition-all duration-200 ease-out",
          isAboutVisible && "bg-primary-600/30 border-primary-500/60"
        )}
        onClick={showAbout}
        title="About Tesla FSD Tracker"
        aria-label="Open about panel"
      >
        <Info className="w-5 h-5" />
      </button>
      
      {/* About Sidebar */}
      <AboutSidebar 
        isVisible={isAboutVisible}
        onClose={hideAbout}
        ref={aboutSidebarRef}
      />
      
      {/* Country Information Sidebar */}
      <CountrySidebar 
        selectedCountry={selectedCountry}
        fsdData={fsdData}
        isVisible={!!selectedCountry}
        onClose={closeCountrySidebar}
        isMobile={isMobile}
      />
    </div>
  );
}

export default App;