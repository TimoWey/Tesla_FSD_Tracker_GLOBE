import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import Globe from 'globe.gl';
import worldColourImageHigh from './assets/BlueMarbleTexture_10800x5400.png';
import worldColourImageMobile from './assets/BlueMarbleTexture_5400x1700.jpg';
import countryData from './assets/custom.geo.json';
import { detectWebGLSupport, isMobileDevice, getMobileOptimizedSettings } from './utils/webglDetection';

const getWorldTexture = () => isMobileDevice() ? worldColourImageMobile : worldColourImageHigh;

const GlobeComponent = ({ onCountrySelect }) => {
  const globeRef = useRef(null);
  const globeInstance = useRef(null);
  const selectedCountryRef = useRef(null);
  const highlightedCountryRef = useRef(null);
  const autoRotateTimeoutRef = useRef(null);
  const [webglError, setWebglError] = useState(null);

  const isMobile = useMemo(() => isMobileDevice(), []);

  const handleCountrySelect = useCallback(
    (countryName, showInfo = false) => onCountrySelect?.(countryName, showInfo),
    [onCountrySelect]
  );

  const countryPolygons = useMemo(() => {
    if (!countryData.features?.length) return [];
    return countryData.features.map((feature) => ({
      geometry: feature.geometry,
      properties: { name: feature.properties.name || feature.properties.admin || 'Unknown' }
    }));
  }, []);

  // Combined WebGL check and globe initialization in one effect for efficiency
  useEffect(() => {
    if (globeRef.current && !globeInstance.current && !webglError) {
      const webglSupport = detectWebGLSupport();
      if (!webglSupport.supported) {
        setWebglError(webglSupport.reason);
        return;
      }

      try {
        const container = globeRef.current;
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;
        const settings = getMobileOptimizedSettings();

        const myGlobe = Globe({
          rendererConfig: {
            antialias: settings.antialias,
            alpha: settings.alpha,
            powerPreference: settings.powerPreference,
            preserveDrawingBuffer: settings.preserveDrawingBuffer,
            failIfMajorPerformanceCaveat: settings.failIfMajorPerformanceCaveat
          }
        })
          .width(width)
          .height(height)
          .globeImageUrl(getWorldTexture())
          .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')(container);

        globeInstance.current = myGlobe;

        // Configure material and lighting
        const globeMaterial = myGlobe.globeMaterial();
        globeMaterial.bumpScale = isMobile ? 5 : 10;

        const directionalLight = myGlobe.lights().find((l) => l.type === 'DirectionalLight');
        if (directionalLight) directionalLight.position.set(1, 1, 1);

        // Configure controls
        const controls = myGlobe.controls();
        controls.enableDamping = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = settings.autoRotateSpeed;

        // Function to toggle auto-rotate based on selection/highlight state
        const updateAutoRotate = () => {
          controls.autoRotate = !selectedCountryRef.current && !highlightedCountryRef.current;
        };
        myGlobe.updateAutoRotate = updateAutoRotate;

        const stopAutoRotateTemporarily = () => {
          controls.autoRotate = false;
          if (autoRotateTimeoutRef.current) clearTimeout(autoRotateTimeoutRef.current);
          autoRotateTimeoutRef.current = setTimeout(updateAutoRotate, 3000);
        };
        controls.addEventListener('start', stopAutoRotateTemporarily);

        myGlobe.pointOfView({ lat: 0, lng: 0, altitude: settings.initialAltitude }, 0);

        // Handle resize
        const handleResize = () => {
          myGlobe.width(container.clientWidth || window.innerWidth).height(container.clientHeight || window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', () => setTimeout(handleResize, 100));
        myGlobe.handleResize = handleResize;

        // Mobile tap-to-click simulation
        if (isMobile) {
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
        }
      } catch (err) {
        setWebglError(`Failed to initialize globe: ${err.message}`);
      }
    }

    return () => {
      if (autoRotateTimeoutRef.current) clearTimeout(autoRotateTimeoutRef.current);
      if (globeInstance.current?.handleResize) {
        window.removeEventListener('resize', globeInstance.current.handleResize);
        window.removeEventListener('orientationchange', globeInstance.current.handleResize);
      }
      globeInstance.current = null; // Reset for potential re-init
    };
  }, [webglError, isMobile]);

  // Polygon setup effect (runs only after globe init and polygons are ready)
  useEffect(() => {
    if (!globeInstance.current || !countryPolygons.length) return;

    const myGlobe = globeInstance.current;
    let hoverD = null;

    // Define dynamic polygon styles (called once, but functions are dynamic)
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

    myGlobe
      .polygonsData(countryPolygons)
      .polygonsTransitionDuration(200)
      .polygonCapColor(() => 'rgba(0,0,0,0.001)')
      .polygonSideColor(() => 'rgba(0,0,0,0)')
      .polygonStrokeColor(getStrokeColor)
      .polygonAltitude(getAltitude)
      .polygonLabel((d) => d?.properties?.name || '')
      .onPolygonHover((d) => {
        hoverD = d;
        myGlobe.polygonStrokeColor(getStrokeColor).polygonAltitude(getAltitude);
      })
      .onPolygonClick((d) => {
        if (!d) return;
        const countryName = d.properties.name;

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

        myGlobe.updateAutoRotate();
        myGlobe.polygonStrokeColor(getStrokeColor).polygonAltitude(getAltitude);
      });

    myGlobe.onGlobeClick(() => {
      selectedCountryRef.current = null;
      highlightedCountryRef.current = null;
      handleCountrySelect(null, false);
      myGlobe.updateAutoRotate();
      myGlobe.polygonStrokeColor(getStrokeColor).polygonAltitude(getAltitude);
    });
  }, [countryPolygons, handleCountrySelect, isMobile]);

  if (webglError) {
    return <div style={{ color: 'red', padding: 20 }}>3D Globe not available: {webglError}</div>;
  }

  return (
    <div
      ref={globeRef}
      style={{
        width: '100vw',
        height: '100vh',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        touchAction: 'none'
      }}
    >
      {highlightedCountryRef.current && isMobile && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '20px',
            fontSize: '14px',
            zIndex: 1000,
            pointerEvents: 'none',
            animation: 'fadeInOut 2s ease-in-out infinite'
          }}
        >
          Tap again to see information
        </div>
      )}
    </div>
  );
};

export default GlobeComponent;