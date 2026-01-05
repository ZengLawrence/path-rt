import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { loadTripSelection, saveTripSelection } from './app/localStorage';
import StationCard from './components/StationCard';
import TripSelect from './components/TripSelect';
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

function orderTripByLocation(selected: { key1: string, key2: string }, location: GeoCoordinate | null) {
  if (location && selected.key1 !== "all" && selected.key2 !== "all") {
    const orderedTrip = [{ key: selected.key1 }, { key: selected.key2 }]
      .map(station => addDistanceToLocation(station, location))
      .sort((a, b) => a.distance - b.distance)
      .map(({ station }) => station.key);
    return { from: orderedTrip[0], to: orderedTrip[1] };
  } else {
    return { from: selected.key1, to: selected.key2 };
  }
}

function App() {
  const { stations, lastUpdated } = useSchedule();

  const stationsWithAllOption = [{ key: "all", name: "All" }].concat(allStationKeysAndNames().sort(byName));
  const [selectedStationKeys, setSelectedStationKeys] = useState(() => loadTripSelection());
  const location = useGeoLocation();
  const [trip, setTrip] = useState(() => orderTripByLocation(selectedStationKeys, location));

  useEffect(() => {
    setTrip(orderTripByLocation(selectedStationKeys, location));
  }, [selectedStationKeys, location]);

  const handleStationsChange = (selected: { key1: string, key2: string }) => {
    setSelectedStationKeys(selected);
    saveTripSelection(selected);
  };

  const byStartingStation = (station: { key: string }) => {
    const { from } = trip;
    return (from === "all" || station.key === from);
  };

  const withTargets = (station: Station) => {
    const { from, to } = trip;
    if (from == "all" || to == "all" || from == to) {
      return station;
    } else {
      const destTargets = getDestinationTargets(from, to, scheduleType(new Date()));
      const targets = destTargets.map(segment => segment.target);
      const targetedTrains = station.trains
        .filter(train => targets.includes(train.target))
        .map(train => addTransferStation(train, getTransferKey(destTargets, train.target)));
      return { ...station, trains: targetedTrains };
    }
  }

  return (
    <Container>
      <h1 className="text-center">NJ Path</h1>
      <TripSelect stations={stationsWithAllOption} selected={selectedStationKeys} onChange={handleStationsChange} />
      <p className='mt-2'>Last updated: {lastUpdated ? lastUpdated.toLocaleString() : "Pending..."}</p>
      {stations.sort(byName)
        .filter(byStartingStation)
        .map(withTargets)
        .map((station) => (
          <StationCard key={station.key} station={station} />
        ))}
    </Container>
  )
}

export default App
