export interface StorageTripSelection {
  key1: string;
  key2: string;
  lockDirection?: boolean;
}

export function saveTripSelection(trip: StorageTripSelection): void {
  const { key1, key2, lockDirection } = trip;
  const tripJson = JSON.stringify({ key1, key2, lockDirection });
  localStorage.setItem('tripSelection', tripJson);
}

function isStorageTripSelection(obj: unknown): obj is StorageTripSelection {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'key1' in obj &&
    typeof obj.key1 === 'string' &&
    'key2' in obj &&
    typeof obj.key2 === 'string'
  );
}

export function loadTripSelection(): StorageTripSelection {
  const tripJson = localStorage.getItem('tripSelection');
  if (tripJson) {
    const obj = JSON.parse(tripJson) as unknown;
    if (isStorageTripSelection(obj)) {
      const { key1, key2, lockDirection } = obj;
      if (typeof lockDirection === 'boolean') {
        return ({ key1, key2, lockDirection });
      } else {
        return ({ key1, key2 });
      }
    }
  }

  return ({
    key1: 'all',
    key2: 'all',
  });
}