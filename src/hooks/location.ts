import { useEffect, useReducer } from "react";
import type { GeoCoordinate } from "../models/GeoCoordinate";

export type LocationStatus = "unavailable" | "found";

interface LocationState {
  currentLocation: GeoCoordinate | null;
  status: LocationStatus;
}

type LocationAction =
  | { type: "update-location", payload: GeoCoordinate }
  | { type: "reset-location" };

function reducer(state: LocationState, action: LocationAction): LocationState {
  switch (action.type) {
    case "update-location":
      return { currentLocation: action.payload, status: "found" };
    case "reset-location":
      return { currentLocation: null, status: "unavailable" };
    default:
      return state;
  }
}

const initialState: LocationState = {
  currentLocation: null,
  status: "unavailable",
};

export function useGeoLocation() {
  const [
    { currentLocation, status },
    dispatch
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    const geoError = (error: GeolocationPositionError) => {
      dispatch({ type: "reset-location" });
      console.error("Error obtaining geolocation:", `ERROR(${error.code.toFixed()}): ${error.message}`);
    };
    const geoOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 500,
      maximumAge: 60000
    };
    const handlePositionChanged = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      dispatch({ type: "update-location", payload: { latitude, longitude } });
    };
    const watchId = navigator.geolocation.watchPosition(handlePositionChanged, geoError, geoOptions);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);
  return { currentLocation, status };
}
