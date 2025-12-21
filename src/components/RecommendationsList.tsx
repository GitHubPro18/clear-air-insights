import { mockPhase2Output, mockPhase2Input } from "@/data/mockPhase2Data";
import { ProductCard } from "./ProductCard";
import { Wallet, AlertTriangle } from "lucide-react";

export const RecommendationsList = () => {
  const { recommendedProducts, remainingBudget } = mockPhase2Output;
  const { budget } = mockPhase2Input;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const spentAmount = budget - remainingBudget;

  return (
    <section className="container py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div className="animate-fade-up">
          <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
            Your Personalized Recommendations
          </h2>
          <p className="text-muted-foreground">
            Products selected to maximize your air quality protection
          </p>
        </div>

        {/* Budget summary */}
        <div className="animate-fade-up stagger-1 flex items-center gap-3 bg-secondary/50 rounded-xl px-4 py-3">
          <Wallet className="w-5 h-5 text-primary" />
          <div className="text-sm">
            <span className="text-muted-foreground">Spent: </span>
            <span className="font-semibold text-foreground">{formatPrice(spentAmount)}</span>
            <span className="text-muted-foreground"> of {formatPrice(budget)}</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="text-sm">
            <span className="text-muted-foreground">Remaining: </span>
            <span className="font-semibold text-primary">{formatPrice(remainingBudget)}</span>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {recommendedProducts.map((product, index) => (
          <ProductCard key={product.productName} product={product} index={index} />
        ))}
      </div>

      {/* Disclaimer (per PRD ethical constraints) */}
      <div className="mt-10 animate-fade-up stagger-4">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
          <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Disclaimer:</span> These recommendations 
            reduce pollution exposure risk and are not medical advice. Consult a healthcare 
            professional for medical guidance.
          </p>
        </div>
      </div>
    </section>
  );
};
