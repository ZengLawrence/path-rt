import stationCoordsJson from './stations.json';
import type { GeoCoordinate } from './GeoCoordinate';
import type { Station } from './Station';

const stationsData: Record<string, GeoCoordinate | null> = stationCoordsJson;

export function nearestStations(
  location: GeoCoordinate | undefined,
  stations: Station[]
): Station[] {
  if (stations.length === 0 || !location) {
    return [];
  }

  const stationsWithDistance = stations.map((station) => {
    const coords = stationsData[station.name];
    if (!coords) {
      return { station, distance: Infinity };
    }
    const distance = Math.sqrt(
      Math.pow(coords.latitude - location.latitude, 2) +
      Math.pow(coords.longitude - location.longitude, 2)
    );
    return { station, distance };
  });

  stationsWithDistance.sort((a, b) => a.distance - b.distance);

  return stationsWithDistance.map(({ station }) => station);
}