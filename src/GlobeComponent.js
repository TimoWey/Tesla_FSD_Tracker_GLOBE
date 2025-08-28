import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import * as THREE from 'three';
import Globe from 'globe.gl';
// Use smaller texture for mobile devices to avoid memory issues
import worldColourImageHigh from './assets/BlueMarbleTexture_10800x5400.png';
import worldColourImageMobile from './assets/BlueMarbleTexture_5400x1700.jpg';
import countryData from './assets/custom.geo.json';
import { detectWebGLSupport, isMobileDevice, getMobileOptimizedSettings } from './utils/webglDetection';

// Get appropriate texture based on device
const getWorldTexture = () => {
  return isMobileDevice() ? worldColourImageMobile : worldColourImageHigh;
};

const GlobeComponent = ({ onCountrySelect, fsdData = {} }) => {
  const globeRef = useRef(null);
  const globeInstance = useRef(null);
  const selectedCountryRef = useRef(null);
  const isInitialized = useRef(false);
  const autoRotateTimeoutRef = useRef(null);
  const [webglError, setWebglError] = useState(null);
  const [isWebGLChecked, setIsWebGLChecked] = useState(false);

  // Stable country selection handler
  const handleCountrySelect = useCallback(
    (countryName) => {
      if (onCountrySelect) onCountrySelect(countryName);
    },
    [onCountrySelect]
  );

  // Stable polygons data
  const countryPolygons = useMemo(() => {
    if (!countryData.features?.length) return [];
    return countryData.features.map((feature) => ({
      geometry: feature.geometry,
      properties: {
        name: feature.properties.name || feature.properties.admin || 'Unknown'
      }
    }));
  }, []);

  // Check WebGL support first
  useEffect(() => {
    if (isWebGLChecked) return;
    
    const webglSupport = detectWebGLSupport();
    if (!webglSupport.supported) {
      setWebglError(webglSupport.reason);
      console.error('WebGL not supported:', webglSupport.reason);
    } else {
      console.log('WebGL Support detected:', webglSupport);
    }
    setIsWebGLChecked(true);
  }, [isWebGLChecked]);

  // Initialize globe only once
  useEffect(() => {
    if (!globeRef.current || isInitialized.current || webglError || !isWebGLChecked) return;

    try {
      // Set canvas size explicitly for mobile
      const container = globeRef.current;
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      const settings = getMobileOptimizedSettings();

      const myGlobe = Globe({
        // Force WebGL context creation with mobile-friendly settings
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
        .backgroundImageUrl(null) // Remove background image for mobile compatibility
        (container);

    globeInstance.current = myGlobe;
    isInitialized.current = true;

      // Custom material - simplified for mobile
      const globeMaterial = myGlobe.globeMaterial();
      globeMaterial.bumpScale = isMobileDevice() ? 5 : 10; // Reduce bump scale on mobile
      
      // Only load specular map on non-mobile devices to reduce memory usage
      if (!isMobileDevice()) {
        new THREE.TextureLoader().load(
          '//cdn.jsdelivr.net/npm/three-globe/example/img/earth-water.png',
          (texture) => {
            globeMaterial.specularMap = texture;
            globeMaterial.specular = new THREE.Color('grey');
            globeMaterial.shininess = 15;
          },
          undefined,
          (error) => {
            console.warn('Failed to load specular map:', error);
          }
        );
      }

    // Light setup
    const directionalLight = myGlobe.lights().find((l) => l.type === 'DirectionalLight');
    if (directionalLight) directionalLight.position.set(1, 1, 1);

      // Controls - mobile-optimized
      const controls = myGlobe.controls();
      controls.enableDamping = true;
      controls.dampingFactor = settings.dampingFactor;
      controls.panDampingFactor = settings.dampingFactor;
      controls.rotateDampingFactor = settings.dampingFactor;
      controls.zoomDampingFactor = settings.dampingFactor;
      controls.inertia = isMobileDevice() ? 0.6 : 0.8;
      controls.autoRotate = true;
      controls.autoRotateSpeed = settings.autoRotateSpeed;
      
      // Enable touch controls for mobile
      if (isMobileDevice()) {
        controls.enablePan = true;
        controls.enableZoom = true;
        controls.enableRotate = true;
        controls.touches = {
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN
        };
      }

      // Auto-rotation handler
      const stopAutoRotate = () => {
        controls.autoRotate = false;
        if (autoRotateTimeoutRef.current) clearTimeout(autoRotateTimeoutRef.current);
        autoRotateTimeoutRef.current = setTimeout(() => {
          if (!selectedCountryRef.current) controls.autoRotate = true;
        }, 3000);
      };
      controls.addEventListener('start', stopAutoRotate);

      // Initial POV - adjusted for mobile
      myGlobe.pointOfView({ lat: 0, lng: 0, altitude: settings.initialAltitude }, 0);
      
      // Handle window resize for mobile orientation changes
      const handleResize = () => {
        const newWidth = container.clientWidth || window.innerWidth;
        const newHeight = container.clientHeight || window.innerHeight;
        myGlobe.width(newWidth).height(newHeight);
      };
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', () => {
        // Delay resize after orientation change
        setTimeout(handleResize, 100);
      });
      
      // Store handleResize for cleanup
      globeInstance.current.handleResize = handleResize;

    } catch (error) {
      console.error('Failed to initialize globe:', error);
      setWebglError(`Failed to initialize 3D globe: ${error.message}`);
      isInitialized.current = false;
      return;
    }

    return () => {
      isInitialized.current = false;
      if (autoRotateTimeoutRef.current) clearTimeout(autoRotateTimeoutRef.current);
      
      // Remove event listeners
      if (globeInstance.current?.handleResize) {
        window.removeEventListener('resize', globeInstance.current.handleResize);
        window.removeEventListener('orientationchange', globeInstance.current.handleResize);
      }

      if (globeRef.current) globeRef.current.innerHTML = '';
      if (globeInstance.current) {
        try {
          const { scene, renderer } = globeInstance.current;
          if (renderer?.dispose) renderer.dispose();
          if (scene) scene.clear();
          if (renderer?.getContext) {
            const gl = renderer.getContext();
            const loseContext = gl?.getExtension('WEBGL_lose_context');
            loseContext?.loseContext();
          }
        } catch (err) {
          console.warn('Error during globe cleanup:', err);
        }
        globeInstance.current = null;
      }
    };
  }, [webglError, isWebGLChecked]);

  // Update globe polygons when fsdData is ready
  useEffect(() => {
    if (!globeInstance.current || !Object.keys(fsdData).length) return;

    const myGlobe = globeInstance.current;
    let hoverD = null;

    myGlobe
      .polygonsData(countryPolygons)
      .polygonsTransitionDuration(200)
      .polygonCapColor(() => 'rgba(0,0,0,0.001)')
      .polygonSideColor(() => 'rgba(0,0,0,0)')
      .polygonStrokeColor((d) => {
        if (d === selectedCountryRef.current) return 'rgba(0,255,0,0.8)';
        if (d === hoverD) return 'rgba(255,255,255,0.8)';
        return 'rgba(255,255,255,0)';
      })
      .polygonAltitude((d) => {
        if (d === selectedCountryRef.current) return 0.008;
        if (d === hoverD) return 0.005;
        return 0.003;
      })
      .polygonCapCurvatureResolution(getMobileOptimizedSettings().polygonResolution) // Use mobile-optimized resolution
      .onPolygonHover((d) => {
        hoverD = d || null;
        myGlobe
          .polygonStrokeColor(myGlobe.polygonStrokeColor())
          .polygonAltitude(myGlobe.polygonAltitude());
      })
      .onPolygonClick((d) => {
        if (!d) return;
        const countryName = d.properties.name;
        const controls = myGlobe.controls();

        if (selectedCountryRef.current === d) {
          selectedCountryRef.current = null;
          handleCountrySelect(null);
          controls.autoRotate = true;
        } else {
          selectedCountryRef.current = d;
          handleCountrySelect(countryName);
          controls.autoRotate = false;
        }

        myGlobe
          .polygonStrokeColor(myGlobe.polygonStrokeColor())
          .polygonAltitude(myGlobe.polygonAltitude());
      })
      .polygonLabel((d) => d?.properties?.name || '');

    myGlobe.onGlobeClick(() => {
      selectedCountryRef.current = null;
      handleCountrySelect(null);
      const controls = myGlobe.controls();
      controls.autoRotate = true;
      myGlobe
        .polygonStrokeColor(myGlobe.polygonStrokeColor())
        .polygonAltitude(myGlobe.polygonAltitude());
    });
  }, [fsdData, countryPolygons, handleCountrySelect]);

  // Show WebGL error message if WebGL is not supported
  if (webglError) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
          color: '#d32f2f',
          padding: '20px',
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🌍</div>
        <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
          3D Globe Not Available
        </div>
        <div style={{ marginBottom: '20px', maxWidth: '500px' }}>
          {webglError}
        </div>
        <div style={{ fontSize: '14px', color: '#666', maxWidth: '600px' }}>
          {isMobileDevice() ? (
            <>
              Your mobile browser may not support WebGL or hardware acceleration is disabled. 
              Try opening this in Chrome or Safari with hardware acceleration enabled, 
              or use a desktop browser for the full 3D experience.
            </>
          ) : (
            <>
              Your browser doesn't support WebGL, which is required for the 3D globe. 
              Please update your browser or enable hardware acceleration in your browser settings.
            </>
          )}
        </div>

      </div>
    );
  }

  if (!Object.keys(fsdData).length) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
          color: '#666'
        }}
      >
        Loading globe data from spreadsheet...
      </div>
    );
  }

  return (
    <div 
      ref={globeRef} 
      style={{ 
        width: '100vw', 
        height: '100vh',
        // Prevent text selection and improve touch handling on mobile
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        touchAction: 'none'
      }} 
    />
  );
};

export default GlobeComponent;
