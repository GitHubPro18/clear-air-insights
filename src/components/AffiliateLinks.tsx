import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AffiliateLink } from "@/data/mockPhase2Data";

interface AffiliateLinksProps {
  links: AffiliateLink[];
}

export const AffiliateLinks = ({ links }: AffiliateLinksProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {links.map((link, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          asChild
          className="group hover:border-primary hover:bg-primary/5 transition-all"
        >
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <span className="font-medium">{link.retailer}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-primary font-semibold">{formatPrice(link.price)}</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </Button>
      ))}
    </div>
  );
};
