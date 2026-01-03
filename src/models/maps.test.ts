import { describe, test, expect } from 'vitest';
import { getDestinationTargets } from './maps';

describe('Weekday schedule', () => {
  test('WTC to NEW should return HOB target for WTC', () => {
    expect(getDestinationTargets('WTC', 'NEW')).toEqual(expect.arrayContaining([
      { key: 'WTC', target: 'HOB' },
      { key: 'WTC', target: 'NWK' },
    ]));
  });
});

describe('weeknight/holiday schedule', () => {
  test('WTC to NEW should return NWK target for WTC', () => {
    const expectedTargets = [
      { key: 'WTC', target: 'NWK' },
    ];
    expect(getDestinationTargets('WTC', 'NEW', 'weeknight')).toEqual(expectedTargets);
    expect(getDestinationTargets('WTC', 'NEW', 'holiday')).toEqual(expectedTargets);
  });
});

describe('Weekend schedule', () => {
  test('WTC to NEW should return NWK target for WTC', () => {
    expect(getDestinationTargets('WTC', 'NEW', 'weekend')).toEqual([
      { key: 'WTC', target: 'NWK' },
    ]);
  });
});

describe('Multiple routes', () => {
  test('23S to EXP on weekday should return HOB and JSQ targets for 23S', () => {
    expect(getDestinationTargets('23S', 'EXP', 'weekday')).toEqual(expect.arrayContaining([
      { key: '23S', target: 'JSQ' },
      { key: '23S', target: 'HOB' },
    ]));
  });
});