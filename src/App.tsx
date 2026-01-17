import { ArrowClockwise } from 'react-bootstrap-icons';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { loadTripSelection, saveTripSelection } from './app/localStorage';
import SelectTripForm from './components/SelectTripForm';
import StationCard from './components/StationCard';
import { useAppState } from './hooks/app';
import { allStationKeysAndNames } from './models';

function byName(a: { name: string }, b: { name: string }) {
  return a.name.localeCompare(b.name);
}

function LastUpdatedPanel(
  {
    lastUpdated,
    refreshSchedule,
    isStale,
  }: {
    lastUpdated: Date | null;
    refreshSchedule: () => void;
    isStale?: boolean;
  }
) {

  const className = (isStale ? "bg-warning" : "");
  const updatedTimeSpan = <span className={className}>{lastUpdated?.toLocaleString()}</span>;

  return (<div className="mb-2">
    <span className="me-2">
      Last updated: {lastUpdated ? updatedTimeSpan : "Pending..."}
    </span>
    <Button
      variant="outline-secondary"
      onClick={refreshSchedule}
    >
      <ArrowClockwise />
    </Button>
  </div>);
}

function App() {
  const {
    lastUpdated, isStale,
    selectedStationKeys, setSelectedStationKeys,
    displayedStations,
    showAlert, closeAlert,
    refreshSchedule
  } = useAppState(() => loadTripSelection())

  const handleTripSelectionChange = (selected: { key1: string, key2: string; lockDirection?: boolean; }) => {
    setSelectedStationKeys(selected);
    saveTripSelection(selected);
  };

  const stationsWithAllOption = [{ key: "all", name: "All" }].concat(allStationKeysAndNames().sort(byName));

  return (
    <Container>
      <h1 className="text-center">NJ Path</h1>
      {showAlert &&
        <Alert
          variant="warning"
          dismissible
          onClose={closeAlert}
        >
          Location data is not available.
        </Alert>}
      <SelectTripForm
        stations={stationsWithAllOption}
        selected={selectedStationKeys}
        onChange={handleTripSelectionChange}
      />
      <LastUpdatedPanel 
        lastUpdated={lastUpdated} 
        refreshSchedule={refreshSchedule}
        isStale={isStale}
        />
      {displayedStations.map((station) => (
        <StationCard key={station.key} station={station} />
      ))}
    </Container>
  )
}

export default App
