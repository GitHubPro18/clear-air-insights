import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import AQISummaryCard from "@/components/AQISummaryCard";
import PollutantBreakdown from "@/components/PollutantBreakdown";
import HealthImpactSection from "@/components/HealthImpactSection";
import CitySelector from "@/components/CitySelector";
import { getMockAQIData, AQIData, AQI_CATEGORIES, getAQICategory } from "@/data/aqiData";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAQIData = (city: string) => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const data = getMockAQIData(city);
      setAqiData(data);
      setIsLoading(false);
    }, 500);
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
            <p className="text-muted-foreground">
              Real-time air quality monitoring for India
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

              {/* Two Column Layout */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="animate-fade-up stagger-4">
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
