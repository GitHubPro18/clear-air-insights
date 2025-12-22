import { createContext, useContext, useState, ReactNode } from "react";
import { AQIData } from "@/data/aqiData";

export interface AQIPollutants {
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
}

export interface SharedAQIData {
  city: string;
  aqi: number;
  pollutants: AQIPollutants;
  lastUpdated: Date;
  isLiveData: boolean;
}

interface AQIContextType {
  sharedAQIData: SharedAQIData | null;
  setSharedAQIData: (data: SharedAQIData | null) => void;
  updateFromAQIData: (aqiData: AQIData, isLive: boolean) => void;
}

const AQIContext = createContext<AQIContextType | undefined>(undefined);

export function AQIProvider({ children }: { children: ReactNode }) {
  const [sharedAQIData, setSharedAQIData] = useState<SharedAQIData | null>(null);

  const updateFromAQIData = (aqiData: AQIData, isLive: boolean) => {
    setSharedAQIData({
      city: aqiData.city,
      aqi: aqiData.aqi,
      pollutants: {
        pm25: aqiData.pollutants.pm25,
        pm10: aqiData.pollutants.pm10,
        no2: aqiData.pollutants.no2,
        so2: aqiData.pollutants.so2,
        co: aqiData.pollutants.co,
        o3: aqiData.pollutants.o3,
      },
      lastUpdated: new Date(aqiData.lastUpdated),
      isLiveData: isLive,
    });
  };

  return (
    <AQIContext.Provider value={{ sharedAQIData, setSharedAQIData, updateFromAQIData }}>
      {children}
    </AQIContext.Provider>
  );
}

export function useAQI() {
  const context = useContext(AQIContext);
  if (context === undefined) {
    throw new Error("useAQI must be used within an AQIProvider");
  }
  return context;
}
