// Phase 2 Recommendation Engine
// Implements PRD Sections 7.1-7.4: Priority Recommendation Engine

import { PRODUCT_CATALOG, ProductWithAffiliates, HomeType, Priority } from "@/data/productCatalog";
import { REASON_CODE_MAPPING } from "@/data/mockPhase2Data";

export interface SensitiveGroups {
  ageUnder10: boolean;
  ageAbove60: boolean;
  pregnant: boolean;
  asthma: boolean;
}

export interface RecommendationInput {
  budget: number; // ₹0 – ₹30,000
  homeType: HomeType;
  timeIndoorsPerWeek: number; // hours per week
  dailyCommuteHoursOnAverage: number; // hours per week for commute
  sensitiveGroups: SensitiveGroups;
  aqi: number;
  pm25: number;
}

export interface RecommendedProduct {
  productType: string;
  productName: string;
  priority: Priority;
  reason: string;
  reasonCodes: string[];
  options: {
    retailer: string;
    url: string;
    price: number;
    productName: string;
  }[];
  selectedCost: number;
}

export interface RecommendationOutput {
  summary: string;
  recommendedProducts: RecommendedProduct[];
  remainingBudget: number;
  totalSpent: number;
}

// ============ SENSITIVITY MULTIPLIER (PRD Section) ============
function calculateSensitivityMultiplier(sensitiveGroups: SensitiveGroups): number {
  let multiplier = 1;
  if (sensitiveGroups.ageUnder10) multiplier += 0.2;
  if (sensitiveGroups.ageAbove60) multiplier += 0.4;
  if (sensitiveGroups.pregnant) multiplier += 0.3;
  if (sensitiveGroups.asthma) multiplier += 0.6;
  return multiplier;
}

// ============ EXPOSURE WEIGHT (PRD Section 7.2) ============
function calculateExposureWeight(
  timeIndoorsPerWeek: number,
  dailyCommuteHoursOnAverage: number,
): { indoorWeight: number; commuteWeight: number; total: number } {
  const hoursInWeek = 168;
  const indoorWeight = timeIndoorsPerWeek / hoursInWeek;
  const commuteWeight = (dailyCommuteHoursOnAverage * 7) / hoursInWeek; // weekly commute
  // Boost indoor weight since people spend most time at home
  const adjustedIndoorWeight = Math.min(indoorWeight * 1.5, 1.0);
  return {
    indoorWeight: adjustedIndoorWeight,
    commuteWeight,
    total: adjustedIndoorWeight + commuteWeight,
  };
}

// ============ PRIORITY SCORE (PRD Section 7.3) ============
function calculatePriorityScore(
  product: ProductWithAffiliates,
  exposureWeight: number,
  sensitivityMultiplier: number,
): number {
  const cost = Math.min(...product.affiliateOptions.map((o) => o.price));
  const sensitivityBoost = product.priorityBoostForSensitive ? sensitivityMultiplier : 1;
  // Use logarithmic cost scaling to reduce price penalty
  // This prevents cheap items from dominating while still favoring value
  const costFactor = Math.log10(cost + 1) / 4; // Normalize to ~0.5-1.0 range
  return (product.effectivenessScore * exposureWeight * sensitivityBoost) / (costFactor / 1000);
}

// ============ REASON CODE GENERATOR ============
function generateReasonCodes(
  product: ProductWithAffiliates,
  input: RecommendationInput,
  isMandatory: boolean,
): string[] {
  const codes: string[] = [];

  // AQI-based codes
  if (input.aqi >= 300) codes.push("AQI_ABOVE_300");
  else if (input.aqi >= 200) codes.push("AQI_ABOVE_200");
  else if (input.aqi >= 150) codes.push("AQI_ABOVE_150");
  else if (input.aqi >= 100) codes.push("AQI_ABOVE_100");

  // Indoor time codes
  const indoorPercentage = input.timeIndoorsPerWeek / 168;
  if (indoorPercentage >= 0.7) codes.push("HIGH_INDOOR_TIME");
  else if (indoorPercentage >= 0.4) codes.push("MODERATE_INDOOR_TIME");

  // Commute codes
  const weeklyCommuteHours = input.dailyCommuteHoursOnAverage * 7;
  if (weeklyCommuteHours >= 10) codes.push("LONG_COMMUTE");
  else if (weeklyCommuteHours >= 5) codes.push("MODERATE_COMMUTE");

  // Sensitive group codes
  const hasSensitive = Object.values(input.sensitiveGroups).some(Boolean);
  if (hasSensitive) codes.push("SENSITIVE_GROUP_PRESENT");
  if (input.sensitiveGroups.ageUnder10) codes.push("CHILD_PRESENT");
  if (input.sensitiveGroups.ageAbove60) codes.push("ELDERLY_PRESENT");
  if (input.sensitiveGroups.pregnant) codes.push("PREGNANCY_PRESENT");
  if (input.sensitiveGroups.asthma) codes.push("RESPIRATORY_CONDITION");

  // Product-specific codes
  if (product.category === "indoor") codes.push("LARGE_COVERAGE_AREA");
  if (product.category === "personal" && weeklyCommuteHours > 0) codes.push("PORTABLE_PROTECTION");

  // Value codes
  if (product.effectivenessScore >= 0.7) codes.push("HIGH_CADR_RATING");
  codes.push("BEST_PM25_REDUCTION_PER_RUPEE");
  codes.push("BUDGET_OPTIMIZED");

  return codes.slice(0, 5); // Max 5 per PRD
}

// ============ GENERATE SUMMARY ============
function generateSummary(input: RecommendationInput, mandatoryProducts: ProductWithAffiliates[]): string {
  const parts: string[] = [];

  if (input.aqi >= 300) {
    parts.push("Hazardous air quality detected.");
  } else if (input.aqi >= 200) {
    parts.push("Very unhealthy air quality detected.");
  } else if (input.aqi >= 150) {
    parts.push("Unhealthy air quality detected.");
  } else if (input.aqi >= 100) {
    parts.push("Moderate pollution levels detected.");
  } else {
    parts.push("Air quality is acceptable.");
  }

  const hasSensitive = Object.values(input.sensitiveGroups).some(Boolean);
  if (hasSensitive) {
    parts.push("Protection prioritized for sensitive household members.");
  }

  if (mandatoryProducts.length > 0) {
    parts.push("Personal protection is mandatory at this AQI level.");
  }

  return parts.join(" ");
}

// ============ PRIORITY LABEL ============
function getPriorityLabel(score: number, isMandatory: boolean): Priority {
  if (isMandatory) return "High";
  //if (score >= 0.15) return "High";
  // BOLT LOGIC
  if (score >= 0.5) return "High";
  //if (score >= 0.08) return "Medium";
  // BOLT LOGIC
  if (score >= 0.2) return "Medium";
  return "Low";
  if (product.category === "supplementary") return "Low";
}

// ============ MAIN RECOMMENDATION ENGINE (PRD Section 7.4) ============
export function generateRecommendations(input: RecommendationInput): RecommendationOutput {
  const { budget, homeType, timeIndoorsPerWeek, dailyCommuteHoursOnAverage, sensitiveGroups, aqi } = input;

  // Calculate weights
  const sensitivityMultiplier = calculateSensitivityMultiplier(sensitiveGroups);
  const exposure = calculateExposureWeight(timeIndoorsPerWeek, dailyCommuteHoursOnAverage);

  // Step 1: Identify mandatory products (PRD 7.1)
  const mandatoryProducts = PRODUCT_CATALOG.filter(
    (p) => p.isMandatoryAtAQI !== undefined && aqi >= p.isMandatoryAtAQI,
  );

  // BOLT LOGIC
  const mandatoryProductIds = new Set(mandatoryProducts.map((p) => p.id));

  // Step 2: Filter eligible products
  let eligibleProducts = PRODUCT_CATALOG.filter((p) => {
    // BOLT LOGIC
    if (mandatoryProductIds.has(p.id)) return false;
    // AQI threshold met
    if (aqi < p.minAQI) return false;
    // Applicable to home type
    if (!p.applicableHomeTypes.includes(homeType)) return false;
    // Child mask only if children present
    if (p.isChildVariant && !sensitiveGroups.ageUnder10) return false;
    return true;
  });

  // BOLT LOGIC
  // ===== STEP 0: HARD MANDATORY RULE (BOLT) =====
  let remainingBudget = budget;
  const selectedProducts: RecommendedProduct[] = [];
  const selectedIds = new Set<string>();

  // Track if a high-capacity indoor purifier is already selected
  let hasHighCapacityIndoorPurifier = false;

  if (aqi >= 250) {
    const mandatoryMask = PRODUCT_CATALOG.find((p) => p.id === "n95_mask" && p.minAQI <= aqi);

    if (mandatoryMask) {
      const cheapest = mandatoryMask.affiliateOptions.reduce((min, opt) => (opt.price < min.price ? opt : min));

      if (cheapest.price <= remainingBudget) {
        selectedProducts.push({
          productType: mandatoryMask.name,
          productName: cheapest.productName,
          priority: "High",
          reason: "Hazardous AQI — mandatory personal protection required",
          reasonCodes: ["AQI_ABOVE_300"],
          options: mandatoryMask.affiliateOptions,
          selectedCost: cheapest.price,
        });

        remainingBudget -= cheapest.price;
        selectedIds.add(mandatoryMask.id);
      }
    }
  }

  // Step 3: Score and sort products
  const scoredProducts = eligibleProducts.map((product) => {
    const isMandatory = mandatoryProducts.some((m) => m.id === product.id);
    //const effectiveExposure = product.category === "personal" ? exposure.commuteWeight + 0.5 : exposure.indoorWeight;
    // BOLT LOGIC
    const effectiveExposure = product.category === "personal" ? exposure.commuteWeight : exposure.indoorWeight;
    // const score = calculatePriorityScore(product, effectiveExposure + 0.3, sensitivityMultiplier);
    // BOLT LOGIC
    const score = calculatePriorityScore(product, effectiveExposure, sensitivityMultiplier);
    return {
      // BOLT LOGIC (REMOVE THIS) getPriorityLabel
      product,
      score,
      isMandatory,
      minPrice: Math.min(...product.affiliateOptions.map((o) => o.price)),
    };
  });

  // Sort: mandatory first, then by score descending
  // BOLT LOGIC
  /*
  scoredProducts.sort((a, b) => {
    if (a.isMandatory && !b.isMandatory) return -1;
    if (!a.isMandatory && b.isMandatory) return 1;
    return b.score - a.score;
  });
  */
  scoredProducts.sort((a, b) => b.score - a.score);

  // Step 4: Greedy selection within budget
  // BOLT LOGIC
  //let remainingBudget = budget;
  //const selectedProducts: RecommendedProduct[] = [];
  //const selectedIds = new Set<string>();

  for (const { product, score, isMandatory, minPrice } of scoredProducts) {
    // Skip if already selected a product from same category with similar function
    if (selectedIds.has(product.id)) continue;

    // Skip supplementary plants if we already have 2
    const plantCount = selectedProducts.filter(
      (p) => PRODUCT_CATALOG.find((c) => c.name === p.productType)?.category === "supplementary",
    ).length;
    if (product.category === "supplementary" && plantCount >= 2) continue;

    // Prevent recommending weaker indoor purifiers once strong indoor coverage exists
    if (hasHighCapacityIndoorPurifier && product.category === "indoor" && product.effectivenessScore < 0.7) {
      continue;
    }

    // Check budget : BOLT LOGIC
    if (minPrice > remainingBudget) {
      continue;
    }
    /*
      // If mandatory and can't afford, still include with note
      if (isMandatory) {
        // Add anyway for visibility but mark budget issue
      } else {
        continue;
      }
    }
    */
    // Find cheapest option
    const cheapestOption = product.affiliateOptions.reduce((min, opt) => (opt.price < min.price ? opt : min));

    //const reasonCodes = generateReasonCodes(product, input, isMandatory);
    // BOLT LOGIC
    const reasonCodes = generateReasonCodes(product, input, false);
    const reason = reasonCodes
      .slice(0, 3)
      .map((code) => REASON_CODE_MAPPING[code] || code)
      .join(". ");

    selectedProducts.push({
      productType: product.name,
      productName: cheapestOption.productName,
      //priority: getPriorityLabel(score, isMandatory),
      priority: getPriorityLabel(score, false),
      reason,
      reasonCodes,
      options: product.affiliateOptions,
      selectedCost: cheapestOption.price,
    });

    // Mark indoor coverage as satisfied if high-capacity purifier is selected
    if (product.category === "indoor" && product.effectivenessScore >= 0.7) {
      hasHighCapacityIndoorPurifier = true;
    }

    selectedIds.add(product.id);
    remainingBudget -= cheapestOption.price;

    // Limit to 6 products max
    if (selectedProducts.length >= 6) break;
  }

  const totalSpent = budget - remainingBudget;

  return {
    summary: generateSummary(input, mandatoryProducts),
    recommendedProducts: selectedProducts,
    remainingBudget: Math.max(0, remainingBudget),
    totalSpent,
  };
}

// Update reason code mapping with new codes
export const EXTENDED_REASON_CODE_MAPPING: Record<string, string> = {
  ...REASON_CODE_MAPPING,
  AQI_ABOVE_300: "Air quality is hazardous — immediate protection required",
  AQI_ABOVE_100: "Air quality is moderate with some pollutants present",
};
