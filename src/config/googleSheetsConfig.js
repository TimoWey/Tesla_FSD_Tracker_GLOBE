/**
 * Google Sheets API Configuration
 * 
 * IMPORTANT: Replace these placeholder values with your actual configuration
 * See GOOGLE_SHEETS_SETUP.md for detailed setup instructions
 * 
 * For security, it's recommended to use environment variables:
 * Create a .env file in the project root with:
 * REACT_APP_GOOGLE_SHEETS_API_KEY=your_api_key
 * REACT_APP_SPREADSHEET_ID=your_spreadsheet_id
 * REACT_APP_SHEET_NAME=your_sheet_name
 */

export const GOOGLE_SHEETS_CONFIG = {
  // Your Google Sheets API key from Google Cloud Console
  API_KEY: process.env.REACT_APP_GOOGLE_SHEETS_API_KEY || 'YOUR_ACTUAL_API_KEY_HERE',
  
  // Your spreadsheet ID from the URL
  // Format: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
  SPREADSHEET_ID: process.env.REACT_APP_SPREADSHEET_ID || 'YOUR_ACTUAL_SPREADSHEET_ID_HERE',
  
  // The name of the sheet tab (usually "Sheet1" or similar)
  SHEET_NAME: process.env.REACT_APP_SHEET_NAME || 'Sheet1'
};

// Alternative: Hardcoded configuration (less secure, but easier for quick setup)
// export const GOOGLE_SHEETS_CONFIG = {
//   API_KEY: 'YOUR_ACTUAL_API_KEY_HERE',
//   SPREADSHEET_ID: 'YOUR_ACTUAL_SPREADSHEET_ID_HERE',
//   SHEET_NAME: 'Sheet1'
// };
