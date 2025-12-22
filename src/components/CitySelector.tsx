import { INDIAN_CITIES, City } from "@/data/aqiData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
}

const CitySelector = ({ selectedCity, onCityChange }: CitySelectorProps) => {
  return (
    <div className="flex items-center gap-3">
      <MapPin className="w-5 h-5 text-muted-foreground" />
      <Select value={selectedCity} onValueChange={onCityChange}>
        <SelectTrigger className="w-[200px] bg-card border-border">
          <SelectValue placeholder="Select a city" />
        </SelectTrigger>
        <SelectContent>
          {INDIAN_CITIES.map((city) => (
            <SelectItem key={city.name} value={city.name}>
              <span className="flex items-center gap-2">
                <span>{city.name}</span>
                <span className="text-xs text-muted-foreground">({city.state})</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CitySelector;
