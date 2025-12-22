// AQI Category Mapping (India Standards)
export interface AQICategory {
  min: number;
  max: number;
  label: string;
  color: string;
  bgClass: string;
  textClass: string;
}

export const AQI_CATEGORIES: AQICategory[] = [
  { min: 0, max: 50, label: "Good", color: "#10B981", bgClass: "bg-emerald-500", textClass: "text-emerald-500" },
  { min: 51, max: 100, label: "Satisfactory", color: "#84CC16", bgClass: "bg-lime-500", textClass: "text-lime-500" },
  { min: 101, max: 200, label: "Moderate", color: "#EAB308", bgClass: "bg-yellow-500", textClass: "text-yellow-500" },
  { min: 201, max: 300, label: "Poor", color: "#F97316", bgClass: "bg-orange-500", textClass: "text-orange-500" },
  { min: 301, max: 400, label: "Very Poor", color: "#EF4444", bgClass: "bg-red-500", textClass: "text-red-500" },
  { min: 401, max: 500, label: "Severe", color: "#7F1D1D", bgClass: "bg-red-900", textClass: "text-red-900" },
];

export const getAQICategory = (aqi: number): AQICategory => {
  return AQI_CATEGORIES.find(cat => aqi >= cat.min && aqi <= cat.max) || AQI_CATEGORIES[5];
};

// Health Interpretations (Non-medical, informational only)
export const HEALTH_INTERPRETATIONS: Record<string, string> = {
  "Good": "Air quality is considered satisfactory, and air pollution poses little or no risk. Ideal conditions for outdoor activities.",
  "Satisfactory": "Air quality is acceptable. However, there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.",
  "Moderate": "Members of sensitive groups may experience health effects. The general public is less likely to be affected. People with respiratory or heart conditions should limit prolonged outdoor exertion.",
  "Poor": "Breathing discomfort to people on prolonged exposure. People with heart or lung disease, older adults, and children may experience more serious health effects.",
  "Very Poor": "Health warnings of emergency conditions. Everyone may experience health effects; sensitive groups may experience more serious health effects.",
  "Severe": "Health alert: everyone may experience more serious health effects. Avoid outdoor activities. People with respiratory or heart conditions should stay indoors."
};

// Indian Cities for selection
export interface City {
  name: string;
  state: string;
  lat: number;
  lon: number;
}

export const INDIAN_CITIES: City[] = [
  { name: "Delhi", state: "Delhi", lat: 28.6139, lon: 77.2090 },
  { name: "Mumbai", state: "Maharashtra", lat: 19.0760, lon: 72.8777 },
  { name: "Bangalore", state: "Karnataka", lat: 12.9716, lon: 77.5946 },
  { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707 },
  { name: "Kolkata", state: "West Bengal", lat: 22.5726, lon: 88.3639 },
  { name: "Hyderabad", state: "Telangana", lat: 17.3850, lon: 78.4867 },
  { name: "Pune", state: "Maharashtra", lat: 18.5204, lon: 73.8567 },
  { name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lon: 72.5714 },
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lon: 75.7873 },
  { name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lon: 80.9462 },
  { name: "Chandigarh", state: "Punjab", lat: 30.7333, lon: 76.7794 },
  { name: "Gurgaon", state: "Haryana", lat: 28.4595, lon: 77.0266 },
  { name: "Noida", state: "Uttar Pradesh", lat: 28.5355, lon: 77.3910 },
];

// Pollutant Information
export interface Pollutant {
  key: string;
  name: string;
  fullName: string;
  unit: string;
  description: string;
}

export const POLLUTANTS: Pollutant[] = [
  { key: "pm25", name: "PM2.5", fullName: "Fine Particulate Matter", unit: "µg/m³", description: "Fine particles less than 2.5 micrometers in diameter that can penetrate deep into the lungs." },
  { key: "pm10", name: "PM10", fullName: "Coarse Particulate Matter", unit: "µg/m³", description: "Particles less than 10 micrometers in diameter from dust, pollen, and mold." },
  { key: "no2", name: "NO₂", fullName: "Nitrogen Dioxide", unit: "µg/m³", description: "Reddish-brown gas produced by vehicle emissions and power plants." },
  { key: "so2", name: "SO₂", fullName: "Sulfur Dioxide", unit: "µg/m³", description: "Gas produced from burning fossil fuels, particularly coal." },
  { key: "co", name: "CO", fullName: "Carbon Monoxide", unit: "mg/m³", description: "Colorless, odorless gas produced by incomplete combustion of fuels." },
  { key: "o3", name: "O₃", fullName: "Ozone", unit: "µg/m³", description: "Ground-level ozone formed by chemical reactions between pollutants in sunlight." },
];

// AQI Data Structure
export interface AQIData {
  city: string;
  aqi: number;
  aqiCategory: string;
  pollutants: {
    pm25: number;
    pm10: number;
    no2: number;
    so2: number;
    co: number;
    o3: number;
  };
  lastUpdated: string;
  history24h?: AQIHistoryPoint[];
}

// Random value generator helper (generates once at initialization)
const randomInRange = (min: number, max: number): number => 
  Math.floor(Math.random() * (max - min + 1)) + min;

// City-specific ranges for AQI, PM2.5, and PM10
interface CityRanges {
  aqi: { min: number; max: number };
  pm25: { min: number; max: number };
  pm10: { min: number; max: number };
}

const cityRanges: Record<string, CityRanges> = {
  Delhi: { aqi: { min: 400, max: 450 }, pm25: { min: 200, max: 250 }, pm10: { min: 220, max: 270 } },
  Mumbai: { aqi: { min: 120, max: 170 }, pm25: { min: 60, max: 110 }, pm10: { min: 80, max: 130 } },
  Bangalore: { aqi: { min: 80, max: 130 }, pm25: { min: 40, max: 90 }, pm10: { min: 50, max: 100 } },
  Chennai: { aqi: { min: 90, max: 140 }, pm25: { min: 45, max: 95 }, pm10: { min: 55, max: 105 } },
  Kolkata: { aqi: { min: 290, max: 340 }, pm25: { min: 140, max: 190 }, pm10: { min: 170, max: 220 } },
  Hyderabad: { aqi: { min: 170, max: 220 }, pm25: { min: 80, max: 130 }, pm10: { min: 90, max: 140 } },
  Pune: { aqi: { min: 200, max: 250 }, pm25: { min: 150, max: 200 }, pm10: { min: 170, max: 220 } },
  Ahmedabad: { aqi: { min: 130, max: 180 }, pm25: { min: 50, max: 100 }, pm10: { min: 60, max: 110 } },
  Jaipur: { aqi: { min: 130, max: 180 }, pm25: { min: 55, max: 105 }, pm10: { min: 70, max: 120 } },
  Lucknow: { aqi: { min: 250, max: 300 }, pm25: { min: 150, max: 200 }, pm10: { min: 170, max: 220 } },
  Chandigarh: { aqi: { min: 180, max: 230 }, pm25: { min: 70, max: 120 }, pm10: { min: 90, max: 140 } },
  Gurgaon: { aqi: { min: 350, max: 400 }, pm25: { min: 160, max: 210 }, pm10: { min: 180, max: 230 } },
  Noida: { aqi: { min: 350, max: 400 }, pm25: { min: 160, max: 210 }, pm10: { min: 180, max: 230 } },
};

// Fixed pollutant values for NO2, SO2, CO, O3 (same for all cities)
const fixedPollutants = {
  no2: 55,
  so2: 20,
  co: 1.4,
  o3: 45,
};

// Generate mock data once at initialization time
const generatedCityMockData: Record<string, { aqi: number; pollutants: AQIData['pollutants'] }> = {};

Object.entries(cityRanges).forEach(([city, ranges]) => {
  generatedCityMockData[city] = {
    aqi: randomInRange(ranges.aqi.min, ranges.aqi.max),
    pollutants: {
      pm25: randomInRange(ranges.pm25.min, ranges.pm25.max),
      pm10: randomInRange(ranges.pm10.min, ranges.pm10.max),
      ...fixedPollutants,
    },
  };
});

// Default fallback for unknown cities
const defaultMockData = {
  aqi: 120,
  pollutants: { pm25: 55, pm10: 95, ...fixedPollutants },
};

// Mock AQI data for development
export const getMockAQIData = (cityName: string): AQIData => {
  const baseData = generatedCityMockData[cityName] || defaultMockData;
  const category = getAQICategory(baseData.aqi);

  return {
    city: cityName,
    aqi: baseData.aqi,
    aqiCategory: category.label,
    pollutants: baseData.pollutants,
    lastUpdated: new Date().toISOString(),
  };
};

// Fetch live AQI data from OpenWeatherMap API via edge function
export const fetchLiveAQIData = async (cityName: string): Promise<AQIData> => {
  const city = INDIAN_CITIES.find(c => c.name === cityName);
  if (!city) {
    throw new Error(`City ${cityName} not found`);
  }

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-aqi`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat: city.lat,
        lon: city.lon,
        city: cityName,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch AQI data');
  }

  return response.json();
};

// Historical AQI data point
export interface AQIHistoryPoint {
  time: string;
  aqi: number;
  label: string;
}

// Generate mock historical AQI data
export const getMockAQIHistory = (cityName: string, period: '24h' | '7d'): AQIHistoryPoint[] => {
  const baseAQI = getMockAQIData(cityName).aqi;
  const points: AQIHistoryPoint[] = [];
  
  if (period === '24h') {
    // Generate hourly data for 24 hours
    for (let i = 23; i >= 0; i--) {
      const date = new Date();
      date.setHours(date.getHours() - i);
      const variation = Math.sin(i / 4) * 30 + (Math.random() - 0.5) * 20;
      const aqi = Math.max(10, Math.min(500, Math.round(baseAQI + variation)));
      points.push({
        time: date.toISOString(),
        aqi,
        label: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      });
    }
  } else {
    // Generate daily data for 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const variation = (Math.random() - 0.5) * 60;
      const aqi = Math.max(10, Math.min(500, Math.round(baseAQI + variation)));
      points.push({
        time: date.toISOString(),
        aqi,
        label: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
      });
    }
  }
  
  return points;
};
