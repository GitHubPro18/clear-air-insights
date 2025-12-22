import { useState } from "react";
import Navigation from "@/components/Navigation";
import { AQIHeader } from "@/components/AQIHeader";
import { AQIContextBanner } from "@/components/AQIContextBanner";
import { UserInputForm } from "@/components/UserInputForm";
import { RecommendationResults } from "@/components/RecommendationResults";
import { generateRecommendations, RecommendationInput, RecommendationOutput } from "@/lib/recommendationEngine";
import { useAQI } from "@/contexts/AQIContext";
import type { HomeType } from "@/data/productCatalog";

interface SensitiveGroups {
  ageUnder10: boolean;
  ageAbove60: boolean;
  pregnant: boolean;
  asthma: boolean;
}

const Index = () => {
  const [results, setResults] = useState<RecommendationOutput | null>(null);
  const [currentBudget, setCurrentBudget] = useState(15000);
  const [isLoading, setIsLoading] = useState(false);
  
  const { sharedAQIData } = useAQI();

  const handleFormSubmit = (data: {
    budget: number;
    homeType: HomeType;
    timeIndoorsPerWeek: number;
    dailyCommuteHoursOnAverage: number;
    sensitiveGroups: SensitiveGroups;
  }) => {
    // Use shared AQI data from context, fallback to defaults if not available
    const aqi = sharedAQIData?.aqi ?? 150;
    const pm25 = sharedAQIData?.pollutants.pm25 ?? 80;

    setIsLoading(true);
    setCurrentBudget(data.budget);

    // Simulate slight delay for better UX
    setTimeout(() => {
      const input: RecommendationInput = {
        ...data,
        aqi,
        pm25,
      };

      const recommendations = generateRecommendations(input);
      setResults(recommendations);
      setIsLoading(false);

      // Scroll to results
      document.getElementById("results-section")?.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Header with AQI Display */}
      <div className="pt-16">
        <AQIHeader />
      </div>

      {/* Main Content */}
      <main className="container py-8 md:py-12">
        {/* AQI Context Banner - Shows data from Dashboard */}
        <AQIContextBanner />
        
        <div className="grid gap-8 lg:grid-cols-[400px,1fr] lg:items-start">
          {/* Input Form - Sticky on desktop */}
          <div className="lg:sticky lg:top-8">
            <UserInputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>

          {/* Results Section */}
          <div id="results-section">
            {results ? (
              <RecommendationResults results={results} budget={currentBudget} />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 rounded-2xl border border-dashed border-border/50 bg-muted/20">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <svg
                    className="w-10 h-10 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                  Ready to Protect Your Air
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Fill in your details on the left and we'll generate personalized 
                  recommendations to protect you and your family from air pollution.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container py-8 border-t border-border/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2024 AQI Protection Planner. Built with care for cleaner air.</p>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
              Phase 2 + 3: Recommendations + Explainability
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
