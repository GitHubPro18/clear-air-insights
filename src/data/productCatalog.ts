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
    baseCost: 422,
    effectivenessScore: 0.85,
    applicableHomeTypes: ["room", "1BHK", "2BHK", "3BHK", "bungalow & villa", "others"],
    priorityBoostForSensitive: true,
    description: "Washable N95-equivalent mask with replaceable filters",
    isMandatoryAtAQI: 300,
    affiliateOptions: [
      {
        retailer: "Amazon",
        url: "https://amzn.to/44GtBWw",
        price: 399,
        productName:
          "Yugan N99 Anti Pollution Reusable and Washable Face Masks with Replaceable N99 Filters, Unisex, With Valve",
      } /*,
      {
        retailer: "Flipkart",
        url: "https://flipkart.com/p/n95-reusable",
        price: 349,
        productName: "Venus V-4400 N95 Mask",
      },
      */,
    ],
  },
  {
    id: "disposable_n95_pack",
    name: "Disposable N95 Masks (Pack of 10)",
    category: "personal",
    minAQI: 150,
    baseCost: 500,
    effectivenessScore: 0.8,
    applicableHomeTypes: ["room", "1BHK", "2BHK", "3BHK", "bungalow & villa", "others"],
    priorityBoostForSensitive: true,
    description: "Single-use N95 masks for high pollution days",
    isMandatoryAtAQI: 300,
    affiliateOptions: [
      {
        retailer: "Amazon",
        url: "https://amzn.to/4b0UFn5",
        price: 367,
        productName:
          "(Pack of 20 (Grey) Premium N95 Mask For Men and Women with Mask Adjuster - Washable - Reusable - Pollution - Protection - Advance Filtration",
      } /*,
      {
        retailer: "Flipkart",
        url: "https://flipkart.com/p/n95-disposable",
        price: 499,
        productName: "Venus N95 Disposable (Pack of 10)",
      },
      */,
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
      {
        retailer: "Amazon",
        url: "https://amzn.to/4j84iCx",
        price: 322,
        productName:
          "Kids Non woven Ear Loop Style Protective 5 layered filtration with genuine Melt Blown and Hot Air Cotton Layers N95 Face Mask (Multicolour Small) -Pack of 5/10+2",
      } /*,
      { retailer: "FirstCry", url: "https://firstcry.com/p/kids-n95", price: 249, productName: "Cambridge Mask Kids" },
      */,
    ],
  },

  // ============ INDOOR AIR CONTROL ============
  {
    id: "hepa_purifier_room",
    name: "HEPA Air Purifier (Room)",
    category: "indoor",
    minAQI: 150,
    baseCost: 5000,
    effectivenessScore: 0.7,
    applicableHomeTypes: ["room", "1BHK"],
    priorityBoostForSensitive: true,
    description: "Compact HEPA purifier for single room coverage (~200 sq ft)",
    affiliateOptions: [
      {
        retailer: "Amazon",
        url: "https://amzn.to/3Y9gglN",
        price: 6450,
        productName: "Honeywell Air Purifier for Home & Office, 3-in-1, Pre, H13 HEPA, Activated Carbon", //, Removes 99.99% Pollutants, Allergens, Pet Danger, Smoke, Dust & Pollens - Air touch V1",
      } /*,
      { retailer: "Flipkart", url: "https://flipkart.com/p/hepa-room", price: 4999, productName: "Philips AC0820" },
      */,
    ],
  },
  {
    id: "hepa_purifier_home",
    name: "HEPA Air Purifier (Home)",
    category: "indoor",
    minAQI: 200,
    baseCost: 12000,
    effectivenessScore: 0.85,
    //isMandatoryAtAQI: 300,
    applicableHomeTypes: ["2BHK", "3BHK", "bungalow & villa", "others"],
    priorityBoostForSensitive: true,
    description: "High-capacity HEPA purifier for larger spaces (~500 sq ft)",
    affiliateOptions: [
      {
        retailer: "Amazon",
        url: "https://amzn.to/4pbCLSh",
        price: 11998,
        productName: "Forus Air Purifier for Home & Office, H13 HEPA 3-in-1 filter", //, Removes 99.99% Pollutants, Allergens, Pet Dander, Smoke, Dust, virus & Pollens, Covers Up to 500 Sqft Area | PM 2.5 | 2-Year Warranty (WR)",
      } /*,
      { retailer: "Croma", url: "https://croma.com/p/hepa-home", price: 11999, productName: "Philips AC2887" },
      */,
    ],
  },
  {
    id: "portable_purifier",
    name: "Portable Single-Room Purifier",
    category: "indoor",
    minAQI: 100,
    baseCost: 3000,
    effectivenessScore: 0.5,
    applicableHomeTypes: ["room", "1BHK", "2BHK", "3BHK", "bungalow & villa", "others"],
    priorityBoostForSensitive: false,
    description: "Lightweight, portable purifier for desk or bedside",
    affiliateOptions: [
      {
        retailer: "Amazon",
        url: "https://amzn.to/4pQ4Gbl",
        price: 2299,
        productName:
          "Mini Air Purifier For Bedroom, Small Room Air Purifiers For Home, Portable Air Purifier For Pets Allergies, Desk Air Purifier For Office, Baby Air Purifier For Nursery, Blue Pure Mini Max",
      } /*,
      {
        retailer: "Flipkart",
        url: "https://flipkart.com/p/portable-purifier",
        price: 2999,
        productName: "Honeywell Move Pure",
      },
      */,
    ],
  },
  {
    id: "activated_carbon_bags",
    name: "Activated Carbon/Charcoal Bags (Set of 3)",
    category: "indoor",
    minAQI: 50,
    baseCost: 400,
    effectivenessScore: 0.2,
    applicableHomeTypes: ["room", "1BHK", "2BHK", "3BHK", "bungalow & villa", "others"],
    priorityBoostForSensitive: false,
    description: "Supplementary odor and VOC absorption",
    affiliateOptions: [
      {
        retailer: "Amazon",
        url: "https://amzn.to/3Y8wbAU",
        price: 1299,
        productName:
          "Coconut Shell Activated Carbon Air Purifier Bags To Deodorize And Dehumidify Car And Bathroom (200G, Pack Of 3, Classic Neel) - Granule",
      } /*,
      {
        retailer: "Flipkart",
        url: "https://flipkart.com/p/carbon-bags",
        price: 399,
        productName: "Amazon Basics Charcoal Bags",
      },
      */,
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
      {
        retailer: "Amazon",
        url: "https://amzn.to/48WMrK4",
        price: 274,
        productName:
          "10M Window Sealing Strips, Weather Stripping for Door Weatherproof, Soundproof, Windproof, Dustproof Door Frame Seal Brush Strip, Window Door Seal Strip (10 Mtr - 9 MM)",
      } /*,
      {
        retailer: "Flipkart",
        url: "https://flipkart.com/p/sealing-strips",
        price: 599,
        productName: "Duck Brand Seal Strip",
      },
      */,
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
      {
        retailer: "Amazon",
        url: "https://amzn.to/45oLx8e",
        price: 229,
        productName: "Sansevieria Golden Hahnii Snake Live Plant With Grow Pot",
      },
      {
        retailer: "Ugaoo",
        url: "https://www.ugaoo.com/products/snake-plant-golden-hahnii",
        price: 249,
        productName: "Sansevieria Trifasciata",
      },
    ],
  },
  {
    id: "areca_palm",
    name: "Areca Palm",
    category: "supplementary",
    minAQI: 50,
    baseCost: 450,
    effectivenessScore: 0.1,
    applicableHomeTypes: ["1BHK", "2BHK", "3BHK", "bungalow & villa", "others"],
    priorityBoostForSensitive: false,
    description: "Natural humidifier, removes formaldehyde",
    affiliateOptions: [
      {
        retailer: "Amazon",
        url: "https://amzn.to/4b4kDGr",
        price: 399,
        productName: "Areca Palm Air Purifier Natural Live Plant",
      },
      {
        retailer: "Ugaoo",
        url: "https://www.ugaoo.com/products/areca-palm-plant-big",
        price: 399,
        productName: "Golden Cane Palm",
      },
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
      {
        retailer: "Amazon",
        url: "https://amzn.to/49pQrUQ",
        price: 298,
        productName: "Good Luck Money Plant Variegated With Self Watering Pot",
      },
      {
        retailer: "Ugaoo",
        url: "https://www.ugaoo.com/products/money-plant-golden-with-self-watering-pot",
        price: 249,
        productName: "Devil's Ivy Pothos",
      },
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
      {
        retailer: "Amazon",
        url: "https://amzn.to/4jaOT4l",
        price: 299,
        productName: "Spider Plant Indoor Live with Self Watering Pot (4 Inch - Small)",
      },
      {
        retailer: "Ugaoo",
        url: "https://www.ugaoo.com/products/chlorophytum-spider-plant",
        price: 249,
        productName: "Chlorophytum Comosum",
      },
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
      {
        retailer: "Amazon",
        url: "https://amzn.to/4p90QJo",
        price: 187,
        productName: "Peace Lily Plant in White Ibiza Pot", // | Indoor Flowering Air-Purifying Plant for Home, Bedroom & Living Room Decor",
      },
      {
        retailer: "Ugaoo",
        url: "https://www.ugaoo.com/products/peace-lily-plant-with-self-watering-pot",
        price: 299,
        productName: "Spathiphyllum Peace Lily",
      },
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
      {
        retailer: "Amazon",
        url: "https://amzn.to/4sbnWSo",
        price: 249,
        productName: "Aloe Vera Mini Plant Succulent Live Plant With Grow Pot",
      },
      {
        retailer: "Ugaoo",
        url: "https://www.ugaoo.com/products/aloe-vera-mini-plant",
        price: 249,
        productName: "Medicinal Aloe Vera",
      },
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
      {
        retailer: "Amazon",
        url: "https://amzn.to/3MQAC0L",
        price: 599,
        productName: "Rubber Natural Live Indoor Plant", // - Medium",
      },
      {
        retailer: "Ugaoo",
        url: "https://www.ugaoo.com/products/rubber-plant",
        price: 549,
        productName: "Ficus Elastica Medium",
      },
    ],
  },
];
