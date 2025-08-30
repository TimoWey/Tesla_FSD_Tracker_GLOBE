# Tesla FSD Tracker Globe

A simplified 3D globe visualization showing Tesla Full Self-Driving (FSD) availability and testing status across countries.

## Features

- **3D Interactive Globe**: Built with Globe.gl and Three.js
- **Real-time Data**: Fetches FSD status from Google Sheets
- **Responsive Design**: Works on desktop and mobile devices
- **Country Information**: Detailed sidebar with FSD status, milestones, and updates

## Quick Setup

### 1. Google Sheets Setup

1. Create a Google Sheet with these columns:
   - **Country** (required)
   - **Status** (optional)
   - **Details** (optional)
   - **Milestones** (optional)
   - **Latest Update** (optional)
   - **Source** (optional)
   - **Last Updated** (optional)

2. Make the sheet publicly accessible

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
REACT_APP_GOOGLE_SHEETS_API_KEY=your_api_key_here
REACT_APP_SPREADSHEET_ID=your_spreadsheet_id_here
REACT_APP_SHEET_NAME=Sheet1
```

### 3. Install & Run

```bash
npm install
npm start
```

## Data Format

The spreadsheet should have this structure:

| Country | Status | Details | Milestones | Latest Update | Source | Last Updated |
|---------|--------|---------|------------|---------------|---------|--------------|
| United States | Fully Released | FSD Beta available to all users | Beta 11.4.4 released | Tesla website | 2024-01-15 |
| Canada | Testing | Limited testing program | Initial testing phase | Various reports | 2024-01-10 |

## Status Values

- **Fully Released**: FSD is available to all users
- **Partially Released**: FSD is available to some users
- **Testing**: FSD is in testing phase
- **Pending**: FSD is planned but not yet available
- **Not Available**: FSD is not available

## Architecture

- **`src/services/googleSheetsService.js`**: Simplified data fetching and transformation
- **`src/hooks/useGoogleSheets.js`**: Clean data management hook
- **`src/components/GlobeComponent.js`**: 3D globe visualization
- **`src/components/CountrySidebar.js`**: Country information display

## Simplified Features

- **Clean Data Flow**: Direct spreadsheet → component mapping
- **Simple Configuration**: Minimal setup required
- **Reduced Complexity**: Removed unnecessary parsing and fallbacks
- **Better Performance**: Fewer data transformations

## Troubleshooting

- **No data loading**: Check your API key and spreadsheet ID
- **Wrong country names**: Ensure country names match exactly between spreadsheet and geo data
- **Performance issues**: Check browser WebGL support

## License

MIT License - see LICENSE file for details.
