import { Wind, Shield, Car, Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PriorityBadge } from "./PriorityBadge";
import { ExplanationSection } from "./ExplanationSection";
import { AffiliateLinks } from "./AffiliateLinks";
import type { RecommendedProduct } from "@/data/mockPhase2Data";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: RecommendedProduct;
  index: number;
}

const getProductIcon = (productType: string) => {
  if (productType.toLowerCase().includes("purifier") && !productType.toLowerCase().includes("car")) {
    return Wind;
  }
  if (productType.toLowerCase().includes("mask")) {
    return Shield;
  }
  if (productType.toLowerCase().includes("car")) {
    return Car;
  }
  return Leaf;
};

export const ProductCard = ({ product, index }: ProductCardProps) => {
  const Icon = getProductIcon(product.productType);

  return (
    <Card
      className={cn(
        "overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300",
        "animate-fade-up opacity-0",
        "border-border/50 hover:border-primary/30"
      )}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>

            {/* Title & Type */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                {product.productType}
              </p>
              <h3 className="text-lg font-heading font-semibold text-foreground leading-tight">
                {product.productName}
              </h3>
            </div>
          </div>

          {/* Priority Badge */}
          <PriorityBadge priority={product.priority} />
        </div>

        {/* Explainability Section (per PRD: appears before affiliate links) */}
        <ExplanationSection reasonCodes={product.reasonCodes} />

        {/* Affiliate Links */}
        <AffiliateLinks links={product.affiliateLinks} />
      </CardContent>
    </Card>
  );
};
