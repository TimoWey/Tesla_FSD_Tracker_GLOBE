import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import * as THREE from 'three';
import Globe from 'globe.gl';
import worldColourImageHigh from './assets/BlueMarbleTexture_10800x5400.png';
import worldColourImageMobile from './assets/BlueMarbleTexture_5400x1700.jpg';
import countryData from './assets/custom.geo.json';
import { detectWebGLSupport, isMobileDevice, getMobileOptimizedSettings } from './utils/webglDetection';

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

  const handleCountrySelect = useCallback(
    (countryName) => {
      if (onCountrySelect) onCountrySelect(countryName);
    },
    [onCountrySelect]
  );

  const countryPolygons = useMemo(() => {
    if (!countryData.features?.length) return [];
    return countryData.features.map((feature) => ({
      geometry: feature.geometry,
      properties: {
        name: feature.properties.name || feature.properties.admin || 'Unknown'
      }
    }));
  }, []);

  // Check WebGL support
  useEffect(() => {
    if (isWebGLChecked) return;
    const webglSupport = detectWebGLSupport();
    if (!webglSupport.supported) {
      setWebglError(webglSupport.reason);
    }
    setIsWebGLChecked(true);
  }, [isWebGLChecked]);

  // Init globe
  useEffect(() => {
    if (!globeRef.current || isInitialized.current || webglError || !isWebGLChecked) return;

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
      isInitialized.current = true;

      // Material
      const globeMaterial = myGlobe.globeMaterial();
      globeMaterial.bumpScale = isMobileDevice() ? 5 : 10;

      // Lighting
      const directionalLight = myGlobe.lights().find((l) => l.type === 'DirectionalLight');
      if (directionalLight) directionalLight.position.set(1, 1, 1);

      // Controls
      const controls = myGlobe.controls();
      controls.enableDamping = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = settings.autoRotateSpeed;

      const stopAutoRotate = () => {
        controls.autoRotate = false;
        if (autoRotateTimeoutRef.current) clearTimeout(autoRotateTimeoutRef.current);
        autoRotateTimeoutRef.current = setTimeout(() => {
          if (!selectedCountryRef.current) controls.autoRotate = true;
        }, 3000);
      };
      controls.addEventListener('start', stopAutoRotate);

      myGlobe.pointOfView({ lat: 0, lng: 0, altitude: settings.initialAltitude }, 0);

      const handleResize = () => {
        myGlobe.width(container.clientWidth || window.innerWidth).height(container.clientHeight || window.innerHeight);
      };
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', () => setTimeout(handleResize, 100));
      globeInstance.current.handleResize = handleResize;

      // Enhanced mobile tap-to-click shim
      if (isMobileDevice()) {
        const canvas = myGlobe.renderer().domElement;
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;

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
              const clickEvent = new MouseEvent('click', {
                clientX: e.clientX,
                clientY: e.clientY,
                bubbles: true,
                cancelable: true,
                view: window,
              });
              canvas.dispatchEvent(clickEvent);
            }
          }
        });
      }
    } catch (err) {
      setWebglError(`Failed to init: ${err.message}`);
      isInitialized.current = false;
    }

    return () => {
      isInitialized.current = false;
      if (autoRotateTimeoutRef.current) clearTimeout(autoRotateTimeoutRef.current);

      if (globeInstance.current?.handleResize) {
        window.removeEventListener('resize', globeInstance.current.handleResize);
        window.removeEventListener('orientationchange', globeInstance.current.handleResize);
      }
    };
  }, [webglError, isWebGLChecked]);

  // Setup polygons
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
      .polygonLabel((d) => d?.properties?.name || '')
      .onPolygonHover((d) => {
        hoverD = d || null;
        myGlobe
          .polygonStrokeColor(myGlobe.polygonStrokeColor())
          .polygonAltitude(myGlobe.polygonAltitude());
      })
      .onPolygonClick((d) => {
        if (!d) return;
        const controls = myGlobe.controls();
        const countryName = d.properties.name;

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
      });

    myGlobe.onGlobeClick(() => {
      selectedCountryRef.current = null;
      handleCountrySelect(null);
      myGlobe.controls().autoRotate = true;
      myGlobe
        .polygonStrokeColor(myGlobe.polygonStrokeColor())
        .polygonAltitude(myGlobe.polygonAltitude());
    });
  }, [fsdData, countryPolygons, handleCountrySelect]);

  if (webglError) {
    return <div style={{ color: 'red', padding: 20 }}>3D Globe not available: {webglError}</div>;
  }

  if (!Object.keys(fsdData).length) {
    return <div style={{ padding: 20 }}>Loading globe data...</div>;
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
        touchAction: 'none'  // Added back for proper touch handling on mobile
      }}
    />
  );
};

export default GlobeComponent;