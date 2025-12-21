import { Home, Clock, Car, Users } from "lucide-react";
import { mockPhase2Input } from "@/data/mockPhase2Data";

export const UserInputsSummary = () => {
  const { homeType, timeIndoorsPerWeek, dailyCommuteMinutes, sensitiveGroups } = mockPhase2Input;

  const sensitiveGroupLabels = [];
  if (sensitiveGroups.ageUnder10) sensitiveGroupLabels.push("Children <10");
  if (sensitiveGroups.ageAbove60) sensitiveGroupLabels.push("Adults 60+");
  if (sensitiveGroups.pregnant) sensitiveGroupLabels.push("Pregnant");
  if (sensitiveGroups.asthma) sensitiveGroupLabels.push("Respiratory condition");

  const homeTypeLabels: Record<string, string> = {
    room: "Single Room",
    "1BHK": "1 BHK Apartment",
    "2BHK": "2 BHK Apartment",
    others: "Other",
  };

  return (
    <section className="container py-8">
      <div className="animate-fade-up bg-gradient-to-r from-secondary/30 to-secondary/10 rounded-2xl p-6 border border-border/30">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Your Profile Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Home Type */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Home className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Home</p>
              <p className="text-sm font-medium text-foreground">{homeTypeLabels[homeType]}</p>
            </div>
          </div>

          {/* Indoor Time */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Indoors/Week</p>
              <p className="text-sm font-medium text-foreground">{timeIndoorsPerWeek} hours</p>
            </div>
          </div>

          {/* Commute */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Car className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Daily Commute</p>
              <p className="text-sm font-medium text-foreground">{dailyCommuteMinutes} mins</p>
            </div>
          </div>

          {/* Sensitive Groups */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sensitive Groups</p>
              <p className="text-sm font-medium text-foreground">
                {sensitiveGroupLabels.length > 0
                  ? sensitiveGroupLabels.slice(0, 2).join(", ") +
                    (sensitiveGroupLabels.length > 2 ? ` +${sensitiveGroupLabels.length - 2}` : "")
                  : "None"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
