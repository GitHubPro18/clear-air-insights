// Product Catalog per PRD Section 6
// Each product type is represented as a class, not a brand

export type HomeType = "room" | "1BHK" | "2BHK" | "3BHK" | "bungalow & villa" | "others";
export type ProductCategory = "personal" | "indoor" | "supplementary";
export type Priority = "High" | "Medium" | "Low";

export interface ProductDefinition {
  id: string;
  name: string;
  category: ProductCategory;
  minAQI: number;
  baseCost: number;
  effectivenessScore: number; // 0-1 relative score
  applicableHomeTypes: HomeType[];
  priorityBoostForSensitive: boolean;
  description: string;
  isMandatoryAtAQI?: number; // If AQI >= this, product is mandatory
  isChildVariant?: boolean;
}

export interface AffiliateOption {
  retailer: string;
  url: string;
  price: number;
  productName: string;
}

export interface ProductWithAffiliates extends ProductDefinition {
  affiliateOptions: AffiliateOption[];
}

// Product catalog with affiliate options
export const PRODUCT_CATALOG: ProductWithAffiliates[] = [
  // ============ PERSONAL PROTECTION ============
  {
    id: "reusable_n95",
    name: "Reusable N95/KN95 Mask",
    category: "personal",
    minAQI: 150,
    baseCost: 350,
    effectivenessScore: 0.85,
    applicableHomeTypes: ["room", "1BHK", "2BHK", "3BHK", "bungalow & villa", "others"],
    priorityBoostForSensitive: true,
    description: "Washable N95-equivalent mask with replaceable filters",
    isMandatoryAtAQI: 300,
    affiliateOptions: [
      { retailer: "Amazon", url: "https://amazon.in/dp/B08N5FGQM3", price: 399, productName: "Honeywell Dual Valve N95 Mask" },
      { retailer: "Flipkart", url: "https://flipkart.com/p/n95-reusable", price: 349, productName: "Venus V-4400 N95 Mask" },
    ],
  },
  {
    id: "disposable_n95_pack",
    name: "Disposable N95 Masks (Pack of 10)",
    category: "personal",
    minAQI: 150,
    baseCost: 500,
    effectivenessScore: 0.80,
    applicableHomeTypes: ["room", "1BHK", "2BHK", "3BHK", "bungalow & villa", "others"],
    priorityBoostForSensitive: true,
    description: "Single-use N95 masks for high pollution days",
    isMandatoryAtAQI: 300,
    affiliateOptions: [
      { retailer: "Amazon", url: "https://amazon.in/dp/B08CDPF9WR", price: 549, productName: "3M 9504INV+ N95 (Pack of 10)" },
      { retailer: "Flipkart", url: "https://flipkart.com/p/n95-disposable", price: 499, productName: "Venus N95 Disposable (Pack of 10)" },
    ],
  },
  {
    id: "child_mask",
    name: "Child-Sized N95/KN95 Mask",
    category: "personal",
    minAQI: 100,
    baseCost: 250,
    effectivenessScore: 0.75,
    applicableHomeTypes: ["room", "1BHK", "2BHK", "3BHK", "bungalow & villa", "others"],
    priorityBoostForSensitive: true,
    description: "Properly fitted masks for children under 10",
    isChildVariant: true,
    affiliateOptions: [
      { retailer: "Amazon", url: "https://amazon.in/dp/B09CHILD01", price: 299, productName: "Honeywell Kids N95 Mask" },
      { retailer: "FirstCry", url: "https://firstcry.com/p/kids-n95", price: 249, productName: "Cambridge Mask Kids" },
    ],
  },

  // ============ INDOOR AIR CONTROL ============
  {
    id: "hepa_purifier_room",
    name: "HEPA Air Purifier (Room)",
    category: "indoor",
    minAQI: 150,
    baseCost: 5000,
    effectivenessScore: 0.70,
    applicableHomeTypes: ["room", "1BHK"],
    priorityBoostForSensitive: true,
    description: "Compact HEPA purifier for single room coverage (~200 sq ft)",
    affiliateOptions: [
      { retailer: "Amazon", url: "https://amazon.in/dp/B07ROOM01", price: 5499, productName: "Mi Air Purifier 3" },
      { retailer: "Flipkart", url: "https://flipkart.com/p/hepa-room", price: 4999, productName: "Philips AC0820" },
    ],
  },
  {
    id: "hepa_purifier_home",
    name: "HEPA Air Purifier (Home)",
    category: "indoor",
    minAQI: 200,
    baseCost: 12000,
    effectivenessScore: 0.85,
    applicableHomeTypes: ["2BHK", "3BHK", "bungalow & villa", "others"],
    priorityBoostForSensitive: true,
    description: "High-capacity HEPA purifier for larger spaces (~500 sq ft)",
    affiliateOptions: [
      { retailer: "Amazon", url: "https://amazon.in/dp/B07HOME01", price: 12990, productName: "Dyson Pure Cool TP07" },
      { retailer: "Croma", url: "https://croma.com/p/hepa-home", price: 11999, productName: "Philips AC2887" },
    ],
  },
  {
    id: "portable_purifier",
    name: "Portable Single-Room Purifier",
    category: "indoor",
    minAQI: 100,
    baseCost: 3000,
    effectivenessScore: 0.50,
    applicableHomeTypes: ["room", "1BHK", "2BHK", "3BHK", "bungalow & villa", "others"],
    priorityBoostForSensitive: false,
    description: "Lightweight, portable purifier for desk or bedside",
    affiliateOptions: [
      { retailer: "Amazon", url: "https://amazon.in/dp/B07PORT01", price: 3499, productName: "Xiaomi Smart Air Purifier 4 Lite" },
      { retailer: "Flipkart", url: "https://flipkart.com/p/portable-purifier", price: 2999, productName: "Honeywell Move Pure" },
    ],
  },
  {
    id: "activated_carbon_bags",
    name: "Activated Carbon/Charcoal Bags (Set of 4)",
    category: "indoor",
    minAQI: 50,
    baseCost: 400,
    effectivenessScore: 0.20,
    applicableHomeTypes: ["room", "1BHK", "2BHK", "3BHK", "bungalow & villa", "others"],
    priorityBoostForSensitive: false,
    description: "Supplementary odor and VOC absorption",
    affiliateOptions: [
      { retailer: "Amazon", url: "https://amazon.in/dp/B07CARB01", price: 449, productName: "Moso Natural Charcoal Bags" },
      { retailer: "Flipkart", url: "https://flipkart.com/p/carbon-bags", price: 399, productName: "Amazon Basics Charcoal Bags" },
    ],
  },
  {
    id: "door_window_sealing",
    name: "Door & Window Sealing Strips Kit",
    category: "indoor",
    minAQI: 100,
    baseCost: 600,
    effectivenessScore: 0.35,
    applicableHomeTypes: ["room", "1BHK", "2BHK", "3BHK", "bungalow & villa", "others"],
    priorityBoostForSensitive: false,
    description: "Self-adhesive foam strips to reduce air leakage",
    affiliateOptions: [
      { retailer: "Amazon", url: "https://amazon.in/dp/B07SEAL01", price: 649, productName: "3M Weather Sealing Strip" },
      { retailer: "Flipkart", url: "https://flipkart.com/p/sealing-strips", price: 599, productName: "Duck Brand Seal Strip" },
    ],
  },

  // ============ SUPPLEMENTARY PLANTS ============
  {
    id: "snake_plant",
    name: "Snake Plant (Sansevieria)",
    category: "supplementary",
    minAQI: 50,
    baseCost: 300,
    effectivenessScore: 0.08,
    applicableHomeTypes: ["room", "1BHK", "2BHK", "3BHK", "bungalow & villa", "others"],
    priorityBoostForSensitive: false,
    description: "Low-maintenance plant, releases oxygen at night",
    affiliateOptions: [
      { retailer: "Nursery Live", url: "https://nurserylive.com/p/snake-plant", price: 349, productName: "Snake Plant in Ceramic Pot" },
      { retailer: "Ugaoo", url: "https://ugaoo.com/p/sansevieria", price: 299, productName: "Sansevieria Trifasciata" },
    ],
  },
  {
    id: "areca_palm",
    name: "Areca Palm",
    category: "supplementary",
    minAQI: 50,
    baseCost: 450,
    effectivenessScore: 0.10,
    applicableHomeTypes: ["1BHK", "2BHK", "3BHK", "bungalow & villa", "others"],
    priorityBoostForSensitive: false,
    description: "Natural humidifier, removes formaldehyde",
    affiliateOptions: [
      { retailer: "Nursery Live", url: "https://nurserylive.com/p/areca", price: 499, productName: "Areca Palm Medium" },
      { retailer: "Ugaoo", url: "https://ugaoo.com/p/areca-palm", price: 449, productName: "Golden Cane Palm" },
    ],
  },
  {
    id: "money_plant",
    name: "Money Plant (Pothos)",
    category: "supplementary",
    minAQI: 50,
    baseCost: 200,
    effectivenessScore: 0.06,
    applicableHomeTypes: ["room", "1BHK", "2BHK", "3BHK", "bungalow & villa", "others"],
    priorityBoostForSensitive: false,
    description: "Hardy trailing plant, improves indoor air quality",
    affiliateOptions: [
      { retailer: "Nursery Live", url: "https://nurserylive.com/p/money-plant", price: 249, productName: "Golden Money Plant" },
      { retailer: "Ugaoo", url: "https://ugaoo.com/p/pothos", price: 199, productName: "Devil's Ivy Pothos" },
    ],
  },
  {
    id: "spider_plant",
    name: "Spider Plant (Chlorophytum)",
    category: "supplementary",
    minAQI: 50,
    baseCost: 250,
    effectivenessScore: 0.07,
    applicableHomeTypes: ["room", "1BHK", "2BHK", "3BHK", "bungalow & villa", "others"],
    priorityBoostForSensitive: false,
    description: "Excellent for removing carbon monoxide and formaldehyde",
    affiliateOptions: [
      { retailer: "Nursery Live", url: "https://nurserylive.com/p/spider", price: 299, productName: "Spider Plant Variegated" },
      { retailer: "Ugaoo", url: "https://ugaoo.com/p/spider-plant", price: 249, productName: "Chlorophytum Comosum" },
    ],
  },
  {
    id: "peace_lily",
    name: "Peace Lily (Spathiphyllum)",
    category: "supplementary",
    minAQI: 50,
    baseCost: 400,
    effectivenessScore: 0.09,
    applicableHomeTypes: ["room", "1BHK", "2BHK", "3BHK", "bungalow & villa", "others"],
    priorityBoostForSensitive: false,
    description: "NASA-recommended air purifying plant",
    affiliateOptions: [
      { retailer: "Nursery Live", url: "https://nurserylive.com/p/peace-lily", price: 449, productName: "Peace Lily in White Pot" },
      { retailer: "Ugaoo", url: "https://ugaoo.com/p/peace-lily", price: 399, productName: "Spathiphyllum Peace Lily" },
    ],
  },
  {
    id: "aloe_vera",
    name: "Aloe Vera Plant",
    category: "supplementary",
    minAQI: 50,
    baseCost: 200,
    effectivenessScore: 0.05,
    applicableHomeTypes: ["room", "1BHK", "2BHK", "3BHK", "bungalow & villa", "others"],
    priorityBoostForSensitive: false,
    description: "Multi-purpose plant with air-cleaning properties",
    affiliateOptions: [
      { retailer: "Nursery Live", url: "https://nurserylive.com/p/aloe", price: 249, productName: "Aloe Vera in Terracotta" },
      { retailer: "Ugaoo", url: "https://ugaoo.com/p/aloe-vera", price: 199, productName: "Medicinal Aloe Vera" },
    ],
  },
  {
    id: "rubber_plant",
    name: "Rubber Plant (Ficus Elastica)",
    category: "supplementary",
    minAQI: 50,
    baseCost: 500,
    effectivenessScore: 0.08,
    applicableHomeTypes: ["1BHK", "2BHK", "3BHK", "bungalow & villa", "others"],
    priorityBoostForSensitive: false,
    description: "Large-leafed plant effective at removing toxins",
    affiliateOptions: [
      { retailer: "Nursery Live", url: "https://nurserylive.com/p/rubber", price: 549, productName: "Rubber Plant Burgundy" },
      { retailer: "Ugaoo", url: "https://ugaoo.com/p/ficus", price: 499, productName: "Ficus Elastica Medium" },
    ],
  },
];
