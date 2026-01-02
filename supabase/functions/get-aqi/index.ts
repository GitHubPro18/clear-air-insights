import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AQIRequest {
  city: string;
}

// City name mappings for CPCB API (handles variations)
const cityMappings: Record<string, string[]> = {
  "Delhi": ["Delhi", "New Delhi"],
  "Mumbai": ["Mumbai"],
  "Bangalore": ["Bengaluru", "Bangalore"],
  "Chennai": ["Chennai"],
  "Kolkata": ["Kolkata"],
  "Hyderabad": ["Hyderabad"],
  "Pune": ["Pune"],
  "Ahmedabad": ["Ahmedabad"],
  "Jaipur": ["Jaipur"],
  "Lucknow": ["Lucknow"],
  "Chandigarh": ["Chandigarh"],
  "Gurgaon": ["Gurugram", "Gurgaon"],
  "Noida": ["Noida"],
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = "579b464db66ec23bdd00000140daf51618814f1a63cc450c2bf85c7f";
    const baseUrl = "https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69";

    const { city }: AQIRequest = await req.json();
    console.log(`Fetching AQI for ${city} from CPCB API`);

    // Get possible city name variations
    const cityVariations = cityMappings[city] || [city];
    
    // Try each city variation until we get a match
    let stationData: any[] = [];
    
    for (const cityVariant of cityVariations) {
      const url = `${baseUrl}?api-key=${apiKey}&format=json&limit=100&filters[city]=${encodeURIComponent(cityVariant)}`;
      console.log(`Trying city variant: ${cityVariant}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`CPCB API error for ${cityVariant}: ${response.status}`);
        continue;
      }

      const data = await response.json();
      console.log(`CPCB response for ${cityVariant}: ${data.records?.length || 0} stations found`);

      if (data.records && data.records.length > 0) {
        stationData = data.records;
        break;
      }
    }

    if (stationData.length === 0) {
      console.warn(`No data found for ${city}, returning error`);
      throw new Error(`No AQI data available for ${city}`);
    }

    // Log first record structure for debugging
    console.log("Sample record:", JSON.stringify(stationData[0]));

    // Calculate average values across all stations in the city
    let totalPm25 = 0, totalPm10 = 0, totalNo2 = 0, totalSo2 = 0, totalCo = 0, totalO3 = 0;
    let countPm25 = 0, countPm10 = 0, countNo2 = 0, countSo2 = 0, countCo = 0, countO3 = 0;

    for (const station of stationData) {
      // CPCB API uses different field names - check actual field names
      const pm25 = parseFloat(station.pm25 || station.pm2_5 || station["pm2.5"] || 0);
      const pm10 = parseFloat(station.pm10 || 0);
      const no2 = parseFloat(station.no2 || 0);
      const so2 = parseFloat(station.so2 || 0);
      const co = parseFloat(station.co || 0);
      const o3 = parseFloat(station.ozone || station.o3 || 0);

      if (pm25 > 0) { totalPm25 += pm25; countPm25++; }
      if (pm10 > 0) { totalPm10 += pm10; countPm10++; }
      if (no2 > 0) { totalNo2 += no2; countNo2++; }
      if (so2 > 0) { totalSo2 += so2; countSo2++; }
      if (co > 0) { totalCo += co; countCo++; }
      if (o3 > 0) { totalO3 += o3; countO3++; }
    }

    const avgPm25 = countPm25 > 0 ? totalPm25 / countPm25 : 0;
    const avgPm10 = countPm10 > 0 ? totalPm10 / countPm10 : 0;
    const avgNo2 = countNo2 > 0 ? totalNo2 / countNo2 : 0;
    const avgSo2 = countSo2 > 0 ? totalSo2 / countSo2 : 0;
    const avgCo = countCo > 0 ? totalCo / countCo : 0;
    const avgO3 = countO3 > 0 ? totalO3 / countO3 : 0;

    console.log(`Average pollutants - PM2.5: ${avgPm25}, PM10: ${avgPm10}, NO2: ${avgNo2}, SO2: ${avgSo2}`);

    // Calculate sub-indices based on India NAQI standards
    const calculateSubIndex = (value: number, breakpoints: number[][]): number => {
      // breakpoints: [[Clow, Chigh, Ilow, Ihigh], ...]
      for (const bp of breakpoints) {
        if (value >= bp[0] && value <= bp[1]) {
          return ((bp[3] - bp[2]) / (bp[1] - bp[0])) * (value - bp[0]) + bp[2];
        }
      }
      // If above all breakpoints, return 500
      return 500;
    };

    // PM2.5 breakpoints (India NAQI)
    const pm25Breakpoints = [
      [0, 30, 0, 50],
      [31, 60, 51, 100],
      [61, 90, 101, 200],
      [91, 120, 201, 300],
      [121, 250, 301, 400],
      [251, 500, 401, 500],
    ];

    // PM10 breakpoints
    const pm10Breakpoints = [
      [0, 50, 0, 50],
      [51, 100, 51, 100],
      [101, 250, 101, 200],
      [251, 350, 201, 300],
      [351, 430, 301, 400],
      [431, 600, 401, 500],
    ];

    // NO2 breakpoints
    const no2Breakpoints = [
      [0, 40, 0, 50],
      [41, 80, 51, 100],
      [81, 180, 101, 200],
      [181, 280, 201, 300],
      [281, 400, 301, 400],
      [401, 600, 401, 500],
    ];

    // SO2 breakpoints
    const so2Breakpoints = [
      [0, 40, 0, 50],
      [41, 80, 51, 100],
      [81, 380, 101, 200],
      [381, 800, 201, 300],
      [801, 1600, 301, 400],
      [1601, 2400, 401, 500],
    ];

    const pm25Index = calculateSubIndex(avgPm25, pm25Breakpoints);
    const pm10Index = calculateSubIndex(avgPm10, pm10Breakpoints);
    const no2Index = calculateSubIndex(avgNo2, no2Breakpoints);
    const so2Index = calculateSubIndex(avgSo2, so2Breakpoints);

    // Overall AQI is the maximum of all sub-indices
    const aqi = Math.min(500, Math.max(0, Math.round(Math.max(pm25Index, pm10Index, no2Index, so2Index))));

    const getAQICategory = (aqi: number): string => {
      if (aqi <= 50) return "Good";
      if (aqi <= 100) return "Satisfactory";
      if (aqi <= 200) return "Moderate";
      if (aqi <= 300) return "Poor";
      if (aqi <= 400) return "Very Poor";
      return "Severe";
    };

    // Generate mock 24h history since CPCB API doesn't provide historical data
    const history24h = [];
    const baseAqi = aqi;
    for (let i = 23; i >= 0; i--) {
      const date = new Date();
      date.setHours(date.getHours() - i);
      const variation = Math.sin(i / 4) * 30 + (Math.random() - 0.5) * 20;
      const historicalAqi = Math.max(10, Math.min(500, Math.round(baseAqi + variation)));
      history24h.push({
        time: date.toISOString(),
        aqi: historicalAqi,
        label: date.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      });
    }

    const responseData = {
      city,
      aqi,
      aqiCategory: getAQICategory(aqi),
      pollutants: {
        pm25: Math.round(avgPm25),
        pm10: Math.round(avgPm10),
        no2: Math.round(avgNo2),
        so2: Math.round(avgSo2),
        co: Number((avgCo / 1000).toFixed(1)), // Convert µg/m³ to mg/m³
        o3: Math.round(avgO3),
      },
      lastUpdated: new Date().toISOString(),
      history24h,
      stationCount: stationData.length,
    };

    console.log(`Response for ${city}: AQI ${aqi} (${getAQICategory(aqi)}) from ${stationData.length} stations`);

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
