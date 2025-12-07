import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import StationCard from './components/StationCard';
import type { Station } from './models/Station';

function parseStationData(data: any): Station[] {
  return data.results.map((station: any) => ({
    name: station.consideredStation,
    trains: station.destinations.flatMap((destination: any) => (
      destination.messages.map((message: any) => ({
        headSign: message.headSign,
        arrivalTimeMessage: message.arrivalTimeMessage,
      }))
    )),
  }));
}

function filterNewportOrWTC(stations: Station[]): Station[] {
  return stations.filter(station => station.name === "NEW" || station.name === "WTC");
}

function App() {
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    async function fetchStations() {
      const options = { 
        method: 'GET',
        headers: { 
          'Accept': 'application/json'
        }
      };
      const response = await fetch('bin/portauthority/ridepath.json', options);
      const data = await response.json();
      const stations = filterNewportOrWTC(parseStationData(data));
      setStations(stations);
    }
    fetchStations();
  }, []);

  return (
    <Container>
      <h1 className="text-center">Real Time Train Departures</h1>
      {stations.map((station, index) => (
        <StationCard key={index} station={station} />
      ))}
    </Container>
  )
}

export default App
