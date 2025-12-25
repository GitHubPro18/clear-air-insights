# 🌬️ AQI Monitor & Protection Planner

A comprehensive Air Quality Index (AQI) monitoring and health protection planning application for Indian cities. Get real-time air quality data and personalized recommendations to protect yourself and your family from air pollution.

## ✨ Features

### 📊 AQI Dashboard
- **Real-time AQI Monitoring**: Track air quality across major Indian cities including Delhi, Mumbai, Bangalore, Chennai, Kolkata, and more
- **Pollutant Breakdown**: Detailed view of individual pollutants (PM2.5, PM10, NO₂, SO₂, CO, O₃)
- **Visual Indicators**: Color-coded AQI levels with intuitive severity badges
- **City Selector**: Easily switch between cities to compare air quality
- **AQI Trend Charts**: Visualize pollution trends over time

### 🛡️ Protection Planner
- **Personalized Recommendations**: Get tailored protection advice based on current AQI levels
- **Budget-Based Suggestions**: Filter recommendations by your budget
- **Health Impact Assessment**: Understand how air quality affects sensitive groups
- **Product Recommendations**: Curated air purifiers, masks, and other protective equipment
- **Automatic Data Sync**: Seamlessly uses AQI data from the dashboard

### 🔗 Integrated Experience
- **Shared State Management**: AQI data flows automatically between pages
- **Context Banner**: Always see current air quality conditions
- **Smart Navigation**: Data persists across page transitions

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Charts**: Recharts
- **Backend**: Supabase Edge Functions
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── AQIHeader.tsx          # Main AQI display header
│   ├── AQIContextBanner.tsx   # Context banner for Protection Planner
│   ├── AQISummaryCard.tsx     # AQI summary display card
│   ├── AQITrendChart.tsx      # Trend visualization chart
│   ├── CitySelector.tsx       # City selection dropdown
│   ├── PollutantBreakdown.tsx # Individual pollutant details
│   ├── UserInputForm.tsx      # User preferences form
│   ├── RecommendationResults.tsx # Protection recommendations
│   ├── ProductCard.tsx        # Product recommendation cards
│   └── ...
├── contexts/
│   └── AQIContext.tsx         # Global AQI state management
├── data/
│   ├── aqiData.ts             # City AQI mock data
│   ├── mockPhase2Data.ts      # Protection planner data
│   └── productCatalog.ts      # Product recommendations
├── lib/
│   ├── recommendationEngine.ts # AI-powered recommendations
│   └── utils.ts               # Utility functions
├── pages/
│   ├── Dashboard.tsx          # AQI Dashboard page
│   ├── Index.tsx              # Protection Planner page
│   └── NotFound.tsx           # 404 page
└── hooks/
    └── use-mobile.tsx         # Mobile detection hook
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or bun

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173](https://aqiproject-ten.vercel.app/`

## 📊 AQI Categories

| AQI Range | Category | Health Implications |
|-----------|----------|---------------------|
| 0-50 | Good | Air quality is satisfactory |
| 51-100 | Moderate | Acceptable for most people |
| 101-200 | Poor | May cause discomfort to sensitive groups |
| 201-300 | Unhealthy | Health effects for everyone |
| 301-400 | Very Unhealthy | Serious health effects |
| 401-500 | Hazardous | Health emergency conditions |

## 🏙️ Supported Cities

- Delhi
- Mumbai
- Bangalore
- Chennai
- Kolkata
- Hyderabad
- Pune
- Ahmedabad
- Jaipur
- Lucknow
- Chandigarh
- Gurgaon
- Noida

## 🔧 Environment Variables

```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
OPENWEATHERMAP_API_KEY=<your-api-key>
```

## 📱 Pages

### `/dashboard` - AQI Dashboard
Monitor real-time air quality with detailed pollutant breakdown and trend charts.

### `/` - Protection Planner
Get personalized protection recommendations based on current AQI levels and your preferences.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Air quality data concepts based on Indian AQI standards
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---
