import { AQIData, HEALTH_INTERPRETATIONS, getAQICategory } from "@/data/aqiData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, AlertCircle } from "lucide-react";

interface HealthImpactSectionProps {
  data: AQIData;
}

const HealthImpactSection = ({ data }: HealthImpactSectionProps) => {
  const category = getAQICategory(data.aqi);
  const interpretation = HEALTH_INTERPRETATIONS[category.label];

  const getAffectedGroups = () => {
    if (data.aqi <= 50) return [];
    if (data.aqi <= 100) return ["Unusually sensitive individuals"];
    if (data.aqi <= 200) return ["People with respiratory conditions", "People with heart conditions"];
    if (data.aqi <= 300) return ["People with heart or lung disease", "Older adults", "Children"];
    return ["Everyone", "Sensitive groups at higher risk"];
  };

  const getSymptoms = () => {
    if (data.aqi <= 50) return [];
    if (data.aqi <= 100) return ["Minor breathing issues for sensitive individuals"];
    if (data.aqi <= 200) return ["Coughing", "Throat irritation", "Breathing difficulties for sensitive groups"];
    if (data.aqi <= 300) return ["Breathing discomfort", "Aggravation of heart or lung disease", "Fatigue"];
    return ["Serious respiratory symptoms", "Aggravation of existing conditions", "Reduced lung function"];
  };

  const affectedGroups = getAffectedGroups();
  const symptoms = getSymptoms();

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-xl font-heading flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Health Impact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Interpretation */}
        <div className="p-4 rounded-xl bg-secondary/50 border border-border">
          <p className="text-foreground leading-relaxed">{interpretation}</p>
        </div>

        {/* Affected Groups */}
        {affectedGroups.length > 0 && (
          <div>
            <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
              <Users className="w-4 h-4" />
              Who may be affected
            </h4>
            <div className="flex flex-wrap gap-2">
              {affectedGroups.map((group, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-full bg-muted text-sm text-foreground"
                >
                  {group}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Symptoms */}
        {symptoms.length > 0 && (
          <div>
            <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
              <AlertCircle className="w-4 h-4" />
              Possible symptoms
            </h4>
            <ul className="space-y-2">
              {symptoms.map((symptom, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                  {symptom}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.aqi <= 50 && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              Air quality is good. No health impacts expected for the general population.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthImpactSection;
