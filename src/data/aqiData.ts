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
}

// Mock AQI data for development
export const getMockAQIData = (cityName: string): AQIData => {
  // Generate realistic mock data based on city
  const cityMockData: Record<string, Partial<AQIData>> = {
    "Delhi": { aqi: 285, pollutants: { pm25: 142, pm10: 245, no2: 68, so2: 22, co: 1.8, o3: 45 } },
    "Mumbai": { aqi: 128, pollutants: { pm25: 62, pm10: 98, no2: 45, so2: 15, co: 1.2, o3: 38 } },
    "Bangalore": { aqi: 89, pollutants: { pm25: 38, pm10: 72, no2: 35, so2: 12, co: 0.9, o3: 42 } },
    "Chennai": { aqi: 105, pollutants: { pm25: 48, pm10: 85, no2: 42, so2: 18, co: 1.1, o3: 52 } },
    "Kolkata": { aqi: 178, pollutants: { pm25: 88, pm10: 142, no2: 55, so2: 25, co: 1.5, o3: 48 } },
    "Hyderabad": { aqi: 95, pollutants: { pm25: 42, pm10: 78, no2: 38, so2: 14, co: 1.0, o3: 40 } },
    "Pune": { aqi: 112, pollutants: { pm25: 52, pm10: 92, no2: 48, so2: 16, co: 1.1, o3: 44 } },
    "Ahmedabad": { aqi: 145, pollutants: { pm25: 72, pm10: 118, no2: 52, so2: 20, co: 1.3, o3: 46 } },
    "Jaipur": { aqi: 168, pollutants: { pm25: 82, pm10: 135, no2: 58, so2: 24, co: 1.4, o3: 50 } },
    "Lucknow": { aqi: 198, pollutants: { pm25: 98, pm10: 165, no2: 62, so2: 28, co: 1.6, o3: 55 } },
    "Chandigarh": { aqi: 78, pollutants: { pm25: 32, pm10: 62, no2: 28, so2: 10, co: 0.8, o3: 35 } },
    "Gurgaon": { aqi: 245, pollutants: { pm25: 122, pm10: 198, no2: 65, so2: 26, co: 1.7, o3: 48 } },
    "Noida": { aqi: 258, pollutants: { pm25: 128, pm10: 212, no2: 68, so2: 28, co: 1.8, o3: 52 } },
  };

  const baseData = cityMockData[cityName] || { aqi: 120, pollutants: { pm25: 55, pm10: 95, no2: 45, so2: 18, co: 1.2, o3: 42 } };
  const category = getAQICategory(baseData.aqi!);

  return {
    city: cityName,
    aqi: baseData.aqi!,
    aqiCategory: category.label,
    pollutants: baseData.pollutants!,
    lastUpdated: new Date().toISOString(),
  };
};
