/**
 * Google Sheets Service
 * Handles data fetching and transformation from Google Sheets API
 */

import { GOOGLE_SHEETS_CONFIG } from '../config/googleSheetsConfig';
import { STATUS_COLORS, ERROR_MESSAGES } from '../constants';

// Status colors mapping (exported for use in other components)
export { STATUS_COLORS };

/**
 * Transforms raw spreadsheet data into the expected FSD data format
 * @param {Array} values - Raw spreadsheet values
 * @returns {Object} Transformed FSD data
 */
const transformSheetData = (values) => {
  if (!values || values.length < 2) {
    throw new Error('Invalid spreadsheet data: insufficient rows');
  }

  const headers = values[0];
  const dataRows = values.slice(1);
  
  // Expected column mapping based on your spreadsheet headers
  const columnMap = {
    country: headers.findIndex(h => h.toLowerCase() === 'country'),
    status: headers.findIndex(h => h.toLowerCase() === 'status'),
    details: headers.findIndex(h => h.toLowerCase() === 'details'),
    milestones: headers.findIndex(h => h.toLowerCase() === 'milestones'),
    latestUpdate: headers.findIndex(h => h.toLowerCase() === 'latest update'),
    source: headers.findIndex(h => h.toLowerCase() === 'source'),
    lastUpdated: headers.findIndex(h => h.toLowerCase() === 'last updated'),
    geoName: headers.findIndex(h => h.toLowerCase() === 'country') // Use country name as geo name
  };

  // Log column mapping for debugging
  console.log('🔍 Column mapping found:');
  console.log('Headers:', headers);
  console.log('Column indices:', columnMap);

  // Validate required columns
  if (columnMap.country === -1) {
    throw new Error('Required column "Country" not found in spreadsheet');
  }

  const transformedData = {};
  
  dataRows.forEach((row, index) => {
    if (row.length === 0 || !row[columnMap.country]) return; // Skip empty rows
    
    const countryName = row[columnMap.country].trim();
    if (!countryName) return; // Skip rows without country name
    
    // Parse milestones if they exist
    let milestones = [];
    if (columnMap.milestones !== -1 && row[columnMap.milestones]) {
      try {
        // Try to parse as JSON first
        milestones = JSON.parse(row[columnMap.milestones]);
      } catch {
        // If not JSON, try to split by newlines or semicolons
        const milestoneText = row[columnMap.milestones];
        if (milestoneText.includes('\n')) {
          milestones = milestoneText.split('\n').filter(m => m.trim());
        } else if (milestoneText.includes(';')) {
          milestones = milestoneText.split(';').filter(m => m.trim());
        } else {
          milestones = [milestoneText];
        }
      }
    }

    // Parse source if it exists (handle semicolon-separated values)
    let source = [];
    if (columnMap.source !== -1 && row[columnMap.source]) {
      const sourceText = row[columnMap.source];
      if (sourceText.includes('\n')) {
        source = sourceText.split('\n').filter(s => s.trim());
      } else if (sourceText.includes(';')) {
        source = sourceText.split(';').filter(s => s.trim());
      } else {
        source = [sourceText];
      }
    }

    // Parse details if it exists (handle semicolon-separated values)
    let details = [];
    if (columnMap.details !== -1 && row[columnMap.details]) {
      const detailsText = row[columnMap.details];
      if (detailsText.includes('\n')) {
        details = detailsText.split('\n').filter(d => d.trim());
      } else if (detailsText.includes(';')) {
        details = detailsText.split(';').filter(d => d.trim());
      } else {
        details = [detailsText];
      }
    }

    // Parse latest update if it exists (handle semicolon-separated values)
    let latestUpdate = [];
    if (columnMap.latestUpdate !== -1 && row[columnMap.latestUpdate]) {
      const updateText = row[columnMap.latestUpdate];
      if (updateText.includes('\n')) {
        latestUpdate = updateText.split('\n').filter(u => u.trim());
      } else if (updateText.includes(';')) {
        latestUpdate = updateText.split(';').filter(u => u.trim());
      } else {
        latestUpdate = [updateText];
      }
    }

    transformedData[countryName] = {
      status: columnMap.status !== -1 ? (row[columnMap.status] || "Not Available") : "Not Available",
      details: details.length > 0 ? details : ["No FSD availability or testing reported"],
      milestones: milestones.length > 0 ? milestones : ["No milestones recorded"],
      latestUpdate: latestUpdate.length > 0 ? latestUpdate : ["No updates available"],
      source: source.length > 0 ? source : ["Tesla website and various reports"],
      lastUpdated: columnMap.lastUpdated !== -1 ? (row[columnMap.lastUpdated] || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
      geoName: columnMap.geoName !== -1 ? (row[columnMap.geoName] || countryName) : countryName
    };
  });

  return transformedData;
};

/**
 * Fetches and transforms FSD data from Google Sheets
 * @returns {Promise<Object>} The transformed FSD data
 */
export const fetchFSDData = async () => {
  try {
    if (!GOOGLE_SHEETS_CONFIG.API_KEY) {
      throw new Error(ERROR_MESSAGES.CONFIG_MISSING + ': Google Sheets API key not configured');
    }

    if (!GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID) {
      throw new Error(ERROR_MESSAGES.CONFIG_MISSING + ': Spreadsheet ID not configured');
    }

    // URL encode the sheet name to handle spaces and special characters
    const encodedSheetName = encodeURIComponent(GOOGLE_SHEETS_CONFIG.SHEET_NAME);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID}/values/${encodedSheetName}?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;
    
    console.log('🔗 API URL:', url);
    console.log('📋 Sheet name:', GOOGLE_SHEETS_CONFIG.SHEET_NAME);
    console.log('🔑 API Key configured:', !!GOOGLE_SHEETS_CONFIG.API_KEY);
    console.log('📄 Spreadsheet ID:', GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID);
    
    const response = await fetch(url);
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HTTP Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.values || !Array.isArray(data.values)) {
      throw new Error('Invalid data format received from Google Sheets');
    }
    
    // Log the raw data for debugging
    console.log('📊 Raw spreadsheet data received:');
    console.log('Headers:', data.values[0]);
    console.log('Total rows:', data.values.length);
    console.log('First few data rows:', data.values.slice(1, 4));
    
    // Transform the raw data into the expected format
    const transformedData = transformSheetData(data.values);
    
    // Log the transformed data
    console.log('🔄 Transformed FSD data:');
    console.log('Countries loaded:', Object.keys(transformedData).length);
    console.log('Sample country data:', Object.entries(transformedData).slice(0, 3));
    
    return {
      fsdData: transformedData,
      lastUpdated: new Date().toISOString(),
      rowCount: data.values.length - 1, // Exclude header row
      range: data.range
    };
    
  } catch (error) {
    console.error('Error fetching spreadsheet data:', error);
    throw error;
  }
};

/**
 * Fetches specific sheet metadata
 * @returns {Promise<Object>} Sheet metadata
 */
export const fetchSheetMetadata = async () => {
  try {
    if (!GOOGLE_SHEETS_CONFIG.API_KEY || !GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID) {
      throw new Error(ERROR_MESSAGES.CONFIG_MISSING + ': API key or Spreadsheet ID not configured');
    }
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID}?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('Error fetching sheet metadata:', error);
    throw error;
  }
};

/**
 * Test function to verify API connection and configuration
 * Call this in the browser console to debug issues
 */
export const testGoogleSheetsConnection = async () => {
  console.log('🧪 Testing Google Sheets connection...');
  console.log('Config:', {
    API_KEY: GOOGLE_SHEETS_CONFIG.API_KEY ? '✅ Configured' : '❌ Missing',
    SPREADSHEET_ID: GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID ? '✅ Configured' : '❌ Missing',
    SHEET_NAME: GOOGLE_SHEETS_CONFIG.SHEET_NAME ? '✅ Configured' : '❌ Missing'
  });
  
  try {
    const data = await fetchFSDData();
    console.log('✅ Connection successful!', data);
    return data;
  } catch (error) {
    console.error('❌ Connection failed:', error);
    throw error;
  }
};

/**
 * Discover available sheet names in your spreadsheet
 * Call this in the browser console to see what sheet names are available
 */
export const discoverSheetNames = async () => {
  console.log('🔍 Discovering available sheet names...');
  
  try {
    const metadata = await fetchSheetMetadata();
    console.log('📊 Spreadsheet metadata:', metadata);
    
    if (metadata.sheets) {
      console.log('📋 Available sheets:');
      metadata.sheets.forEach((sheet, index) => {
        console.log(`  ${index + 1}. "${sheet.properties.title}" (ID: ${sheet.properties.sheetId})`);
      });
    }
    
    return metadata;
  } catch (error) {
    console.error('❌ Failed to discover sheet names:', error);
    throw error;
  }
};
