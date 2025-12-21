import { Wind, Shield, Car, Leaf, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PriorityBadge } from "./PriorityBadge";
import { ExplanationSection } from "./ExplanationSection";
import { Button } from "@/components/ui/button";
import { ExternalLink, Wallet, AlertTriangle } from "lucide-react";
import type { RecommendationOutput, RecommendedProduct } from "@/lib/recommendationEngine";
import { cn } from "@/lib/utils";

interface RecommendationResultsProps {
  results: RecommendationOutput;
  budget: number;
}

const getProductIcon = (productType: string) => {
  const type = productType.toLowerCase();
  if (type.includes("purifier")) return Wind;
  if (type.includes("mask")) return Shield;
  if (type.includes("car")) return Car;
  if (type.includes("plant") || type.includes("palm") || type.includes("lily") || type.includes("aloe")) return Leaf;
  return Package;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const ProductCard = ({ product, index }: { product: RecommendedProduct; index: number }) => {
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
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                {product.productType}
              </p>
              <h3 className="text-lg font-heading font-semibold text-foreground leading-tight">
                {product.productName}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {product.reason}
              </p>
            </div>
          </div>
          <PriorityBadge priority={product.priority} />
        </div>

        {/* Explainability Section */}
        <ExplanationSection reasonCodes={product.reasonCodes} />

        {/* Affiliate Links */}
        <div className="flex flex-wrap gap-2 mt-4">
          {product.options.map((option, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              asChild
              className="group hover:border-primary hover:bg-primary/5 transition-all"
            >
              <a
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <span className="font-medium">{option.retailer}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-primary font-semibold">{formatPrice(option.price)}</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const RecommendationResults = ({ results, budget }: RecommendationResultsProps) => {
  const { summary, recommendedProducts, remainingBudget, totalSpent } = results;

  if (recommendedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-heading font-semibold mb-2">No Recommendations</h3>
        <p className="text-muted-foreground">
          Based on current air quality and your inputs, no products are recommended at this time.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Summary Card */}
      <div className="animate-fade-up bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
        <p className="text-foreground font-medium">{summary}</p>
      </div>

      {/* Budget Summary */}
      <div className="animate-fade-up stagger-1 flex flex-wrap items-center gap-4 bg-secondary/50 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">Budget:</span>
          <span className="font-semibold text-foreground">{formatPrice(budget)}</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="text-sm">
          <span className="text-muted-foreground">Spent: </span>
          <span className="font-semibold text-foreground">{formatPrice(totalSpent)}</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="text-sm">
          <span className="text-muted-foreground">Remaining: </span>
          <span className="font-semibold text-primary">{formatPrice(remainingBudget)}</span>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {recommendedProducts.map((product, index) => (
          <ProductCard 
            key={`${product.productType}-${index}`} 
            product={product} 
            index={index} 
          />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="animate-fade-up">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
          <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Disclaimer:</span> These recommendations 
              reduce pollution exposure risk and are not medical advice. Consult a healthcare 
              professional for medical guidance.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Affiliate disclosure: We may earn a commission from purchases made through these links at no extra cost to you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
