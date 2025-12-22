import { Wind, MapPin, Clock } from "lucide-react";
import { useAQI } from "@/contexts/AQIContext";
import { Link } from "react-router-dom";

const getAQIGradient = (aqi: number) => {
  if (aqi <= 50) return "from-aqi-good to-emerald-400";
  if (aqi <= 100) return "from-aqi-moderate to-yellow-400";
  if (aqi <= 200) return "from-aqi-unhealthy to-orange-500";
  return "from-aqi-hazardous to-red-600";
};

const getAQILabel = (aqi: number) => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
};

export const AQIHeader = () => {
  const { sharedAQIData } = useAQI();
  
  // Fallback values when no data from dashboard
  const city = sharedAQIData?.city ?? "—";
  const aqi = sharedAQIData?.aqi ?? 0;
  const pm25 = sharedAQIData?.pollutants.pm25 ?? 0;
  const pm10 = sharedAQIData?.pollutants.pm10 ?? 0;
  const no2 = sharedAQIData?.pollutants.no2 ?? 0;
  const so2 = sharedAQIData?.pollutants.so2 ?? 0;
  const lastUpdated = sharedAQIData?.lastUpdated ?? new Date();
  
  const formattedTime = new Date(lastUpdated).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const hasData = sharedAQIData !== null;

  return (
    <header className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-primary-foreground/5 rounded-full blur-2xl" />

      <div className="relative container py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          {/* Left side - Title and location */}
          <div className="animate-fade-up">
            <div className="flex items-center gap-2 text-primary-foreground/80 mb-3">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{city}</span>
              {!hasData && (
                <Link to="/dashboard" className="text-xs underline ml-2">
                  Load data from Dashboard
                </Link>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary-foreground mb-2">
              AQI Protection
              <span className="block text-primary-foreground/90">Planner</span>
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-md">
              Personalized recommendations to protect you and your family from air pollution
            </p>
          </div>

          {/* Right side - AQI display */}
          <div className="animate-fade-up stagger-2">
            <div className="glass rounded-2xl p-6 shadow-elevated">
              {hasData ? (
                <div className="flex items-center gap-6">
                  {/* Main AQI circle */}
                  <div className={`relative w-28 h-28 rounded-full bg-gradient-to-br ${getAQIGradient(aqi)} flex items-center justify-center shadow-lg`}>
                    <div className="text-center">
                      <span className="block text-3xl font-bold text-primary-foreground">{aqi}</span>
                      <span className="text-xs text-primary-foreground/80 font-medium">AQI</span>
                    </div>
                  </div>

                  {/* Pollutant details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">{getAQILabel(aqi)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <div className="text-muted-foreground">PM2.5: <span className="text-foreground font-medium">{pm25}</span></div>
                      <div className="text-muted-foreground">PM10: <span className="text-foreground font-medium">{pm10}</span></div>
                      <div className="text-muted-foreground">NO₂: <span className="text-foreground font-medium">{no2}</span></div>
                      <div className="text-muted-foreground">SO₂: <span className="text-foreground font-medium">{so2}</span></div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                      <Clock className="w-3 h-3" />
                      <span>Updated {formattedTime}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 px-6">
                  <Wind className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No AQI data loaded</p>
                  <Link 
                    to="/dashboard" 
                    className="text-sm text-primary font-medium hover:underline mt-1 inline-block"
                  >
                    Visit Dashboard →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
