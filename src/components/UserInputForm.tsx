import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Wallet, 
  Home, 
  Clock, 
  Car, 
  Users, 
  Sparkles,
  Baby,
  UserRound,
  Heart,
  Stethoscope
} from "lucide-react";
import type { HomeType } from "@/data/productCatalog";

interface SensitiveGroups {
  ageUnder10: boolean;
  ageAbove60: boolean;
  pregnant: boolean;
  asthma: boolean;
}

interface UserInputFormProps {
  onSubmit: (data: {
    budget: number;
    homeType: HomeType;
    timeIndoorsPerWeek: number;
    dailyCommuteHoursOnAverage: number;
    sensitiveGroups: SensitiveGroups;
  }) => void;
  isLoading?: boolean;
}

const HOME_TYPES: { value: HomeType; label: string }[] = [
  { value: "room", label: "Single Room" },
  { value: "1BHK", label: "1 BHK" },
  { value: "2BHK", label: "2 BHK" },
  { value: "3BHK", label: "3 BHK" },
  { value: "bungalow & villa", label: "Bungalow / Villa" },
  { value: "others", label: "Independent House / Others" },
];

const formatBudget = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

export const UserInputForm = ({ onSubmit, isLoading }: UserInputFormProps) => {
  const [budget, setBudget] = useState(15000);
  const [homeType, setHomeType] = useState<HomeType>("2BHK");
  const [timeIndoorsPerWeek, setTimeIndoorsPerWeek] = useState(120);
  const [dailyCommuteHours, setDailyCommuteHours] = useState(2);
  const [sensitiveGroups, setSensitiveGroups] = useState<SensitiveGroups>({
    ageUnder10: false,
    ageAbove60: false,
    pregnant: false,
    asthma: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      budget,
      homeType,
      timeIndoorsPerWeek,
      dailyCommuteHoursOnAverage: dailyCommuteHours,
      sensitiveGroups,
    });
  };

  const toggleSensitiveGroup = (key: keyof SensitiveGroups) => {
    setSensitiveGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-heading">
            <Sparkles className="w-5 h-5 text-primary" />
            Personalize Your Protection Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Budget Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Wallet className="w-4 h-4 text-primary" />
                Budget
              </Label>
              <span className="text-lg font-semibold text-primary">
                {formatBudget(budget)}
              </span>
            </div>
            <Slider
              value={[budget]}
              onValueChange={([value]) => setBudget(value)}
              min={0}
              max={30000}
              step={500}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹0</span>
              <span>₹30,000</span>
            </div>
          </div>

          {/* Home Type */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Home className="w-4 h-4 text-primary" />
              Home Type
            </Label>
            <Select value={homeType} onValueChange={(v) => setHomeType(v as HomeType)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select home type" />
              </SelectTrigger>
              <SelectContent>
                {HOME_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Indoors */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4 text-primary" />
              Hours Spent Indoors Per Week
            </Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={timeIndoorsPerWeek}
                onChange={(e) => setTimeIndoorsPerWeek(Number(e.target.value))}
                min={0}
                max={168}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">
                hours/week (max 168)
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Include time at home, office, and other indoor spaces
            </p>
          </div>

          {/* Daily Commute */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Car className="w-4 h-4 text-primary" />
              Average Daily Commute
            </Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={dailyCommuteHours}
                onChange={(e) => setDailyCommuteHours(Number(e.target.value))}
                min={0}
                max={8}
                step={0.5}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">
                hours/day
              </span>
            </div>
          </div>

          {/* Sensitive Groups */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Users className="w-4 h-4 text-primary" />
              Sensitive Groups in Household
            </Label>
            <p className="text-xs text-muted-foreground -mt-2">
              Select if any apply — this helps prioritize protection
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* Children */}
              <label
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  sensitiveGroups.ageUnder10
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Checkbox
                  checked={sensitiveGroups.ageUnder10}
                  onCheckedChange={() => toggleSensitiveGroup("ageUnder10")}
                />
                <div className="flex items-center gap-2">
                  <Baby className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Children (&lt;10)</span>
                </div>
              </label>

              {/* Elderly */}
              <label
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  sensitiveGroups.ageAbove60
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Checkbox
                  checked={sensitiveGroups.ageAbove60}
                  onCheckedChange={() => toggleSensitiveGroup("ageAbove60")}
                />
                <div className="flex items-center gap-2">
                  <UserRound className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Adults (60+)</span>
                </div>
              </label>

              {/* Pregnant */}
              <label
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  sensitiveGroups.pregnant
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Checkbox
                  checked={sensitiveGroups.pregnant}
                  onCheckedChange={() => toggleSensitiveGroup("pregnant")}
                />
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Pregnant</span>
                </div>
              </label>

              {/* Asthma */}
              <label
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  sensitiveGroups.asthma
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Checkbox
                  checked={sensitiveGroups.asthma}
                  onCheckedChange={() => toggleSensitiveGroup("asthma")}
                />
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Respiratory</span>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Generating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Get Personalized Recommendations
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};
