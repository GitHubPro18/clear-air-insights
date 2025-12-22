import { AQIData, POLLUTANTS } from "@/data/aqiData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PollutantBreakdownProps {
  data: AQIData;
}

// Safe thresholds for visual indicator (simplified)
const THRESHOLDS: Record<string, { good: number; moderate: number; poor: number }> = {
  pm25: { good: 30, moderate: 60, poor: 90 },
  pm10: { good: 50, moderate: 100, poor: 250 },
  no2: { good: 40, moderate: 80, poor: 180 },
  so2: { good: 40, moderate: 80, poor: 380 },
  co: { good: 1.0, moderate: 2.0, poor: 10 },
  o3: { good: 50, moderate: 100, poor: 168 },
};

const PollutantBreakdown = ({ data }: PollutantBreakdownProps) => {
  const getBarColor = (key: string, value: number) => {
    const threshold = THRESHOLDS[key];
    if (!threshold) return "bg-muted";
    
    if (value <= threshold.good) return "bg-emerald-500";
    if (value <= threshold.moderate) return "bg-yellow-500";
    if (value <= threshold.poor) return "bg-orange-500";
    return "bg-red-500";
  };

  const getBarWidth = (key: string, value: number) => {
    const threshold = THRESHOLDS[key];
    if (!threshold) return 50;
    
    const maxVal = threshold.poor * 1.5;
    const percentage = Math.min((value / maxVal) * 100, 100);
    return Math.max(percentage, 5);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-xl font-heading flex items-center gap-2">
          Pollutant Levels
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {POLLUTANTS.map((pollutant) => {
            const value = data.pollutants[pollutant.key as keyof typeof data.pollutants];
            const barColor = getBarColor(pollutant.key, value);
            const barWidth = getBarWidth(pollutant.key, value);

            return (
              <div key={pollutant.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{pollutant.name}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <Info className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="font-medium mb-1">{pollutant.fullName}</p>
                        <p className="text-xs text-muted-foreground">{pollutant.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {value} {pollutant.unit}
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PollutantBreakdown;
