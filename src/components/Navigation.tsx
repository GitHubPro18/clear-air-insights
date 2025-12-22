import { NavLink } from "@/components/NavLink";
import { Wind, ShieldCheck } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation Links */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                <Wind className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-semibold text-foreground">
                AQI Planner
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <NavLink
                to="/dashboard"
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
                activeClassName="text-primary bg-primary/10 hover:bg-primary/15"
              >
                <span className="flex items-center gap-2">
                  <Wind className="w-4 h-4" />
                  AQI Dashboard
                </span>
              </NavLink>
              
              <NavLink
                to="/"
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
                activeClassName="text-primary bg-primary/10 hover:bg-primary/15"
                end
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Protection Planner
                </span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
