import Container from 'react-bootstrap/Container';
import { loadTripSelection, saveTripSelection } from './app/localStorage';
import SelectTripForm from './components/SelectTripForm';
import StationCard from './components/StationCard';
import { useAppState } from './hooks/app';
import { allStationKeysAndNames } from './models';

function byName(a: { name: string }, b: { name: string }) {
  return a.name.localeCompare(b.name);
}

function App() {
  const {
    lastUpdated,
    selectedStationKeys, setSelectedStationKeys,
    displayedStations
  } = useAppState(() => loadTripSelection())

  const handleTripSelectionChange = (selected: { key1: string, key2: string; lockDirection?: boolean; }) => {
    setSelectedStationKeys(selected);
    saveTripSelection(selected);
  };

  const stationsWithAllOption = [{ key: "all", name: "All" }].concat(allStationKeysAndNames().sort(byName));

  return (
    <Container>
      <h1 className="text-center">NJ Path</h1>
      <SelectTripForm
        stations={stationsWithAllOption}
        selected={selectedStationKeys}
        onChange={handleTripSelectionChange}
      />
      <p className='mt-2'>Last updated: {lastUpdated ? lastUpdated.toLocaleString() : "Pending..."}</p>
      {displayedStations.map((station) => (
        <StationCard key={station.key} station={station} />
      ))}
    </Container>
  )
}

export default App
