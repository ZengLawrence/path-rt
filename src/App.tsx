import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import StationCard from './components/StationCard';
import TripSelect from './components/TripSelect';
import { useGeoLocation, useSchedule } from './hooks';
import { allStationKeysAndNames, sortByDistance } from './models';
import { getDestinationTargets, getSchedule } from './models/maps';
import type { Station } from './models/Station';

function byName(a: { name: string }, b: { name: string }) {
  return a.name.localeCompare(b.name);
}

function App() {
  const { stations, lastUpdated } = useSchedule();
  const currentLocation = useGeoLocation();

  const stationsWithAllOption = [{ key: "all", name: "All" }].concat(allStationKeysAndNames().sort(byName));
  const [selectedStationKeys, setSelectedStationKeys] = useState({ key1: "all", key2: "all" });

  const bySelectedStations = (station: { key: string }) => {
    const { key1, key2 } = selectedStationKeys;
    return (key1 === "all" || station.key === key1) ||
      (key2 === "all" || station.key === key2);
  };

  const withTargets = (station: Station) => {
    const { key1, key2 } = selectedStationKeys;
    if (key1 == "all" || key2 == "all") {
      return station;
    } else {
      const targets = getDestinationTargets(key1, key2, getSchedule(new Date()))
        .filter(segment => segment.key == station.key)
        .map(segment => segment.target);
      const targetedTrains = station.trains.filter(train => targets.includes(train.target));
      return { ...station, trains: targetedTrains };
    }
  }

  return (
    <Container>
      <h1 className="text-center">NJ Path</h1>
      <TripSelect stations={stationsWithAllOption} selected={selectedStationKeys} onChange={setSelectedStationKeys} />
      <div className='mt-2'>Last updated: {lastUpdated ? lastUpdated.toLocaleString() : "Pending..."}</div>
      {sortByDistance(currentLocation?.coords, stations)
        .filter(bySelectedStations)
        .map(withTargets)
        .map((station) => (
          <StationCard key={station.key} station={station} />
        ))}
    </Container>
  )
}

export default App
