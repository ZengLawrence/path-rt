import { describe, test, expect } from 'vitest';
import { getDestinationTargets } from './maps';

describe('Weekday schedule', () => {
  test('WTC to NEW should return HOK target for WTC and WTC target for NEW', () => {
    expect(getDestinationTargets('WTC', 'NEW')).toEqual([
      { key: 'WTC', target: 'HOK' },
      { key: 'NEW', target: 'WTC' },
    ]);
  });
});

describe('weeknight/holiday schedule', () => {
  test('WTC to NEW should return NWK target for WTC and JSQ target for NEW', () => {
    const expectedTargets = [
      { key: 'WTC', target: 'NWK' },
      { key: 'NEW', target: 'JSQ' },
    ];
    expect(getDestinationTargets('WTC', 'NEW', 'weeknight')).toEqual(expectedTargets);  
    expect(getDestinationTargets('WTC', 'NEW', 'holiday')).toEqual(expectedTargets);
  });
});