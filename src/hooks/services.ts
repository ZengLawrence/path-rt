import { useEffect, useState } from "react";
import type { Station } from "../models/Station";
import { fetchStations } from "../services";

export interface Schedule {
  stations: Station[];
  lastUpdated: Date | null;
}

export function useSchedule() {
  const [schedule, setSchedule] = useState<Schedule>({ stations: [], lastUpdated: null });

  const loadSchedule = () => {
    fetchStations().then((stations) => {
      setSchedule({ stations, lastUpdated: new Date() });
    }).catch((error: unknown) => {
      console.log("Error fetching stations:", error);
    });
  };

  useEffect(() => {
    loadSchedule();
    const intervalId = setInterval(() => {
      loadSchedule();
    }, 1 * 60 * 1000); // Refresh every 1 minute

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return { schedule, loadSchedule };
}
