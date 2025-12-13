import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import StationCard from './components/StationCard';
import type { Station } from './models/Station';
import { fetchStations } from './services';

function App() {
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    const loadStations = async () => {
      const stations = await fetchStations();
      setStations(stations);
    };
    void loadStations();
  }, []);

  return (
    <Container>
      <h1 className="text-center">Real Time Train Departures</h1>
      {stations.map((station) => (
        <StationCard key={station.name} station={station} />
      ))}
    </Container>
  )
}

export default App
