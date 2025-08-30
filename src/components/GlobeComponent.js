/**
 * GlobeComponent - 3D Interactive Globe Visualization
 * 
 * This component renders an interactive 3D globe using Globe.gl and Three.js,
 * displaying country polygons with FSD status information and handling user interactions.
 * 
 * Key Features:
 * - WebGL-based 3D globe rendering
 * - Country polygon visualization with status-based styling
 * - Touch and mouse interaction support
 * - Mobile-optimized performance settings
 * - Responsive design and auto-rotation
 */

import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import Globe from 'globe.gl';
import clsx from 'clsx';

// Assets
import worldColourImageHigh from '../assets/BlueMarbleTexture_10800x5400.png';
import worldColourImageMobile from '../assets/BlueMarbleTexture_5400x1700.jpg';
import countryData from '../assets/custom.geo.json';

// Utilities
import { detectWebGLSupport, isMobileDevice } from '../utils/webglDetection';

// Constants
import { GLOBE_CONFIG, DEFAULTS } from '../constants';

const GlobeComponent = ({ onCountrySelect, fsdData }) => {
  // Refs
  const globeRef = useRef(null);
  const globeInstance = useRef(null);
  const selectedCountryRef = useRef(null);
  const highlightedCountryRef = useRef(null);
  const autoRotateTimeoutRef = useRef(null);
  
  // State
  const [webglError, setWebglError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoized values
  const isMobile = useMemo(() => isMobileDevice(), []);
  const worldTexture = useMemo(() => isMobile ? worldColourImageMobile : worldColourImageHigh, [isMobile]);
  const globeSettings = useMemo(() => isMobile ? GLOBE_CONFIG.MOBILE : GLOBE_CONFIG.DESKTOP, [isMobile]);

  // Country selection handler
  const handleCountrySelect = useCallback(
    (countryName, showInfo = false) => onCountrySelect?.(countryName, showInfo),
    [onCountrySelect]
  );

  // Country polygons data
  const countryPolygons = useMemo(() => {
    if (!countryData.features?.length) return [];
    
    return countryData.features.map((feature) => ({
      geometry: feature.geometry,
      properties: { 
        name: feature.properties.name || feature.properties.admin || 'Unknown' 
      }
    }));
  }, []);

  // Setup mobile touch handling
  const setupMobileTouchHandling = useCallback((myGlobe) => {
    const canvas = myGlobe.renderer().domElement;
    let touchStartX = 0, touchStartY = 0, touchStartTime = 0;

    canvas.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') {
        touchStartX = e.clientX;
        touchStartY = e.clientY;
        touchStartTime = Date.now();
      }
    });

    canvas.addEventListener('pointerup', (e) => {
      if (e.pointerType === 'touch') {
        const deltaX = Math.abs(e.clientX - touchStartX);
        const deltaY = Math.abs(e.clientY - touchStartY);
        const deltaTime = Date.now() - touchStartTime;
        
        if (deltaX < 10 && deltaY < 10 && deltaTime < 500) {
          canvas.dispatchEvent(new MouseEvent('click', {
            clientX: e.clientX,
            clientY: e.clientY,
            bubbles: true,
            cancelable: true,
            view: window
          }));
        }
      }
    });
  }, []);

  // Handle country click
  const handleCountryClick = useCallback((d, countryName) => {
    if (isMobile) {
      // Mobile: Two-tap logic
      if (selectedCountryRef.current === d) {
        // Deselect
        selectedCountryRef.current = null;
        highlightedCountryRef.current = null;
        handleCountrySelect(null, false);
      } else if (highlightedCountryRef.current === d) {
        // Select and show info
        selectedCountryRef.current = d;
        highlightedCountryRef.current = null;
        handleCountrySelect(countryName, true);
      } else {
        // Highlight
        highlightedCountryRef.current = d;
        selectedCountryRef.current = null;
        handleCountrySelect(countryName, false);
      }
    } else {
      // Desktop: Toggle select/deselect
      if (selectedCountryRef.current === d) {
        selectedCountryRef.current = null;
        handleCountrySelect(null, false);
      } else {
        selectedCountryRef.current = d;
        highlightedCountryRef.current = null;
        handleCountrySelect(countryName, true);
      }
    }

    // Update globe state
    const myGlobe = globeInstance.current;
    if (myGlobe) {
      myGlobe.updateAutoRotate();
      myGlobe.polygonStrokeColor((d) => {
        if (d === selectedCountryRef.current) return 'rgba(0,255,0,0.8)';
        if (d === highlightedCountryRef.current) return 'rgba(255,255,0,0.8)';
        return 'rgba(255,255,255,0)';
      }).polygonAltitude((d) => {
        if (d === selectedCountryRef.current) return 0.008;
        if (d === highlightedCountryRef.current) return 0.005;
        return 0.003;
      });
    }
  }, [isMobile, handleCountrySelect]);

  // Initialize globe
  const initializeGlobe = useCallback(() => {
    if (!globeRef.current || globeInstance.current || webglError) return;

    const webglSupport = detectWebGLSupport();
    if (!webglSupport.supported) {
      setWebglError(webglSupport.reason);
      return;
    }

    try {
      const container = globeRef.current;
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      // Create globe instance
      const myGlobe = Globe({
        rendererConfig: {
          antialias: globeSettings.ANTIALIAS,
          alpha: true,
          powerPreference: globeSettings.POWER_PREFERENCE,
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false
        }
      })
        .width(width)
        .height(height)
        .globeImageUrl(worldTexture)
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')(container);

      globeInstance.current = myGlobe;

      // Configure material and lighting
      const globeMaterial = myGlobe.globeMaterial();
      globeMaterial.bumpScale = globeSettings.BUMP_SCALE;

      const directionalLight = myGlobe.lights().find((l) => l.type === 'DirectionalLight');
      if (directionalLight) {
        directionalLight.position.set(1, 1, 1);
      }

      // Configure controls
      const controls = myGlobe.controls();
      controls.enableDamping = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = globeSettings.AUTO_ROTATE_SPEED;

      // Auto-rotation management
      const updateAutoRotate = () => {
        controls.autoRotate = !selectedCountryRef.current && !highlightedCountryRef.current;
      };

      const stopAutoRotateTemporarily = () => {
        controls.autoRotate = false;
        if (autoRotateTimeoutRef.current) {
          clearTimeout(autoRotateTimeoutRef.current);
        }
        autoRotateTimeoutRef.current = setTimeout(updateAutoRotate, DEFAULTS.AUTO_ROTATE_RESUME_DELAY);
      };

      myGlobe.updateAutoRotate = updateAutoRotate;
      controls.addEventListener('start', stopAutoRotateTemporarily);

      // Set initial view
      myGlobe.pointOfView({ lat: 0, lng: 0, altitude: globeSettings.INITIAL_ALTITUDE }, 0);

      // Handle resize
      const handleResize = () => {
        myGlobe.width(container.clientWidth || window.innerWidth)
                .height(container.clientHeight || window.innerHeight);
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', () => setTimeout(handleResize, 100));
      myGlobe.handleResize = handleResize;

      // Mobile touch handling
      if (isMobile) {
        setupMobileTouchHandling(myGlobe);
      }

      setIsInitialized(true);
      console.log('✅ Globe initialized successfully');

    } catch (err) {
      console.error('❌ Failed to initialize globe:', err);
      setWebglError(`Failed to initialize 3D globe: ${err.message}`);
    }
  }, [webglError, isMobile, worldTexture, globeSettings, setupMobileTouchHandling]);

  // Setup country polygons
  const setupCountryPolygons = useCallback(() => {
    if (!globeInstance.current || !countryPolygons.length) return;

    const myGlobe = globeInstance.current;
    let hoverD = null;

    // Dynamic styling functions
    const getStrokeColor = (d) => {
      if (d === selectedCountryRef.current) return 'rgba(0,255,0,0.8)';
      if (d === highlightedCountryRef.current) return 'rgba(255,255,0,0.8)';
      if (d === hoverD) return 'rgba(255,255,255,0.8)';
      return 'rgba(255,255,255,0)';
    };

    const getAltitude = (d) => {
      if (d === selectedCountryRef.current) return 0.008;
      if (d === highlightedCountryRef.current || d === hoverD) return 0.005;
      return 0.003;
    };

    // Configure polygon properties
    myGlobe
      .polygonsData(countryPolygons)
      .polygonsTransitionDuration(200)
      .polygonCapColor(() => 'rgba(0,0,0,0.001)')
      .polygonSideColor(() => 'rgba(0,0,0,0)')
      .polygonStrokeColor(getStrokeColor)
      .polygonAltitude(getAltitude)
      .polygonLabel((d) => d?.properties?.name || '');

    // Event handlers
    myGlobe
      .onPolygonHover((d) => {
        hoverD = d;
        myGlobe.polygonStrokeColor(getStrokeColor).polygonAltitude(getAltitude);
      })
      .onPolygonClick((d) => {
        if (!d) return;
        
        const countryName = d.properties.name;
        handleCountryClick(d, countryName);
      });

    myGlobe.onGlobeClick(() => {
      selectedCountryRef.current = null;
      highlightedCountryRef.current = null;
      handleCountrySelect(null, false);
      myGlobe.updateAutoRotate();
      myGlobe.polygonStrokeColor(getStrokeColor).polygonAltitude(getAltitude);
    });

  }, [countryPolygons, handleCountrySelect, handleCountryClick]);

  // Initialize globe on mount
  useEffect(() => {
    initializeGlobe();
  }, [initializeGlobe]);

  // Setup polygons after initialization
  useEffect(() => {
    if (isInitialized) {
      setupCountryPolygons();
    }
  }, [isInitialized, setupCountryPolygons]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoRotateTimeoutRef.current) {
        clearTimeout(autoRotateTimeoutRef.current);
      }
      if (globeInstance.current?.handleResize) {
        window.removeEventListener('resize', globeInstance.current.handleResize);
        window.removeEventListener('orientationchange', globeInstance.current.handleResize);
      }
      globeInstance.current = null;
    };
  }, []);

  // WebGL error state
  if (webglError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-red-400 p-4">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">3D Globe Not Available</h2>
          <p className="text-sm text-gray-400">{webglError}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={globeRef}
      className={clsx(
        "w-screen h-screen select-none touch-none",
        "relative overflow-hidden"
      )}
    >
      {/* Mobile tooltip for highlighted countries */}
      {highlightedCountryRef.current && isMobile && (
        <div className="mobile-tooltip max-w-[90vw] text-center">
          <span className="break-words text-xs sm:text-sm">
            Tap again to see information
          </span>
        </div>
      )}
    </div>
  );
};

export default GlobeComponent;
