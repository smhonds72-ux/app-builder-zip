# LiveWire Coach Portal

A comprehensive coach analytics dashboard for esports team management and performance analysis.

## 🚀 Features

### **Live Mode Integration**
- **Real-time data** from GRID API with live series selection
- **Advanced analytics** using professional formulas:
  - Round Timing Efficiency
  - Objective Pressure Efficiency (OPE)  
  - Decision Variance (DSV)
  - Tempo Leak analysis
  - Pace Deviation calculations
- **Notification system** for seamless live mode activation
- **Selected series persistence** across page refreshes

### **Coach Portal Components**
- **Command Center** - Team overview with win rates, KDA, performance trends
- **Team Analytics** - Player breakdowns, strength analysis, performance rankings
- **Players** - Individual player profiles with enhanced metrics
- **Strategy Lab** - Draft priorities and saved strategies
- **What-if Simulator** - Critical event analysis and alternative decisions
- **Team Agenda** - Review agendas with results and coach notes
- **Training Scheduler** - Active drills and training management
- **Coach Henry** - AI-powered suggested questions and insights

### **Data Export**
- **CSV export** for team analytics reports
- **Comprehensive data** including live/mode indicators
- **Timestamped reports** with player performance metrics

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Tailwind CSS + shadcn/ui + Lucide Icons
- **Animations**: Framer Motion
- **State Management**: React Context API
- **API Integration**: GRID API with proxy server for CORS handling
- **Charts**: Recharts for data visualization

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd app-builder-zip
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
# Copy environment template
cp .env.example .env.local

# Configure environment variables
# See Environment Variables section below
```

4. **Start Development Server**
```bash
npm run dev
```

5. **Start Proxy Server** (for live mode)
```bash
# Option 1: Node.js proxy
npm run proxy

# Option 2: Python proxy (requires Python 3.8+)
npm run proxy:python
```

## ⚙️ Environment Variables

Supabase integration has been disabled, demo accounts set up for testing.

```env
# Grid API Configuration
VITE_GRID_API_KEY=your_grid_api_key_here
VITE_PROXY_URL=http://localhost:3001

# Team Configuration (Optional)
VITE_TEAM_ID=your_team_id_here

# Development
NODE_ENV=development
```

### Getting API Keys

1. **Grid API Key**: Register at [Grid.gg](https://grid.gg) and obtain your API key
2. **Proxy Server**: The included proxy server handles CORS for Grid API requests

## 🎯 Live Mode Setup

### **Enabling Live Mode**

1. **Toggle Live Mode** - Click the data mode toggle in the top navigation
2. **Select Series** - Choose from available live series in the notification popup
3. **View Real Data** - All components will display data from your selected series

### **Live Mode Features**
- **Real player statistics** from actual matches
- **Professional analytics** formulas applied to live data
- **Series-specific data** - All components use the same selected series
- **No mock data** - Only real Grid API data in live mode

### **Analytics Formulas**
- **Round Timing Efficiency**: `100 - (killVariance * 10)`
- **Objective Pressure Efficiency (OPE)**: `objectivesPerRound * 50`
- **Decision Variance (DSV)**: `Math.sqrt(killVariance)`
- **Tempo Leak**: Momentum loss percentage calculation
- **Pace Deviation**: Headshot rate consistency analysis

## 📊 Data Export

### **Team Analytics Export**
1. Navigate to **Team Analytics** page
2. Click **Export Report** button
3. CSV file downloads with:
   - Team summary statistics
   - Individual player metrics
   - Live/Mock mode indicators
   - Enhanced GRID analytics

### **Export Format**
- CSV format with comprehensive player data
- Includes KDA, kills, deaths, assists, vision score
- Enhanced metrics: DSV, Tempo Leak, OPE, Clutch Factor
- Timestamp and data mode indicators

## 🔧 Development

### **Project Structure**
```
src/
├── components/          # Reusable UI components
│   ├── LiveModeNotification.tsx
│   ├── DataModeToggle.tsx
│   └── ui/              # shadcn/ui components
├── contexts/           # React contexts
│   └── DataContext.tsx
├── lib/               # Utilities and services
│   ├── dataService.ts
│   └── gridAPI.ts
├── pages/
│   └── coach/         # Coach portal pages
├── hooks/             # Custom React hooks
└── types/             # TypeScript type definitions
```

### **Proxy Server**
The included proxy server handles CORS requests to the Grid API:

- **Node.js Version**: `proxy-server.js`
- **Python Version**: `proxy-server.py`
- **Port**: 3001 (configurable)
- **Endpoints**: `/api/proxy-download/:seriesId`

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run proxy        # Start Node.js proxy server
npm run proxy:python # Start Python proxy server
npm run lint         # Run ESLint
npm run test         # Run tests
```

## 🎮 Usage Guide

### **For Coaches**
1. **Team Overview** - Start with Command Center for team performance snapshot
2. **Player Analysis** - Use Players page for individual performance metrics
3. **Strategy Development** - Leverage Strategy Lab for draft planning
4. **Performance Review** - Export reports from Team Analytics for meetings

### **Live Mode Benefits**
- **Real-time insights** from ongoing matches
- **Professional analytics** with industry-standard formulas
- **Data-driven decisions** based on actual performance
- **Comprehensive reporting** for stakeholder communication

## 🐛 Troubleshooting

### **Common Issues**

**Live Mode Not Working**
- Ensure proxy server is running on port 3001
- Check Grid API key in environment variables
- Verify internet connection for API access

**Export Report Not Downloading**
- Check browser download settings
- Ensure popup blockers are disabled
- Try hard refresh (Ctrl+Shift+R)

**Notification Popup Issues**
- Clear browser cache and hard refresh
- Check browser console for errors
- Ensure JavaScript is enabled

### **Debug Mode**
Debug information is available in development mode. Check browser console for:
- API request/response logs
- Data processing status
- Error messages and stack traces

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review the development documentation

---

**LiveWire Coach Portal** - Professional esports analytics at your fingertips.
