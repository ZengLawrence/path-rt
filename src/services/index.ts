import type { Station } from "../models/Station";
import stationsJson from "../models/stations.json";

const stations: Record<string, { name: string } | null> = stationsJson;

interface RidePathResponse {
  results: {
    consideredStation: string;
    destinations: {
      messages: {
        target: string;
        headSign: string;
        arrivalTimeMessage: string;
      }[];
    }[];
  }[];
}

function parseStationData(data: RidePathResponse): Station[] {
  return data.results.map((station) => ({
    key: station.consideredStation,
    name: stations[station.consideredStation]?.name ?? station.consideredStation,
    trains: station.destinations.flatMap((destination) => (
      destination.messages.map((message) => ({
        headSign: message.headSign,
        arrivalTimeMessage: message.arrivalTimeMessage,
        target: message.target,
      }))
    )),
  }));
}

export async function fetchStations(): Promise<Station[]> {
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    signal: AbortSignal.timeout(5000),
  };
  const response = await fetch('bin/portauthority/ridepath.json', options);
  const data = await response.json() as unknown as RidePathResponse;
  return parseStationData(data);
}
