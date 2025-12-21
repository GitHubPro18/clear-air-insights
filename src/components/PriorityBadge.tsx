import { cn } from "@/lib/utils";

interface PriorityBadgeProps {
  priority: "High" | "Medium" | "Low";
}

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide",
        priority === "High" && "bg-destructive/10 text-destructive",
        priority === "Medium" && "bg-accent/20 text-accent-foreground",
        priority === "Low" && "bg-primary/10 text-primary"
      )}
    >
      {priority} Priority
    </span>
  );
};
