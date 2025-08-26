import React, { useEffect, useRef } from 'react';
import './LeftSidebar.css';

const LeftSidebar = ({ isVisible, onClose }) => {
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

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`left-sidebar ${isVisible ? 'visible' : ''}`} ref={sidebarRef}>
      <div className="left-sidebar-header">
        <h2>About</h2>
        <button className="close-button" onClick={onClose} title="Close">
          ×
        </button>
      </div>
      
      <div className="left-sidebar-content">
        <div className="info-section">
          <h3>Description</h3>
          <p>
            An interactive 3D globe visualization showing Tesla's Full Self-Driving (FSD) 
            availability and progress across different countries. Built with React, Three.js, 
            and Globe.gl, this tool provides real-time insights into the global deployment 
            of autonomous driving technology.
          </p>
        </div>

        <div className="info-section">
          <h3>Features</h3>
          <ul className="features-list">
            <li>Interactive 3D Globe Navigation</li>
            <li>Country-specific FSD Status</li>
            <li>Real-time Data from Google Sheets</li>
            <li>Color-coded Status Visualization</li>
            <li>Responsive Design</li>
          </ul>
        </div>

        <div className="info-section">
          <h3>Acknowledgements</h3>
          <ul className="acknowledgements-list">
            <li>
              <strong>Globe.gl</strong> - 3D globe visualization library
            </li>
            <li>
              <strong>Three.js</strong> - 3D graphics and WebGL framework
            </li>
            <li>
              <strong>React</strong> - UI framework and component architecture
            </li>
            <li>
              <strong>Google Sheets API</strong> - Data storage and retrieval
            </li>
          </ul>
        </div>

        <div className="info-section">
          <h3>License</h3>
          <div className="license-content">
            <p className="license-title">MIT License</p>
            <p className="license-copyright">Copyright (c) 2025 Timää</p>
            <p className="license-text">
              Permission is hereby granted, free of charge, to any person obtaining a copy
              of this software and associated documentation files (the "Software"), to deal
              in the Software without restriction, including without limitation the rights
              to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
              copies of the Software, and to permit persons to whom the Software is
              furnished to do so, subject to the following conditions.
            </p>
            <p className="license-text">
              The above copyright notice and this permission notice shall be included in all
              copies or substantial portions of the Software.
            </p>
            <p className="license-text">
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
            </p>
          </div>
        </div>

        <div className="info-section">
          <h3>Quick Links</h3>
          <div className="quick-links">
            <a 
              href="https://github.com/TimoWey/FSD_Progress_Tracker" 
              target="_blank" 
              rel="noopener noreferrer"
              className="link-button"
            >
              GitHub Repository
            </a>
            <a 
              href="https://globe.gl/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="link-button"
            >
              Globe.gl Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
