import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import StationCard from './components/StationCard';
import TripSelect from './components/TripSelect';
import { useGeoLocation, useSchedule } from './hooks';
import { addDistanceToLocation, allStationKeysAndNames } from './models';
import { getDestinationTargets } from './models/maps';
import { scheduleType } from "./models/schedules";
import type { Station } from './models/Station';

function byName(a: { name: string }, b: { name: string }) {
  return a.name.localeCompare(b.name);
}

function App() {
  const { stations, lastUpdated } = useSchedule();

  const stationsWithAllOption = [{ key: "all", name: "All" }].concat(allStationKeysAndNames().sort(byName));
  const [selectedStationKeys, setSelectedStationKeys] = useState({ key1: "all", key2: "all" });
  const [trip, setTrip] = useState({ from: "all", to: "all" });
  const location = useGeoLocation();

  const handleStationsChange = (selected: { key1: string, key2: string }) => {
    setSelectedStationKeys(selected);
    if (location && selected.key1 !== "all" && selected.key2 !== "all") {
      const orderedTrip = [{key: selected.key1}, {key: selected.key2}]
        .map(station => addDistanceToLocation(station, location))
        .sort((a, b) => a.distance - b.distance)
        .map(({ station }) => station.key);
      setTrip({ from: orderedTrip[0], to: orderedTrip[1] });
    } else {
      setTrip({ from: selected.key1, to: selected.key2 });
  }
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
      const targets = getDestinationTargets(from, to, scheduleType(new Date()))
        .filter(segment => segment.key == station.key)
        .map(segment => segment.target);
      const targetedTrains = station.trains.filter(train => targets.includes(train.target));
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
