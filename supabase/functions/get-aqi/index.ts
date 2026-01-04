import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AQIRequest {
  city: string;
}

// City coordinates for major Indian cities
const cityCoordinates: Record<string, { lat: number; lon: number }> = {
  "Delhi": { lat: 28.6139, lon: 77.2090 },
  "Mumbai": { lat: 19.0760, lon: 72.8777 },
  "Bangalore": { lat: 12.9716, lon: 77.5946 },
  "Chennai": { lat: 13.0827, lon: 80.2707 },
  "Kolkata": { lat: 22.5726, lon: 88.3639 },
  "Hyderabad": { lat: 17.3850, lon: 78.4867 },
  "Pune": { lat: 18.5204, lon: 73.8567 },
  "Ahmedabad": { lat: 23.0225, lon: 72.5714 },
  "Jaipur": { lat: 26.9124, lon: 75.7873 },
  "Lucknow": { lat: 26.8467, lon: 80.9462 },
  "Chandigarh": { lat: 30.7333, lon: 76.7794 },
  "Gurgaon": { lat: 28.4595, lon: 77.0266 },
  "Noida": { lat: 28.5355, lon: 77.3910 },
};

// CPCB AQI breakpoints for India
const breakpoints = {
  pm25: [
    { cLow: 0, cHigh: 30, iLow: 0, iHigh: 50 },
    { cLow: 31, cHigh: 60, iLow: 51, iHigh: 100 },
    { cLow: 61, cHigh: 90, iLow: 101, iHigh: 200 },
    { cLow: 91, cHigh: 120, iLow: 201, iHigh: 300 },
    { cLow: 121, cHigh: 250, iLow: 301, iHigh: 400 },
    { cLow: 251, cHigh: 500, iLow: 401, iHigh: 500 },
  ],
  pm10: [
    { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50 },
    { cLow: 51, cHigh: 100, iLow: 51, iHigh: 100 },
    { cLow: 101, cHigh: 250, iLow: 101, iHigh: 200 },
    { cLow: 251, cHigh: 350, iLow: 201, iHigh: 300 },
    { cLow: 351, cHigh: 430, iLow: 301, iHigh: 400 },
    { cLow: 431, cHigh: 600, iLow: 401, iHigh: 500 },
  ],
  no2: [
    { cLow: 0, cHigh: 40, iLow: 0, iHigh: 50 },
    { cLow: 41, cHigh: 80, iLow: 51, iHigh: 100 },
    { cLow: 81, cHigh: 180, iLow: 101, iHigh: 200 },
    { cLow: 181, cHigh: 280, iLow: 201, iHigh: 300 },
    { cLow: 281, cHigh: 400, iLow: 301, iHigh: 400 },
    { cLow: 401, cHigh: 600, iLow: 401, iHigh: 500 },
  ],
  so2: [
    { cLow: 0, cHigh: 40, iLow: 0, iHigh: 50 },
    { cLow: 41, cHigh: 80, iLow: 51, iHigh: 100 },
    { cLow: 81, cHigh: 380, iLow: 101, iHigh: 200 },
    { cLow: 381, cHigh: 800, iLow: 201, iHigh: 300 },
    { cLow: 801, cHigh: 1600, iLow: 301, iHigh: 400 },
    { cLow: 1601, cHigh: 2400, iLow: 401, iHigh: 500 },
  ],
  co: [ // mg/m³ (8-hour max)
    { cLow: 0, cHigh: 1.0, iLow: 0, iHigh: 50 },
    { cLow: 1.1, cHigh: 2.0, iLow: 51, iHigh: 100 },
    { cLow: 2.1, cHigh: 10, iLow: 101, iHigh: 200 },
    { cLow: 10.1, cHigh: 17, iLow: 201, iHigh: 300 },
    { cLow: 17.1, cHigh: 34, iLow: 301, iHigh: 400 },
    { cLow: 34.1, cHigh: 50, iLow: 401, iHigh: 500 },
  ],
  o3: [ // µg/m³ (8-hour max)
    { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50 },
    { cLow: 51, cHigh: 100, iLow: 51, iHigh: 100 },
    { cLow: 101, cHigh: 168, iLow: 101, iHigh: 200 },
    { cLow: 169, cHigh: 208, iLow: 201, iHigh: 300 },
    { cLow: 209, cHigh: 748, iLow: 301, iHigh: 400 },
    { cLow: 749, cHigh: 1000, iLow: 401, iHigh: 500 },
  ],
};

// Calculate sub-index using CPCB formula
const calculateSubIndex = (concentration: number, pollutantBreakpoints: typeof breakpoints.pm25): number => {
  for (const bp of pollutantBreakpoints) {
    if (concentration >= bp.cLow && concentration <= bp.cHigh) {
      return ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (concentration - bp.cLow) + bp.iLow;
    }
  }
  // If above all breakpoints, return 500
  return 500;
};

// Calculate 8-hour rolling average max
const calculate8HourMaxAvg = (values: number[]): number => {
  if (values.length < 8) return values.reduce((a, b) => a + b, 0) / values.length;
  
  let maxAvg = 0;
  for (let i = 0; i <= values.length - 8; i++) {
    const windowAvg = values.slice(i, i + 8).reduce((a, b) => a + b, 0) / 8;
    maxAvg = Math.max(maxAvg, windowAvg);
  }
  return maxAvg;
};

const getAQICategory = (aqi: number): string => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 200) return "Moderate";
  if (aqi <= 300) return "Poor";
  if (aqi <= 400) return "Very Poor";
  return "Severe";
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = "ea06d1808cc8137f1a4fc89b3be53737";
    const { city }: AQIRequest = await req.json();
    
    console.log(`Fetching AQI for ${city} from OpenWeatherMap`);

    const coords = cityCoordinates[city];
    if (!coords) {
      throw new Error(`City ${city} not found in coordinates list`);
    }

    // Calculate timestamps for last 24 hours
    const now = Math.floor(Date.now() / 1000);
    const start = now - (24 * 60 * 60); // 24 hours ago

    const url = `http://api.openweathermap.org/data/2.5/air_pollution/history?lat=${coords.lat}&lon=${coords.lon}&start=${start}&end=${now}&appid=${apiKey}`;
    console.log(`Fetching from: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      console.error(`OpenWeatherMap API error: ${response.status}`);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Received ${data.list?.length || 0} data points`);

    if (!data.list || data.list.length === 0) {
      throw new Error(`No pollution data available for ${city}`);
    }

    // Extract pollutant values from all data points
    const pm25Values: number[] = [];
    const pm10Values: number[] = [];
    const no2Values: number[] = [];
    const so2Values: number[] = [];
    const coValues: number[] = [];
    const o3Values: number[] = [];

    for (const point of data.list) {
      const components = point.components;
      if (components.pm2_5) pm25Values.push(components.pm2_5);
      if (components.pm10) pm10Values.push(components.pm10);
      if (components.no2) no2Values.push(components.no2);
      if (components.so2) so2Values.push(components.so2);
      if (components.co) coValues.push(components.co / 1000); // Convert µg/m³ to mg/m³
      if (components.o3) o3Values.push(components.o3);
    }

    // Calculate 24-hour averages for PM2.5, PM10, NO2, SO2
    const avgPm25 = pm25Values.length > 0 ? pm25Values.reduce((a, b) => a + b, 0) / pm25Values.length : 0;
    const avgPm10 = pm10Values.length > 0 ? pm10Values.reduce((a, b) => a + b, 0) / pm10Values.length : 0;
    const avgNo2 = no2Values.length > 0 ? no2Values.reduce((a, b) => a + b, 0) / no2Values.length : 0;
    const avgSo2 = so2Values.length > 0 ? so2Values.reduce((a, b) => a + b, 0) / so2Values.length : 0;

    // Calculate 8-hour max rolling average for CO and O3
    const maxCo = coValues.length > 0 ? calculate8HourMaxAvg(coValues) : 0;
    const maxO3 = o3Values.length > 0 ? calculate8HourMaxAvg(o3Values) : 0;

    console.log(`Averages - PM2.5: ${avgPm25.toFixed(1)}, PM10: ${avgPm10.toFixed(1)}, NO2: ${avgNo2.toFixed(1)}, SO2: ${avgSo2.toFixed(1)}`);
    console.log(`8-hour max - CO: ${maxCo.toFixed(2)} mg/m³, O3: ${maxO3.toFixed(1)} µg/m³`);

    // Calculate sub-indices
    const pm25Index = calculateSubIndex(avgPm25, breakpoints.pm25);
    const pm10Index = calculateSubIndex(avgPm10, breakpoints.pm10);
    const no2Index = calculateSubIndex(avgNo2, breakpoints.no2);
    const so2Index = calculateSubIndex(avgSo2, breakpoints.so2);
    const coIndex = calculateSubIndex(maxCo, breakpoints.co);
    const o3Index = calculateSubIndex(maxO3, breakpoints.o3);

    console.log(`Sub-indices - PM2.5: ${pm25Index.toFixed(0)}, PM10: ${pm10Index.toFixed(0)}, NO2: ${no2Index.toFixed(0)}, SO2: ${so2Index.toFixed(0)}, CO: ${coIndex.toFixed(0)}, O3: ${o3Index.toFixed(0)}`);

    // Final AQI = max of all sub-indices
    const aqi = Math.round(Math.max(pm25Index, pm10Index, no2Index, so2Index, coIndex, o3Index));

    // Generate 24-hour history from actual data points
    const history24h = data.list.slice(-24).map((point: any, index: number) => {
      const timestamp = new Date(point.dt * 1000);
      const pointPm25 = point.components.pm2_5 || 0;
      const pointAqi = Math.round(calculateSubIndex(pointPm25, breakpoints.pm25));
      return {
        time: timestamp.toISOString(),
        aqi: pointAqi,
        label: timestamp.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };
    });

    const responseData = {
      city,
      aqi: Math.min(500, Math.max(0, aqi)),
      aqiCategory: getAQICategory(aqi),
      pollutants: {
        pm25: Math.round(avgPm25),
        pm10: Math.round(avgPm10),
        no2: Math.round(avgNo2),
        so2: Math.round(avgSo2),
        co: Number(maxCo.toFixed(1)),
        o3: Math.round(maxO3),
      },
      lastUpdated: new Date().toISOString(),
      history24h,
      dataPoints: data.list.length,
    };

    console.log(`Response for ${city}: AQI ${aqi} (${getAQICategory(aqi)}) from ${data.list.length} data points`);

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch AQI data";
    console.error("Error in get-aqi function:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
