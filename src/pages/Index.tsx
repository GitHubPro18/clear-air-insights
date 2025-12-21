import { AQIHeader } from "@/components/AQIHeader";
import { UserInputsSummary } from "@/components/UserInputsSummary";
import { RecommendationsList } from "@/components/RecommendationsList";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* SEO Meta handled by index.html */}
      
      {/* Hero Header with AQI Display */}
      <AQIHeader />

      {/* User Profile Summary */}
      <UserInputsSummary />

      {/* Main Recommendations */}
      <main>
        <RecommendationsList />
      </main>

      {/* Footer */}
      <footer className="container py-8 border-t border-border/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2024 AQI Protection Planner. Built with care for cleaner air.</p>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-secondary/50 px-3 py-1 rounded-full">
              Phase 3: Explainability Layer
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
