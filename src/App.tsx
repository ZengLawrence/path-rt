import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import StationCard from './components/StationCard';
import type { Station } from './models/Station';
import { fetchStations } from './services';
import { nearestStations } from './models';

function App() {
  const [stations, setStations] = useState<Station[]>([]);
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const loadStations = () => {
      fetchStations().then((stations) => {
        setStations(stations);
        setLastUpdated(new Date());
      }).catch((error: unknown) => {
        console.log("Error fetching stations:", error);
      });
    };
    loadStations();
    const intervalId = setInterval(() => {
      loadStations();
    }, 1 * 60 * 1000); // Refresh every 1 minute

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const geoError = (error: GeolocationPositionError) => {
      console.error("Error obtaining geolocation:", `ERROR(${error.code.toFixed()}): ${error.message}`);
    }
    const geoOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 500,
      maximumAge: 60000
    };
    const watchId = navigator.geolocation.watchPosition(setCurrentLocation, geoError, geoOptions);
    
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <Container>
      <h1 className="text-center">Real Time Train Departures</h1>
      <p>Last updated: {lastUpdated ? lastUpdated.toLocaleString() : "Pending..."}</p>
      {nearestStations(currentLocation?.coords, stations).map((station) => (
        <StationCard key={station.key} station={station} />
      ))}
    </Container>
  )
}

export default App
