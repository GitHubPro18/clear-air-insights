// Mock Phase 2 inputs and outputs for demonstration
export interface Phase2Input {
  budget: number;
  homeType: "room" | "1BHK" | "2BHK" | "others";
  timeIndoorsPerWeek: number;
  dailyCommuteMinutes: number;
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
  imageUrl?: string;
}

export interface Phase2Output {
  recommendedProducts: RecommendedProduct[];
  remainingBudget: number;
}

// Reason code to explanation mapping (static dictionary per PRD)
export const REASON_CODE_MAPPING: Record<string, string> = {
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

// Mock current AQI data
export const mockAQIData = {
  city: "Delhi",
  aqi: 245,
  pm25: 156,
  pm10: 289,
  no2: 78,
  so2: 24,
  category: "Very Unhealthy" as const,
  lastUpdated: new Date().toISOString(),
};

// Mock Phase 2 output
export const mockPhase2Output: Phase2Output = {
  recommendedProducts: [
    {
      productType: "HEPA Air Purifier",
      productName: "Dyson Purifier Cool TP07",
      priority: "High",
      affiliateLinks: [
        { retailer: "Amazon", url: "https://amazon.in/dp/example1", price: 44990 },
        { retailer: "Flipkart", url: "https://flipkart.com/example1", price: 45999 },
      ],
      reasonCodes: [
        "AQI_ABOVE_200",
        "HIGH_INDOOR_TIME",
        "SENSITIVE_GROUP_PRESENT",
        "BEST_PM25_REDUCTION_PER_RUPEE",
        "HIGH_CADR_RATING",
      ],
    },
    {
      productType: "N95 Mask Pack",
      productName: "3M 9504INV+ N95 (Pack of 25)",
      priority: "High",
      affiliateLinks: [
        { retailer: "Amazon", url: "https://amazon.in/dp/example2", price: 1499 },
        { retailer: "Flipkart", url: "https://flipkart.com/example2", price: 1599 },
      ],
      reasonCodes: [
        "AQI_ABOVE_200",
        "LONG_COMMUTE",
        "PORTABLE_PROTECTION",
        "BUDGET_OPTIMIZED",
      ],
    },
    {
      productType: "Car Air Purifier",
      productName: "Philips GoPure GP5212",
      priority: "Medium",
      affiliateLinks: [
        { retailer: "Amazon", url: "https://amazon.in/dp/example3", price: 7999 },
        { retailer: "Croma", url: "https://croma.com/example3", price: 8499 },
      ],
      reasonCodes: [
        "LONG_COMMUTE",
        "AQI_ABOVE_150",
        "BEST_PM25_REDUCTION_PER_RUPEE",
      ],
    },
    {
      productType: "Indoor Plants Bundle",
      productName: "Air Purifying Plants Set (5 plants)",
      priority: "Low",
      affiliateLinks: [
        { retailer: "Nursery Live", url: "https://nurserylive.com/example4", price: 1299 },
        { retailer: "Ugaoo", url: "https://ugaoo.com/example4", price: 1199 },
      ],
      reasonCodes: [
        "HIGH_INDOOR_TIME",
        "BUDGET_OPTIMIZED",
        "LARGE_COVERAGE_AREA",
      ],
    },
  ],
  remainingBudget: 4014,
};

// Mock user inputs that led to these recommendations
export const mockPhase2Input: Phase2Input = {
  budget: 60000,
  homeType: "2BHK",
  timeIndoorsPerWeek: 120,
  dailyCommuteMinutes: 90,
  sensitiveGroups: {
    ageUnder10: true,
    ageAbove60: false,
    pregnant: false,
    asthma: true,
  },
  aqi: 245,
  pm25: 156,
};
