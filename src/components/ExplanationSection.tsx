import { useState } from "react";
import { ChevronDown, Lightbulb } from "lucide-react";
import { REASON_CODE_MAPPING } from "@/data/mockPhase2Data";
import { cn } from "@/lib/utils";

interface ExplanationSectionProps {
  reasonCodes: string[];
}

export const ExplanationSection = ({ reasonCodes }: ExplanationSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Map reason codes to explanations (max 5 per PRD)
  const explanations = reasonCodes
    .slice(0, 5)
    .map((code) => REASON_CODE_MAPPING[code])
    .filter(Boolean);

  if (explanations.length === 0) return null;

  return (
    <div className="border-t border-border/50 mt-4 pt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full text-left group transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Lightbulb className="w-3.5 h-3.5 text-primary" />
        </div>
        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
          Why this was recommended
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 ml-auto text-muted-foreground transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          isExpanded ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <ul className="space-y-2 pl-8">
            {explanations.map((explanation, index) => (
              <li
                key={index}
                className="relative text-sm text-muted-foreground before:content-['•'] before:absolute before:-left-4 before:text-primary animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {explanation}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
