import { useState, useEffect } from "react";
import type { GeoCoordinate } from "../models/GeoCoordinate";

export type LocationStatus = "unavailable" | "found";

export function useGeoLocation(statusChangedCallback: (status: LocationStatus) => void = () => { /* do nothing */ }) {
  const [currentLocation, setCurrentLocation] = useState<GeoCoordinate | null>(null);

  useEffect(() => {
    const geoError = (error: GeolocationPositionError) => {
      setCurrentLocation(null);
      statusChangedCallback("unavailable");
      console.error("Error obtaining geolocation:", `ERROR(${error.code.toFixed()}): ${error.message}`);
    };
    const geoOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 500,
      maximumAge: 60000
    };
    const handlePositionChanged = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setCurrentLocation({ latitude, longitude });
      statusChangedCallback("found");
    };
    const watchId = navigator.geolocation.watchPosition(handlePositionChanged, geoError, geoOptions);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [statusChangedCallback]);
  return currentLocation;
}
