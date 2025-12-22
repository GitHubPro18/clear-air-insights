import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import AQISummaryCard from "@/components/AQISummaryCard";
import PollutantBreakdown from "@/components/PollutantBreakdown";
import HealthImpactSection from "@/components/HealthImpactSection";
import CitySelector from "@/components/CitySelector";
import AQITrendChart from "@/components/AQITrendChart";
import { getMockAQIData, fetchLiveAQIData, AQIData, AQI_CATEGORIES } from "@/data/aqiData";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Dashboard = () => {
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveData, setIsLiveData] = useState(false);

  const fetchAQIData = async (city: string) => {
    setIsLoading(true);
    try {
      const data = await fetchLiveAQIData(city);
      setAqiData(data);
      setIsLiveData(true);
      toast.success(`Live AQI data loaded for ${city}`);
    } catch (error) {
      console.error('Failed to fetch live data, falling back to mock:', error);
      const data = getMockAQIData(city);
      setAqiData(data);
      setIsLiveData(false);
      toast.info('Using simulated data - live API unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAQIData(selectedCity);
  }, [selectedCity]);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const handleRefresh = () => {
    fetchAQIData(selectedCity);
  };

  return (
    <>
      <Helmet>
        <title>AQI Dashboard - Air Quality Monitoring | AQI Protection Planner</title>
        <meta name="description" content="Monitor real-time air quality index (AQI) and pollutant levels for major Indian cities. Understand health impacts and stay informed about air pollution." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Main Content */}
        <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-up">
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-2">
              Air Quality Dashboard
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              Real-time air quality monitoring for India
              {isLiveData ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-500 font-medium">
                  <Wifi className="w-3 h-3" /> Live
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
                  <WifiOff className="w-3 h-3" /> Simulated
                </span>
              )}
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 animate-fade-up stagger-1">
            <CitySelector selectedCity={selectedCity} onCityChange={handleCityChange} />
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* AQI Category Legend */}
          <div className="mb-8 p-4 rounded-xl bg-card border border-border shadow-soft animate-fade-up stagger-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">AQI Scale (India Standards)</h3>
            <div className="flex flex-wrap gap-2">
              {AQI_CATEGORIES.map((cat) => (
                <div
                  key={cat.label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xs font-medium text-foreground">{cat.label}</span>
                  <span className="text-xs text-muted-foreground">({cat.min}-{cat.max})</span>
                </div>
              ))}
            </div>
          </div>

          {aqiData && (
            <div className="space-y-8">
              {/* AQI Summary */}
              <div className="animate-fade-up stagger-3">
                <AQISummaryCard data={aqiData} />
              </div>

              {/* AQI Trend Chart */}
              <div className="animate-fade-up stagger-4">
                <AQITrendChart city={selectedCity} history24h={aqiData.history24h} />
              </div>

              {/* Two Column Layout */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
                  <PollutantBreakdown data={aqiData} />
                </div>
                <div className="animate-fade-up" style={{ animationDelay: '0.5s' }}>
                  <HealthImpactSection data={aqiData} />
                </div>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Air quality information is provided for general awareness only and does not constitute medical advice.
            </p>
          </footer>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
