import { useEffect, useState } from "react";
import type { Station } from "../models/Station";
import { fetchStations } from "../services";
import type { GeoCoordinate } from "../models/GeoCoordinate";

export interface Schedule {
  stations: Station[];
  lastUpdated: Date | null;
}

export function useSchedule() {
  const [schedule, setSchedule] = useState<Schedule>({ stations: [], lastUpdated: null });

    useEffect(() => {
      const loadStations = () => {
        fetchStations().then((stations) => {
          setSchedule({ stations, lastUpdated: new Date() });
        }).catch((error: unknown) => {
          console.log("Error fetching stations:", error);
        });
      };
      loadStations();
      const intervalId = setInterval(() => {
        loadStations();
      }, 1 * 60 * 1000); // Refresh every 1 minute
  
      return () => {
        clearInterval(intervalId);
      };
    }, []);
  
  return schedule;
}

export function useGeoLocation() {
  const [currentLocation, setCurrentLocation] = useState<GeoCoordinate | null>(null);

  useEffect(() => {
    const geoError = (error: GeolocationPositionError) => {
      console.error("Error obtaining geolocation:", `ERROR(${error.code.toFixed()}): ${error.message}`);
    }
    const geoOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 500,
      maximumAge: 60000
    };
    const handlePositionChanged = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setCurrentLocation({ latitude, longitude });
    };
    const watchId = navigator.geolocation.watchPosition(handlePositionChanged, geoError, geoOptions);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);
  return currentLocation;
}