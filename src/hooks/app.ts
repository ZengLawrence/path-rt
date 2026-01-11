import { useCallback, useState } from "react";
import { useGeoLocation, type LocationStatus } from "./location";
import { useSchedule } from './services';
import { addDistanceToLocation, getStationName } from '../models';
import type { GeoCoordinate } from '../models/GeoCoordinate';
import { getDestinationTargets, type DestinationTarget } from '../models/maps';
import { scheduleType } from "../models/schedules";
import type { Station, Train } from '../models/Station';

function byName(a: { name: string }, b: { name: string }) {
  return a.name.localeCompare(b.name);
}

function getTransferKey(targets: DestinationTarget[], target: string) {
  for (const dt of targets) {
    if (dt.target == target) {
      return dt.transferKey;
    }
  }
  return undefined;
}

function orderDirectionByLocation(
  { key1, key2, lockDirection }: { key1: string; key2: string; lockDirection?: boolean; },
  location: GeoCoordinate | null) {
  const orderByDistance = location && lockDirection !== true && key1 !== "all" && key2 !== "all";
  if (orderByDistance) {
    const orderedTrip = [{ key: key1 }, { key: key2 }]
      .map(station => addDistanceToLocation(station, location))
      .sort((a, b) => a.distance - b.distance)
      .map(({ station }) => station.key);
    return { from: orderedTrip[0], to: orderedTrip[1] };
  } else {
    return { from: key1, to: key2 };
  }
}

function isStartingStation(station: { key: string }, { from }: { from: string }) {
  return (from === "all" || station.key === from);
};

function destinationTargets({ from, to }: { from: string; to: string; }): DestinationTarget[] {
  if (from == "all" || to == "all" || from == to) {
    return [];
  } else {
    const allRoutes = getDestinationTargets(from, to, scheduleType(new Date()));
    const directRoutes = allRoutes.filter(route => route.transferKey === undefined);
    if (directRoutes.length > 0) {
      return directRoutes;
    }
    return allRoutes;
  }
}

function limitToTargets(station: Station, destTargets: DestinationTarget[]): Station {
  // no destination target, return all trains
  if (destTargets.length == 0) return station;

  const byTarget = (train: Train) => {
    const targets = destTargets.map(segment => segment.target);
    return targets.includes(train.target);
  }
  const targetedTrains = station.trains.filter(byTarget)
  return { ...station, trains: targetedTrains };
}

function addTransferStation(station: Station, destTargets: DestinationTarget[]) {
  const withTransferStation = (train: Train) => {
    const transferKey = getTransferKey(destTargets, train.target);
    if (transferKey) {
      const transferStation = getStationName(transferKey);
      return { ...train, transferStation };
    }
    return train;
  }
  const targetedTrains = station.trains.map(withTransferStation);
  return { ...station, trains: targetedTrains };
}

export interface TripSelection {
  key1: string;
  key2: string;
  lockDirection?: boolean;
}

export function useAppState(initialState: TripSelection | (() => TripSelection)) {
  const { stations, lastUpdated } = useSchedule();
  const [selectedStationKeys, setSelectedStationKeys] = useState(initialState);
  const [showAlert, setShowAlert] = useState(false);

  const locationStatusCallback = useCallback((status: LocationStatus) => {
    if (status === "unavailable") {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [setShowAlert]);
  const currentLocation = useGeoLocation(locationStatusCallback);

  const trip = orderDirectionByLocation(selectedStationKeys, currentLocation);
  const destTargets = destinationTargets(trip);
  const displayedStations = stations.sort(byName)
    .filter(station => isStartingStation(station, trip))
    .map(station => limitToTargets(station, destTargets))
    .map(station => addTransferStation(station, destTargets));

  const closeAlert = () => { setShowAlert(false); };
  return {
    lastUpdated,
    selectedStationKeys, setSelectedStationKeys,
    displayedStations,
    showAlert, closeAlert,
  }
}