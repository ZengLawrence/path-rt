import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import { loadTripSelection, saveTripSelection } from './app/localStorage';
import SelectTripForm from './components/SelectTripForm';
import StationCard from './components/StationCard';
import { useGeoLocation, useSchedule } from './hooks';
import { addDistanceToLocation, allStationKeysAndNames, getStationName } from './models';
import type { GeoCoordinate } from './models/GeoCoordinate';
import { getDestinationTargets, type DestinationTarget } from './models/maps';
import { scheduleType } from "./models/schedules";
import type { Station, Train } from './models/Station';

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

function addTransferStation(train: Train, transferKey: string | undefined) {
  if (transferKey) {
    const transferStation = getStationName(transferKey);
    return { ...train, transferStation };
  }
  return train;
}

function orderTripByLocation(selected: { key1: string, key2: string; lockDirection?: boolean; }, location: GeoCoordinate | null) {
  const orderByDistance = location
    && !selected.lockDirection
    && selected.key1 !== "all"
    && selected.key2 !== "all";
  if (orderByDistance) {
    const orderedTrip = [{ key: selected.key1 }, { key: selected.key2 }]
      .map(station => addDistanceToLocation(station, location))
      .sort((a, b) => a.distance - b.distance)
      .map(({ station }) => station.key);
    return { from: orderedTrip[0], to: orderedTrip[1] };
  } else {
    return { from: selected.key1, to: selected.key2 };
  }
}

function isStartingStation(station: { key: string }, trip: { from: string }) {
  const { from } = trip;
  return (from === "all" || station.key === from);
};

function destinationTargets({ from, to }: { from: string; to: string; }): DestinationTarget[] {
  if (from == "all" || to == "all" || from == to) {
    return [];
  } else {
    return getDestinationTargets(from, to, scheduleType(new Date()));
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

function addStationTransferStation(station: Station, destTargets: DestinationTarget[]) {
  const withTransferStation = (train: Train) => {
    return addTransferStation(train, getTransferKey(destTargets, train.target));
  }
  const targetedTrains = station.trains.map(withTransferStation);
  return { ...station, trains: targetedTrains };
}


function App() {
  const { stations, lastUpdated } = useSchedule();

  const stationsWithAllOption = [{ key: "all", name: "All" }].concat(allStationKeysAndNames().sort(byName));
  const [selectedStationKeys, setSelectedStationKeys] = useState(() => loadTripSelection());
  const location = useGeoLocation();

  const handleStationsChange = (selected: { key1: string, key2: string; lockDirection?: boolean; }) => {
    setSelectedStationKeys(selected);
    saveTripSelection(selected);
  };

  const trip = orderTripByLocation(selectedStationKeys, location);
  const destTargets = destinationTargets(trip);
  const displayedStations = stations.sort(byName)
    .filter(station => isStartingStation(station, trip))
    .map(station => limitToTargets(station, destTargets))
    .map(station => addStationTransferStation(station, destTargets));

  return (
    <Container>
      <h1 className="text-center">NJ Path</h1>
      <SelectTripForm
        stations={stationsWithAllOption}
        selected={selectedStationKeys}
        onChange={handleStationsChange}
      />
      <p className='mt-2'>Last updated: {lastUpdated ? lastUpdated.toLocaleString() : "Pending..."}</p>
      {displayedStations.map((station) => (
        <StationCard key={station.key} station={station} />
      ))}
    </Container>
  )
}

export default App
