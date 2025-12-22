import { AQIData, getAQICategory } from "@/data/aqiData";
import { MapPin, Clock } from "lucide-react";

interface AQISummaryCardProps {
  data: AQIData;
}

const AQISummaryCard = ({ data }: AQISummaryCardProps) => {
  const category = getAQICategory(data.aqi);
  
  const getGradientStyle = () => {
    if (data.aqi <= 50) return "from-emerald-500 to-emerald-600";
    if (data.aqi <= 100) return "from-lime-500 to-lime-600";
    if (data.aqi <= 200) return "from-yellow-500 to-amber-500";
    if (data.aqi <= 300) return "from-orange-500 to-orange-600";
    if (data.aqi <= 400) return "from-red-500 to-red-600";
    return "from-red-800 to-red-900";
  };

  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getGradientStyle()} p-8 shadow-elevated`}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/20 blur-2xl" />
      </div>
      
      <div className="relative z-10">
        {/* City and timestamp */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="w-5 h-5" />
            <span className="text-lg font-medium">{data.city}</span>
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Clock className="w-4 h-4" />
            <span>{formatLastUpdated(data.lastUpdated)}</span>
          </div>
        </div>

        {/* Main AQI Display */}
        <div className="flex items-center gap-8">
          <div className="relative">
            <div className="w-36 h-36 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
              <div className="text-center">
                <span className="block text-5xl font-bold text-white font-heading">{data.aqi}</span>
                <span className="block text-sm text-white/80 mt-1">AQI</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white font-heading mb-2">
              {category.label}
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Air Quality Index based on India's National Air Quality Standards (NAAQS)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AQISummaryCard;
