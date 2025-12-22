import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { getMockAQIHistory, AQIHistoryPoint, getAQICategory } from "@/data/aqiData";

interface AQITrendChartProps {
  city: string;
  history24h?: AQIHistoryPoint[];
}

const AQITrendChart = ({ city, history24h }: AQITrendChartProps) => {
  const [period, setPeriod] = useState<'24h' | '7d'>('24h');
  const [data, setData] = useState<AQIHistoryPoint[]>([]);

  useEffect(() => {
    if (period === '24h' && history24h && history24h.length > 0) {
      // Use live data if available
      setData(history24h);
    } else {
      // Fall back to mock data
      setData(getMockAQIHistory(city, period));
    }
  }, [city, period, history24h]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const aqi = payload[0].value;
      const category = getAQICategory(aqi);
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{payload[0].payload.label}</p>
          <p className="text-lg font-bold" style={{ color: category.color }}>
            AQI: {aqi}
          </p>
          <p className="text-xs text-muted-foreground">{category.label}</p>
        </div>
      );
    }
    return null;
  };

  // Calculate min/max for better visualization
  const aqiValues = data.map(d => d.aqi);
  const minAQI = Math.max(0, Math.min(...aqiValues) - 20);
  const maxAQI = Math.min(500, Math.max(...aqiValues) + 20);

  return (
    <Card className="border-border shadow-soft">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            AQI Trend
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant={period === '24h' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('24h')}
              className="text-xs px-3"
            >
              24 Hours
            </Button>
            <Button
              variant={period === '7d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('7d')}
              className="text-xs px-3"
            >
              7 Days
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                interval={period === '24h' ? 3 : 0}
              />
              <YAxis
                domain={[minAQI, maxAQI]}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Reference lines for AQI thresholds */}
              <ReferenceLine y={50} stroke="#10B981" strokeDasharray="5 5" opacity={0.5} />
              <ReferenceLine y={100} stroke="#84CC16" strokeDasharray="5 5" opacity={0.5} />
              <ReferenceLine y={200} stroke="#EAB308" strokeDasharray="5 5" opacity={0.5} />
              <ReferenceLine y={300} stroke="#F97316" strokeDasharray="5 5" opacity={0.5} />
              
              <Line
                type="monotone"
                dataKey="aqi"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                activeDot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: 'hsl(var(--background))', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend for thresholds */}
        <div className="flex flex-wrap justify-center gap-3 mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-6 h-0.5 bg-emerald-500" style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, hsl(var(--background)) 50%)', backgroundSize: '6px 100%' }} />
            <span>Good (50)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-6 h-0.5 bg-lime-500" style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, hsl(var(--background)) 50%)', backgroundSize: '6px 100%' }} />
            <span>Satisfactory (100)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-6 h-0.5 bg-yellow-500" style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, hsl(var(--background)) 50%)', backgroundSize: '6px 100%' }} />
            <span>Moderate (200)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-6 h-0.5 bg-orange-500" style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, hsl(var(--background)) 50%)', backgroundSize: '6px 100%' }} />
            <span>Poor (300)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AQITrendChart;
