import { useCallback, useEffect, useReducer } from "react";
import type { Station } from "../models/Station";
import { fetchStations } from "../services";

export interface Schedule {
  stations: Station[];
  lastUpdated: Date | null;
  isStale?: boolean;
}

type ScheduleAction =
  | { type: 'update-schedule', payload: Station[] }
  | { type: 'stale-schedule' };

function reducer(state: Schedule, action: ScheduleAction): Schedule {
  switch (action.type) {
    case "update-schedule":
      return { stations: action.payload, lastUpdated: new Date(), isStale: false };
    case "stale-schedule":
      return { ...state, isStale: true };
    default:
      return state;
  }
}

const initialState: Schedule = { stations: [], lastUpdated: null };

export function useSchedule() {
  const [schedule, dispatch] = useReducer(reducer, initialState);

  const loadSchedule = useCallback(() => {
    fetchStations().then((stations) => {
      dispatch({ type: "update-schedule", payload: stations });
    }).catch((error: unknown) => {
      dispatch({ type: "stale-schedule" });
      console.log("Error fetching stations:", error);
    });
  }, [dispatch]);

  useEffect(() => {
    loadSchedule();
    const intervalId = setInterval(() => {
      loadSchedule();
    }, 1 * 60 * 1000); // Refresh every 1 minute

    return () => {
      clearInterval(intervalId);
    };
  }, [loadSchedule]);

  return { schedule, loadSchedule };
}
