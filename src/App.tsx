import Container from 'react-bootstrap/Container';
import StationCard from './components/StationCard';
import { useGeoLocation, useSchedule } from './hooks';
import { nearestStations } from './models';

function App() {
  const schedule = useSchedule();
  const { stations, lastUpdated } = schedule;
  const currentLocation = useGeoLocation();

  return (
    <Container>
      <h1 className="text-center">NJ Path</h1>
      <p>Last updated: {lastUpdated ? lastUpdated.toLocaleString() : "Pending..."}</p>
      {nearestStations(currentLocation?.coords, stations).map((station) => (
        <StationCard key={station.key} station={station} />
      ))}
    </Container>
  )
}

export default App
