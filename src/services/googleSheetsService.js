/**
 * Google Sheets Service - Simplified Version
 * Handles data fetching and transformation from Google Sheets API
 */

import { GOOGLE_SHEETS_CONFIG } from '../config/googleSheetsConfig';

/**
 * Simplified data transformation
 * @param {Array} values - Raw spreadsheet values
 * @returns {Object} Transformed FSD data
 */
const transformSheetData = (values) => {
  if (!values || values.length < 2) {
    throw new Error('Invalid spreadsheet data: insufficient rows');
  }

  const headers = values[0];
  const dataRows = values.slice(1);
  
  // Simple column mapping
  const columnMap = {
    country: headers.findIndex(h => h.toLowerCase().includes('country')),
    status: headers.findIndex(h => h.toLowerCase().includes('status')),
    details: headers.findIndex(h => h.toLowerCase().includes('details')),
    milestones: headers.findIndex(h => h.toLowerCase().includes('milestones')),
    latestUpdate: headers.findIndex(h => h.toLowerCase().includes('latest update')),
    source: headers.findIndex(h => h.toLowerCase().includes('source')),
    lastUpdated: headers.findIndex(h => h.toLowerCase().includes('last updated'))
  };

  // Validate required columns
  if (columnMap.country === -1) {
    throw new Error('Required column "Country" not found');
  }

  const transformedData = {};
  
  dataRows.forEach((row) => {
    if (!row[columnMap.country]) return;
    
    const countryName = row[columnMap.country].trim();
    if (!countryName) return;
    
    // Simple data extraction - no complex parsing
    transformedData[countryName] = {
      status: columnMap.status !== -1 ? (row[columnMap.status] || "Not Available") : "Not Available",
      details: columnMap.details !== -1 ? (row[columnMap.details] || "No details available") : "No details available",
      milestones: columnMap.milestones !== -1 ? (row[columnMap.milestones] || "No milestones recorded") : "No milestones recorded",
      latestUpdate: columnMap.latestUpdate !== -1 ? (row[columnMap.latestUpdate] || "No updates available") : "No updates available",
      source: columnMap.source !== -1 ? (row[columnMap.source] || "Tesla website and reports") : "Tesla website and reports",
      lastUpdated: columnMap.lastUpdated !== -1 ? (row[columnMap.lastUpdated] || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]
    };
  });

  return transformedData;
};

/**
 * Fetches FSD data from Google Sheets
 * @returns {Promise<Object>} The transformed FSD data
 */
export const fetchFSDData = async () => {
  try {
    if (!GOOGLE_SHEETS_CONFIG.API_KEY || !GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID) {
      throw new Error('Google Sheets configuration missing');
    }

    const encodedSheetName = encodeURIComponent(GOOGLE_SHEETS_CONFIG.SHEET_NAME);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID}/values/${encodedSheetName}?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.values || !Array.isArray(data.values)) {
      throw new Error('Invalid data format from Google Sheets');
    }
    
    const transformedData = transformSheetData(data.values);
    
    return {
      fsdData: transformedData,
      lastUpdated: new Date().toISOString(),
      rowCount: data.values.length - 1
    };
    
  } catch (error) {
    console.error('Error fetching spreadsheet data:', error);
    throw error;
  }
};

// Export status colors for components
export const STATUS_COLORS = {
  'Fully Released': '#22C55E',
  'Partially Released': '#86EFAC',
  'Testing': '#F97316',
  'Pending': '#3B82F6',
  'Not Available': '#EF4444'
};
