import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AQIRequest {
  lat: number;
  lon: number;
  city: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('OPENWEATHERMAP_API_KEY');
    
    if (!apiKey) {
      console.error('OPENWEATHERMAP_API_KEY not configured');
      throw new Error('API key not configured');
    }

    const { lat, lon, city }: AQIRequest = await req.json();
    
    console.log(`Fetching AQI for ${city} at lat: ${lat}, lon: ${lon}`);

    // Fetch current air pollution data
    const currentUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const currentResponse = await fetch(currentUrl);
    
    if (!currentResponse.ok) {
      console.error(`OpenWeatherMap API error: ${currentResponse.status}`);
      throw new Error(`API request failed: ${currentResponse.status}`);
    }

    const currentData = await currentResponse.json();
    console.log('Current AQI data received:', JSON.stringify(currentData));

    // Fetch historical data (last 24 hours)
    const now = Math.floor(Date.now() / 1000);
    const yesterday = now - (24 * 60 * 60);
    const historyUrl = `https://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&start=${yesterday}&end=${now}&appid=${apiKey}`;
    const historyResponse = await fetch(historyUrl);
    
    let historyData = { list: [] };
    if (historyResponse.ok) {
      historyData = await historyResponse.json();
      console.log(`Historical data received: ${historyData.list?.length || 0} points`);
    } else {
      console.warn('Failed to fetch historical data, continuing with current data only');
    }

    // OpenWeatherMap AQI is 1-5 scale, we need to convert to India AQI scale (0-500)
    // OWM: 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
    const owmToIndiaAQI = (owmAQI: number, components: any): number => {
      // Calculate sub-indices based on pollutant concentrations (India NAQI standards)
      const pm25 = components.pm2_5 || 0;
      const pm10 = components.pm10 || 0;
      const no2 = components.no2 || 0;
      const so2 = components.so2 || 0;
      const co = components.co || 0;
      const o3 = components.o3 || 0;

      // PM2.5 sub-index (India standards)
      const pm25Index = pm25 <= 30 ? (pm25 / 30) * 50 :
                        pm25 <= 60 ? 50 + ((pm25 - 30) / 30) * 50 :
                        pm25 <= 90 ? 100 + ((pm25 - 60) / 30) * 100 :
                        pm25 <= 120 ? 200 + ((pm25 - 90) / 30) * 100 :
                        pm25 <= 250 ? 300 + ((pm25 - 120) / 130) * 100 :
                        400 + ((pm25 - 250) / 130) * 100;

      // PM10 sub-index
      const pm10Index = pm10 <= 50 ? (pm10 / 50) * 50 :
                        pm10 <= 100 ? 50 + ((pm10 - 50) / 50) * 50 :
                        pm10 <= 250 ? 100 + ((pm10 - 100) / 150) * 100 :
                        pm10 <= 350 ? 200 + ((pm10 - 250) / 100) * 100 :
                        pm10 <= 430 ? 300 + ((pm10 - 350) / 80) * 100 :
                        400 + ((pm10 - 430) / 80) * 100;

      // NO2 sub-index
      const no2Index = no2 <= 40 ? (no2 / 40) * 50 :
                       no2 <= 80 ? 50 + ((no2 - 40) / 40) * 50 :
                       no2 <= 180 ? 100 + ((no2 - 80) / 100) * 100 :
                       no2 <= 280 ? 200 + ((no2 - 180) / 100) * 100 :
                       no2 <= 400 ? 300 + ((no2 - 280) / 120) * 100 :
                       400 + ((no2 - 400) / 120) * 100;

      // Return the maximum sub-index as the overall AQI
      const aqi = Math.max(pm25Index, pm10Index, no2Index);
      return Math.min(500, Math.max(0, Math.round(aqi)));
    };

    const getAQICategory = (aqi: number): string => {
      if (aqi <= 50) return "Good";
      if (aqi <= 100) return "Satisfactory";
      if (aqi <= 200) return "Moderate";
      if (aqi <= 300) return "Poor";
      if (aqi <= 400) return "Very Poor";
      return "Severe";
    };

    // Process current data
    const current = currentData.list?.[0];
    if (!current) {
      throw new Error('No AQI data available');
    }

    const components = current.components;
    const indiaAQI = owmToIndiaAQI(current.main.aqi, components);

    // Process historical data for trend chart
    const history24h = historyData.list?.map((item: any) => ({
      time: new Date(item.dt * 1000).toISOString(),
      aqi: owmToIndiaAQI(item.main.aqi, item.components),
      label: new Date(item.dt * 1000).toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      }),
    })) || [];

    // Sample to ~24 points for 24h view (one per hour)
    const sampledHistory = history24h.filter((_: any, index: number) => index % Math.max(1, Math.floor(history24h.length / 24)) === 0);

    const responseData = {
      city,
      aqi: indiaAQI,
      aqiCategory: getAQICategory(indiaAQI),
      pollutants: {
        pm25: Math.round(components.pm2_5 || 0),
        pm10: Math.round(components.pm10 || 0),
        no2: Math.round(components.no2 || 0),
        so2: Math.round(components.so2 || 0),
        co: Number((components.co / 1000 || 0).toFixed(1)), // Convert to mg/m³
        o3: Math.round(components.o3 || 0),
      },
      lastUpdated: new Date().toISOString(),
      history24h: sampledHistory,
    };

    console.log(`Response for ${city}: AQI ${indiaAQI} (${getAQICategory(indiaAQI)})`);

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch AQI data';
    console.error('Error in get-aqi function:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
