# Simple Setup Guide

## 1. Google Sheets Setup

1. **Create a new Google Sheet** with these columns:
   ```
   Country | Status | Details | Milestones | Latest Update | Source | Last Updated
   ```

2. **Add some sample data:**
   ```
   United States | Fully Released | FSD Beta available to all users | Beta 11.4.4 released | Tesla website | 2024-01-15
   Canada | Testing | Limited testing program | Initial testing phase | Various reports | 2024-01-10
   ```

3. **Make it public:**
   - Click "Share" → "Change to anyone with the link" → "Viewer"

4. **Copy the Spreadsheet ID:**
   - From URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit`

## 2. Google Cloud Setup

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project** (or select existing)
3. **Enable Google Sheets API:**
   - APIs & Services → Library → Search "Google Sheets API" → Enable
4. **Create API Key:**
   - APIs & Services → Credentials → Create Credentials → API Key
5. **Copy the API Key**

## 3. Environment Setup

1. **Create `.env` file** in project root:
   ```env
   REACT_APP_GOOGLE_SHEETS_API_KEY=your_api_key_here
   REACT_APP_SPREADSHEET_ID=your_spreadsheet_id_here
   REACT_APP_SHEET_NAME=Sheet1
   ```

2. **Restart your development server**

## 4. Test

1. **Run the app:** `npm start`
2. **Check browser console** for any errors
3. **Click on countries** to see FSD data

## Troubleshooting

- **"Google Sheets configuration missing"**: Check your `.env` file
- **"Required column Country not found"**: Check your spreadsheet column names
- **No data loading**: Verify your API key and spreadsheet ID are correct
- **403 Forbidden**: Make sure your spreadsheet is publicly accessible

## Column Names

The app looks for these column names (case-insensitive, partial matches):
- `country` (required)
- `status`
- `details`
- `milestones`
- `latest update`
- `source`
- `last updated`
