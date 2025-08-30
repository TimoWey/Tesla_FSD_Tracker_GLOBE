# Tesla FSD Tracker Globe 🌍

An interactive 3D globe visualization showing Tesla's Full Self-Driving (FSD) availability and progress across different countries. Built with modern React, Three.js, and Globe.gl, this tool provides real-time insights into the global deployment of autonomous driving technology.

## ✨ Features

- **Interactive 3D Globe**: Navigate around a beautiful 3D Earth with smooth controls
- **Real-time Data**: Live FSD status updates from Google Sheets
- **Country Information**: Detailed status, milestones, and updates for each country
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Touch Support**: Full mobile touch and gesture support
- **Performance Optimized**: WebGL-based rendering with mobile optimizations

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Google Sheets API key
- Publicly accessible Google Spreadsheet

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TimoWey/Tesla_FSD_Tracker_GLOBE.git
   cd Tesla_FSD_Tracker_GLOBE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Google Sheets**
   - Create a `.env` file in the project root
   - Add your Google Sheets API configuration:
   ```env
   REACT_APP_GOOGLE_SHEETS_API_KEY=your_api_key_here
   REACT_APP_SPREADSHEET_ID=your_spreadsheet_id_here
   REACT_APP_SHEET_NAME=Sheet1
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Architecture

### Modern React Patterns

- **Custom Hooks**: `useGoogleSheets`, `useSidebar` for state management
- **Component Composition**: Modular, reusable components
- **Performance Optimization**: React.memo, useCallback, useMemo
- **Type Safety**: PropTypes and structured data handling

### Component Structure

```
src/
├── components/          # React components
│   ├── GlobeComponent.js    # 3D globe visualization
│   ├── CountrySidebar.js    # Country information panel
│   ├── AboutSidebar.js      # Project information
│   ├── LoadingScreen.js     # Loading state
│   └── ErrorScreen.js       # Error handling
├── hooks/              # Custom React hooks
│   ├── useGoogleSheets.js   # Data fetching logic
│   └── useSidebar.js        # Sidebar state management
├── constants/          # Application constants
│   └── index.js            # Centralized configuration
├── services/           # External service integrations
│   └── googleSheetsService.js # Google Sheets API
├── utils/              # Utility functions
│   └── webglDetection.js    # WebGL support detection
└── assets/             # Static assets
    ├── BlueMarbleTexture_*.png  # Earth textures
    └── custom.geo.json          # Geographic data
```

### Key Technologies

- **React 19**: Latest React features and hooks
- **Tailwind CSS**: Utility-first CSS framework
- **Globe.gl**: 3D globe visualization library
- **Three.js**: 3D graphics and WebGL framework
- **Lucide React**: Modern icon library

## 📊 Data Structure

The application expects Google Sheets data with the following columns:

| Column | Description | Example |
|--------|-------------|---------|
| Country | Country name | "United States" |
| Status | FSD availability status | "Fully Released" |
| Details | FSD details and notes | "FSD Beta available to all users" |
| Milestones | Key development milestones | "2023: Beta release" |
| Latest Update | Recent updates | "2024: Enhanced features" |
| Source | Information sources | "Tesla website" |
| Last Updated | Last data update | "2024-01-15" |

### Status Values

- 🟢 **Fully Released**: FSD is available to all users
- 🟡 **Partially Released**: FSD is available to select users
- 🟠 **Testing**: FSD is in testing phase
- 🔵 **Pending**: FSD is planned but not yet available
- 🔴 **Not Available**: FSD is not available in this country

## 🎨 UI/UX Features

### Modern Design System

- **Glass Morphism**: Translucent panels with backdrop blur
- **Responsive Layout**: Adaptive design for all screen sizes
- **Smooth Animations**: CSS transitions and micro-interactions
- **Accessibility**: ARIA labels and keyboard navigation

### Mobile Experience

- **Touch Gestures**: Swipe to close sidebars
- **Optimized Performance**: Reduced quality settings for mobile
- **Responsive Controls**: Touch-friendly button sizes
- **Orientation Support**: Landscape and portrait modes

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Google Sheets API Configuration
REACT_APP_GOOGLE_SHEETS_API_KEY=your_api_key_here
REACT_APP_SPREADSHEET_ID=your_spreadsheet_id_here
REACT_APP_SHEET_NAME=Sheet1

# Optional: Custom configuration
REACT_APP_APP_NAME=Tesla FSD Tracker
REACT_APP_VERSION=1.0.0
```

### Google Sheets Setup

1. **Enable Google Sheets API**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google Sheets API
   - Create credentials (API Key)

2. **Prepare Your Spreadsheet**
   - Create a new Google Spreadsheet
   - Add the required columns (see Data Structure)
   - Make the spreadsheet publicly accessible
   - Copy the spreadsheet ID from the URL

3. **Configure the Application**
   - Update the `.env` file with your credentials
   - Restart the development server

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

### Environment-Specific Builds

```bash
# Development
npm start

# Production build
npm run build

# Test production build locally
npm run serve
```

## 🧪 Development

### Code Quality

- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (if configured)
- **Component Documentation**: JSDoc comments
- **Error Handling**: Comprehensive error boundaries

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Debugging

- **Console Logging**: Comprehensive logging for debugging
- **WebGL Detection**: Automatic graphics capability detection
- **Performance Monitoring**: Mobile vs desktop optimizations
- **Error Boundaries**: Graceful error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow React best practices
- Use modern ES6+ syntax
- Maintain component reusability
- Add comprehensive documentation
- Include error handling
- Test on multiple devices

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Globe.gl**: 3D globe visualization library
- **Three.js**: 3D graphics and WebGL framework
- **React**: UI framework and component architecture
- **Google Sheets API**: Data storage and retrieval
- **Tailwind CSS**: Utility-first CSS framework

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/TimoWey/FSD_Progress_Tracker/issues)
- **Documentation**: [Project Wiki](https://github.com/TimoWey/FSD_Progress_Tracker/wiki)
- **Discussions**: [GitHub Discussions](https://github.com/TimoWey/FSD_Progress_Tracker/discussions)

---

**Made with ❤️ for the Tesla community**

*Built with React, Three.js, and modern web technologies*
