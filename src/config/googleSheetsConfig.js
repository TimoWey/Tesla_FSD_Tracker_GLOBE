/**
 * Google Sheets API Configuration
 * 
 * Setup:
 * 1. Get API key from Google Cloud Console
 * 2. Get spreadsheet ID from your Google Sheets URL
 * 3. Set sheet name (usually "Sheet1")
 * 
 * For security, use environment variables:
 * REACT_APP_GOOGLE_SHEETS_API_KEY=your_api_key
 * REACT_APP_SPREADSHEET_ID=your_spreadsheet_id
 * REACT_APP_SHEET_NAME=your_sheet_name
 */

export const GOOGLE_SHEETS_CONFIG = {
  API_KEY: process.env.REACT_APP_GOOGLE_SHEETS_API_KEY || 'YOUR_API_KEY_HERE',
  SPREADSHEET_ID: process.env.REACT_APP_SPREADSHEET_ID || 'YOUR_SPREADSHEET_ID_HERE',
  SHEET_NAME: process.env.REACT_APP_SHEET_NAME || 'Sheet1'
};
