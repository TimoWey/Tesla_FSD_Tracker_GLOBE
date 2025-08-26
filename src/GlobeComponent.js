import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import Globe from 'globe.gl';
// import worldColourImage from './assets/BlueMarbleTexture_5400x1700.jpg';
import worldColourImage from './assets/BlueMarbleTexture_10800x5400.png';
import countryData from './assets/custom.geo.json';

const GlobeComponent = ({ onCountrySelect, fsdData = {} }) => {
  const globeRef = useRef(null);
  const globeInstance = useRef(null);
  const selectedCountryRef = useRef(null);
  const isInitialized = useRef(false);
  const autoRotateTimeoutRef = useRef(null);

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

  // Initialize globe only once
  useEffect(() => {
    if (!globeRef.current || isInitialized.current) return;

    const myGlobe = Globe()
      .globeImageUrl(worldColourImage)
      .backgroundImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png')
      (globeRef.current);

    globeInstance.current = myGlobe;
    isInitialized.current = true;

    // Custom material
    const globeMaterial = myGlobe.globeMaterial();
    globeMaterial.bumpScale = 10;
    new THREE.TextureLoader().load(
      '//cdn.jsdelivr.net/npm/three-globe/example/img/earth-water.png',
      (texture) => {
        globeMaterial.specularMap = texture;
        globeMaterial.specular = new THREE.Color('grey');
        globeMaterial.shininess = 15;
      }
    );

    // Light setup
    const directionalLight = myGlobe.lights().find((l) => l.type === 'DirectionalLight');
    if (directionalLight) directionalLight.position.set(1, 1, 1);

    // Controls
    const controls = myGlobe.controls();
    controls.enableDamping = true;
    controls.dampingFactor = 0.15;
    controls.panDampingFactor = 0.15;
    controls.rotateDampingFactor = 0.15;
    controls.zoomDampingFactor = 0.15;
    controls.inertia = 0.8;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.25;

    // Auto-rotation handler
    const stopAutoRotate = () => {
      controls.autoRotate = false;
      if (autoRotateTimeoutRef.current) clearTimeout(autoRotateTimeoutRef.current);
      autoRotateTimeoutRef.current = setTimeout(() => {
        if (!selectedCountryRef.current) controls.autoRotate = true;
      }, 3000);
    };
    controls.addEventListener('start', stopAutoRotate);

    // Initial POV
    myGlobe.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 0);

    return () => {
      isInitialized.current = false;
      if (autoRotateTimeoutRef.current) clearTimeout(autoRotateTimeoutRef.current);

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
  }, []);

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
      .polygonCapCurvatureResolution(5)
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

  return <div ref={globeRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default GlobeComponent;
