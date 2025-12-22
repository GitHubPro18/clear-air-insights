// Mock Phase 2 inputs and outputs for demonstration
export interface Phase2Input {
  budget: number;
  homeType: "room" | "1BHK" | "2BHK" | "3BHK" | "bungalow & villa" | "others";
  timeIndoorsPerWeek: number;
  dailyCommuteHoursOnAverage: number;
  sensitiveGroups: {
    ageUnder10: boolean;
    ageAbove60: boolean;
    pregnant: boolean;
    asthma: boolean;
  };
  aqi: number;
  pm25: number;
}

export interface AffiliateLink {
  retailer: string;
  url: string;
  price: number;
}

export interface RecommendedProduct {
  productType: string;
  productName: string;
  priority: "High" | "Medium" | "Low";
  affiliateLinks: AffiliateLink[];
  reasonCodes: string[];
}

export interface Phase2Output {
  recommendedProducts: RecommendedProduct[];
  remainingBudget: number;
}

// Reason code to explanation mapping (static dictionary per PRD)
export const REASON_CODE_MAPPING: Record<string, string> = {
  "AQI_ABOVE_300": "Air quality is hazardous — immediate protection required",
  "AQI_ABOVE_200": "Air quality in your city is currently poor",
  "AQI_ABOVE_150": "Air quality is unhealthy for sensitive groups",
  "AQI_ABOVE_100": "Air quality is moderate with some pollutants present",
  "HIGH_INDOOR_TIME": "You spend a large portion of your week indoors",
  "MODERATE_INDOOR_TIME": "You spend moderate time indoors",
  "SENSITIVE_GROUP_PRESENT": "A sensitive group is present in your household",
  "CHILD_PRESENT": "Children under 10 are more vulnerable to air pollution",
  "ELDERLY_PRESENT": "Adults over 60 benefit from additional air protection",
  "PREGNANCY_PRESENT": "Air quality protection is important during pregnancy",
  "RESPIRATORY_CONDITION": "Pre-existing respiratory conditions require extra protection",
  "BEST_PM25_REDUCTION_PER_RUPEE": "This option provides the highest PM2.5 protection within your budget",
  "HIGH_CADR_RATING": "High Clean Air Delivery Rate for effective filtration",
  "LONG_COMMUTE": "Extended daily commute increases pollution exposure",
  "MODERATE_COMMUTE": "Regular commute benefits from portable protection",
  "BUDGET_OPTIMIZED": "Selected to maximize value within your budget",
  "LARGE_COVERAGE_AREA": "Suitable coverage for your home size",
  "PORTABLE_PROTECTION": "Provides protection while traveling or commuting",
};

// Note: AQI data is now sourced from the shared AQI Context (populated by the Dashboard).
// The mockAQIData export is removed - use useAQI() hook from @/contexts/AQIContext instead.

// Default inputs for the form
export const DEFAULT_INPUT: Phase2Input = {
  budget: 15000,
  homeType: "2BHK",
  timeIndoorsPerWeek: 120,
  dailyCommuteHoursOnAverage: 2,
  sensitiveGroups: {
    ageUnder10: false,
    ageAbove60: false,
    pregnant: false,
    asthma: false,
  },
  aqi: 245,
  pm25: 156,
};
