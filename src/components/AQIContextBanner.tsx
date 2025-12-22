import { useAQI } from "@/contexts/AQIContext";
import { MapPin, Wind, Clock, Wifi, WifiOff } from "lucide-react";
import { Link } from "react-router-dom";

export function AQIContextBanner() {
  const { sharedAQIData } = useAQI();

  if (!sharedAQIData) {
    return (
      <div className="mb-6 p-4 rounded-xl border border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wind className="w-4 h-4" />
            <span className="text-sm">No air quality data available</span>
          </div>
          <Link 
            to="/dashboard" 
            className="text-sm font-medium text-primary hover:underline"
          >
            Go to Dashboard →
          </Link>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Visit the AQI Dashboard first to load current air quality data for your city.
        </p>
      </div>
    );
  }

  const { city, aqi, pollutants, lastUpdated, isLiveData } = sharedAQIData;
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "text-emerald-500";
    if (aqi <= 100) return "text-yellow-500";
    if (aqi <= 200) return "text-orange-500";
    if (aqi <= 300) return "text-red-500";
    return "text-purple-500";
  };

  return (
    <div className="mb-6 p-4 rounded-xl border border-border bg-gradient-to-r from-primary/5 to-transparent">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="font-medium text-foreground">{city}</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            {isLiveData ? (
              <Wifi className="w-3 h-3 text-emerald-500" />
            ) : (
              <WifiOff className="w-3 h-3 text-muted-foreground" />
            )}
            <span className="text-xs text-muted-foreground">
              {isLiveData ? "Live" : "Simulated"}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Updated {formatTime(lastUpdated)}</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">AQI:</span>
          <span className={`font-bold ${getAQIColor(aqi)}`}>{aqi}</span>
        </div>
        <div className="h-4 w-px bg-border hidden sm:block" />
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="text-muted-foreground">
            PM2.5: <span className="font-medium text-foreground">{pollutants.pm25} µg/m³</span>
          </span>
          <span className="text-muted-foreground">
            PM10: <span className="font-medium text-foreground">{pollutants.pm10} µg/m³</span>
          </span>
          <span className="text-muted-foreground">
            NO₂: <span className="font-medium text-foreground">{pollutants.no2} µg/m³</span>
          </span>
          <span className="text-muted-foreground">
            SO₂: <span className="font-medium text-foreground">{pollutants.so2} µg/m³</span>
          </span>
        </div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Air quality data auto-fetched from the Dashboard. <Link to="/dashboard" className="text-primary hover:underline">Change city →</Link>
      </p>
    </div>
  );
}
