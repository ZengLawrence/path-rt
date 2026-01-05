interface TripSelection {
  key1: string;
  key2: string;
}

export function saveTripSelection(trip: TripSelection): void {
  const tripJson = JSON.stringify(trip);
  localStorage.setItem('tripSelection', tripJson);
}

export function loadTripSelection(): TripSelection {
  const tripJson = localStorage.getItem('tripSelection');
  if (tripJson) {
    return JSON.parse(tripJson) as unknown as TripSelection;
  } else {
    return {
      key1: 'all',
      key2: 'all',
    }
  }
}