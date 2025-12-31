import stationCoordsJson from './stations.json';
import type { GeoCoordinate } from './GeoCoordinate';
import type { Station } from './Station';

interface StationCoords extends GeoCoordinate {
  name: string;
}

const stationsData: Record<string, StationCoords> = stationCoordsJson;

function distanceBetween(a: GeoCoordinate, b: GeoCoordinate): number {
  return Math.sqrt(
    Math.pow(b.latitude - a.latitude, 2) +
    Math.pow(b.longitude - a.longitude, 2)
  );
}

function addDistanceToLocation(station: Station, location: GeoCoordinate): { station: Station; distance: number } {
  const coords = stationsData[station.key];
  const distance = distanceBetween(coords, location);
  return { station, distance };
};

function byDistance(a: { distance: number }, b: { distance: number }) {
  return a.distance - b.distance;
}

export function sortByDistance(
  location: GeoCoordinate | undefined,
  stations: Station[]
): Station[] {
  if (stations.length === 0 || !location) {
    return [];
  }

  return stations.map((station) => addDistanceToLocation(station, location))
    .sort(byDistance)
    .map(({ station }) => station);
}

export function allStationKeysAndNames() {
  return Object.entries(stationsData).map(([key, station]) => ({ key, name: station.name }));
}