/**
 * AboutSidebar Component
 * Displays information about the Tesla FSD Tracker project
 */

import React, { forwardRef } from 'react';
import { X, Globe, Code, Database, Zap, Heart, ExternalLink, Github } from 'lucide-react';
import clsx from 'clsx';

const AboutSidebar = forwardRef(({ isVisible, onClose }, ref) => {
  if (!isVisible) {
    return null;
  }

  const features = [
    { icon: Globe, text: 'Interactive 3D Globe Navigation' },
    { icon: Database, text: 'Real-time Data from Google Sheets' },
    { icon: Zap, text: 'Color-coded Status Visualization' },
    { icon: Code, text: 'Responsive Design & Mobile Support' }
  ];

  const acknowledgements = [
    { name: 'Globe.gl', description: '3D globe visualization library' },
    { name: 'Three.js', description: '3D graphics and WebGL framework' },
    { name: 'React', description: 'UI framework and component architecture' },
    { name: 'Google Sheets API', description: 'Data storage and retrieval' }
  ];

  const quickLinks = [
    {
      name: 'GitHub Repository',
      url: 'https://github.com/TimoWey/FSD_Progress_Tracker',
      icon: Github
    },
    {
      name: 'Globe.gl Documentation',
      url: 'https://globe.gl/',
      icon: ExternalLink
    }
  ];

  return (
    <div 
      ref={ref}
      className={clsx(
        "sidebar-panel left-0 z-50 w-96",
        isVisible ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/30 bg-gray-800/50">
          <div className="flex items-center space-x-3">
            <Globe className="w-6 h-6 text-primary-400" />
            <h2 className="text-xl font-bold text-white">About</h2>
          </div>
          <button 
            onClick={onClose}
            className="glass-button w-8 h-8 flex items-center justify-center"
            title="Close"
            aria-label="Close about panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-thin">
          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700/30 pb-2">
              Description
            </h3>
            <p className="text-gray-300 leading-relaxed">
              An interactive 3D globe visualization showing Tesla's Full Self-Driving (FSD) 
              availability and progress across different countries. Built with React, Three.js, 
              and Globe.gl, this tool provides real-time insights into the global deployment 
              of autonomous driving technology.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700/30 pb-2">
              Features
            </h3>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3 text-gray-300">
                  <feature.icon className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Acknowledgements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700/30 pb-2">
              Acknowledgements
            </h3>
            <ul className="space-y-3">
              {acknowledgements.map((item, index) => (
                <li key={index} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-primary-400 font-semibold">•</span>
                    <span className="text-white font-medium">{item.name}</span>
                  </div>
                  <p className="text-gray-400 text-sm ml-6">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* License */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700/30 pb-2">
              License
            </h3>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
              <div className="text-center space-y-3">
                <h4 className="text-lg font-bold text-primary-400">MIT License</h4>
                <p className="text-sm text-gray-400">
                  Copyright (c) 2025 Timää
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Permission is hereby granted, free of charge, to any person obtaining a copy
                  of this software and associated documentation files (the "Software"), to deal
                  in the Software without restriction, including without limitation the rights
                  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                  copies of the Software, and to permit persons to whom the Software is
                  furnished to do so, subject to the following conditions.
                </p>
              </div>
            </div>
          </div>

          {/* Build Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700/30 pb-2">
              Build Information
            </h3>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Version:</span>
                <span className="text-white font-medium">1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Build Date:</span>
                <span className="text-white font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Environment:</span>
                <span className="text-white font-medium">{process.env.NODE_ENV || 'development'}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700/30 pb-2">
              Quick Links
            </h3>
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-3 w-full p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/30 hover:border-primary-500/50 rounded-lg transition-all duration-200 text-primary-400 hover:text-primary-300"
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.name}</span>
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-gray-700/30">
            <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
              <Heart className="w-4 h-4 text-red-400" />
              <span>Made with love for the Tesla community</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

AboutSidebar.displayName = 'AboutSidebar';

export default AboutSidebar;
