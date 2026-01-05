import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
  co: [
    { cLow: 0, cHigh: 1.0, iLow: 0, iHigh: 50 },
    { cLow: 1.1, cHigh: 2.0, iLow: 51, iHigh: 100 },
    { cLow: 2.1, cHigh: 10, iLow: 101, iHigh: 200 },
    { cLow: 10.1, cHigh: 17, iLow: 201, iHigh: 300 },
    { cLow: 17.1, cHigh: 34, iLow: 301, iHigh: 400 },
    { cLow: 34.1, cHigh: 50, iLow: 401, iHigh: 500 },
  ],
  o3: [
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

// Get yesterday's date boundaries in IST (UTC+5:30)
const getYesterdayIST = (): { dateString: string; startUnix: number; endUnix: number } => {
  const now = new Date();
  
  // Get current time in IST
  const istOffset = 5.5 * 60 * 60 * 1000; // 5:30 in milliseconds
  const nowIST = new Date(now.getTime() + istOffset);
  
  // Get yesterday's date in IST
  const yesterdayIST = new Date(nowIST);
  yesterdayIST.setDate(yesterdayIST.getDate() - 1);
  
  // Format as YYYY-MM-DD
  const year = yesterdayIST.getUTCFullYear();
  const month = String(yesterdayIST.getUTCMonth() + 1).padStart(2, '0');
  const day = String(yesterdayIST.getUTCDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;
  
  // Calculate start (00:00 IST) and end (23:59:59 IST) as Unix timestamps
  // 00:00 IST = 18:30 UTC previous day
  const startUTC = new Date(Date.UTC(year, yesterdayIST.getUTCMonth(), yesterdayIST.getUTCDate(), 0, 0, 0));
  startUTC.setTime(startUTC.getTime() - istOffset);
  
  const endUTC = new Date(Date.UTC(year, yesterdayIST.getUTCMonth(), yesterdayIST.getUTCDate(), 23, 59, 59));
  endUTC.setTime(endUTC.getTime() - istOffset);
  
  return {
    dateString,
    startUnix: Math.floor(startUTC.getTime() / 1000),
    endUnix: Math.floor(endUTC.getTime() / 1000),
  };
};

interface CityAQIResult {
  city: string;
  date: string;
  aqi: number;
  category: string;
  dominant_pollutant: string;
  pm25_avg: number;
  pm10_avg: number;
  no2_avg: number;
  so2_avg: number;
  co_8hr_max: number;
  o3_8hr_max: number;
  computed_at: string;
  status: 'inserted' | 'exists' | 'error';
  error?: string;
}

async function computeAQIForCity(
  city: string,
  coords: { lat: number; lon: number },
  dateString: string,
  startUnix: number,
  endUnix: number,
  apiKey: string
): Promise<CityAQIResult> {
  const baseResult = {
    city,
    date: dateString,
    computed_at: new Date().toISOString(),
  };

  try {
    const url = `http://api.openweathermap.org/data/2.5/air_pollution/history?lat=${coords.lat}&lon=${coords.lon}&start=${startUnix}&end=${endUnix}&appid=${apiKey}`;
    console.log(`Fetching ${city} from: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`${city}: Received ${data.list?.length || 0} data points`);

    if (!data.list || data.list.length === 0) {
      throw new Error(`No data available for ${city}`);
    }

    // Extract pollutant values
    const pm25Values: number[] = [];
    const pm10Values: number[] = [];
    const no2Values: number[] = [];
    const so2Values: number[] = [];
    const coValues: number[] = [];
    const o3Values: number[] = [];

    for (const point of data.list) {
      const c = point.components;
      if (c.pm2_5 != null) pm25Values.push(c.pm2_5);
      if (c.pm10 != null) pm10Values.push(c.pm10);
      if (c.no2 != null) no2Values.push(c.no2);
      if (c.so2 != null) so2Values.push(c.so2);
      if (c.co != null) coValues.push(c.co / 1000); // µg/m³ to mg/m³
      if (c.o3 != null) o3Values.push(c.o3);
    }

    // Calculate 24-hour averages
    const avgPm25 = pm25Values.length > 0 ? pm25Values.reduce((a, b) => a + b, 0) / pm25Values.length : 0;
    const avgPm10 = pm10Values.length > 0 ? pm10Values.reduce((a, b) => a + b, 0) / pm10Values.length : 0;
    const avgNo2 = no2Values.length > 0 ? no2Values.reduce((a, b) => a + b, 0) / no2Values.length : 0;
    const avgSo2 = so2Values.length > 0 ? so2Values.reduce((a, b) => a + b, 0) / so2Values.length : 0;

    // Calculate 8-hour max rolling average
    const maxCo = coValues.length > 0 ? calculate8HourMaxAvg(coValues) : 0;
    const maxO3 = o3Values.length > 0 ? calculate8HourMaxAvg(o3Values) : 0;

    // Calculate sub-indices
    const subIndices = {
      pm25: calculateSubIndex(avgPm25, breakpoints.pm25),
      pm10: calculateSubIndex(avgPm10, breakpoints.pm10),
      no2: calculateSubIndex(avgNo2, breakpoints.no2),
      so2: calculateSubIndex(avgSo2, breakpoints.so2),
      co: calculateSubIndex(maxCo, breakpoints.co),
      o3: calculateSubIndex(maxO3, breakpoints.o3),
    };

    // Find dominant pollutant
    const maxSubIndex = Math.max(...Object.values(subIndices));
    const dominantPollutant = Object.entries(subIndices)
      .find(([, value]) => value === maxSubIndex)?.[0] || 'pm25';

    const aqi = Math.round(Math.min(500, Math.max(0, maxSubIndex)));

    return {
      ...baseResult,
      aqi,
      category: getAQICategory(aqi),
      dominant_pollutant: dominantPollutant.toUpperCase(),
      pm25_avg: Number(avgPm25.toFixed(2)),
      pm10_avg: Number(avgPm10.toFixed(2)),
      no2_avg: Number(avgNo2.toFixed(2)),
      so2_avg: Number(avgSo2.toFixed(2)),
      co_8hr_max: Number(maxCo.toFixed(3)),
      o3_8hr_max: Number(maxO3.toFixed(2)),
      status: 'inserted' as const,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error computing AQI for ${city}:`, errorMessage);
    return {
      ...baseResult,
      aqi: 0,
      category: 'Unknown',
      dominant_pollutant: 'N/A',
      pm25_avg: 0,
      pm10_avg: 0,
      no2_avg: 0,
      so2_avg: 0,
      co_8hr_max: 0,
      o3_8hr_max: 0,
      status: 'error' as const,
      error: errorMessage,
    };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = "ea06d1808cc8137f1a4fc89b3be53737";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { dateString, startUnix, endUnix } = getYesterdayIST();
    console.log(`Computing daily AQI for ${dateString} (IST)`);
    console.log(`Time range: ${new Date(startUnix * 1000).toISOString()} to ${new Date(endUnix * 1000).toISOString()}`);

    const results: CityAQIResult[] = [];

    for (const [city, coords] of Object.entries(cityCoordinates)) {
      // Check if data already exists for this city and date
      const { data: existing } = await supabase
        .from('aqi_values_daily')
        .select('id')
        .eq('city', city)
        .eq('date', dateString)
        .maybeSingle();

      if (existing) {
        console.log(`${city}: Data for ${dateString} already exists, skipping`);
        results.push({
          city,
          date: dateString,
          aqi: 0,
          category: '',
          dominant_pollutant: '',
          pm25_avg: 0,
          pm10_avg: 0,
          no2_avg: 0,
          so2_avg: 0,
          co_8hr_max: 0,
          o3_8hr_max: 0,
          computed_at: new Date().toISOString(),
          status: 'exists',
        });
        continue;
      }

      // Compute AQI for this city
      const cityResult = await computeAQIForCity(city, coords, dateString, startUnix, endUnix, apiKey);

      if (cityResult.status !== 'error') {
        // Insert into database
        const { error: insertError } = await supabase
          .from('aqi_values_daily')
          .insert({
            city: cityResult.city,
            date: cityResult.date,
            aqi: cityResult.aqi,
            category: cityResult.category,
            dominant_pollutant: cityResult.dominant_pollutant,
            pm25_avg: cityResult.pm25_avg,
            pm10_avg: cityResult.pm10_avg,
            no2_avg: cityResult.no2_avg,
            so2_avg: cityResult.so2_avg,
            co_8hr_max: cityResult.co_8hr_max,
            o3_8hr_max: cityResult.o3_8hr_max,
            computed_at: cityResult.computed_at,
          });

        if (insertError) {
          console.error(`Error inserting ${city}:`, insertError.message);
          cityResult.status = 'error';
          cityResult.error = insertError.message;
        } else {
          console.log(`${city}: Inserted AQI ${cityResult.aqi} (${cityResult.category})`);
        }
      }

      results.push(cityResult);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const summary = {
      date: dateString,
      total_cities: results.length,
      inserted: results.filter(r => r.status === 'inserted').length,
      already_exists: results.filter(r => r.status === 'exists').length,
      errors: results.filter(r => r.status === 'error').length,
      results,
    };

    console.log(`Completed: ${summary.inserted} inserted, ${summary.already_exists} existing, ${summary.errors} errors`);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to compute daily AQI";
    console.error("Error in compute-daily-aqi function:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
