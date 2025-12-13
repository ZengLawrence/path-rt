import type { Station } from "../models/Station";

interface RidePathResponse {
  results: {
    consideredStation: string;
    destinations: {
      messages: {
        headSign: string;
        arrivalTimeMessage: string;
      }[];
    }[];
  }[];
}

function parseStationData(data: RidePathResponse): Station[] {
  return data.results.map((station) => ({
    name: station.consideredStation,
    trains: station.destinations.flatMap((destination) => (
      destination.messages.map((message) => ({
        headSign: message.headSign,
        arrivalTimeMessage: message.arrivalTimeMessage,
      }))
    )),
  }));
}

function filterNewportOrWTC(stations: Station[]): Station[] {
  return stations.filter(station => station.name === "NEW" || station.name === "WTC");
}


export async function fetchStations(): Promise<Station[]> {
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  };
  const response = await fetch('bin/portauthority/ridepath.json', options);
  const data = await response.json() as unknown as RidePathResponse;
  return filterNewportOrWTC(parseStationData(data));
}
