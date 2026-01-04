import { describe, test, expect } from 'vitest';
import { getDestinationTargets } from './maps';

describe('Weekday schedule', () => {
  test('WTC to NEW should return HOB target for WTC', () => {
    expect(getDestinationTargets('WTC', 'NEW')).toEqual(expect.arrayContaining([
      { key: 'WTC', target: 'HOB' },
      expect.objectContaining({ key: 'WTC', target: 'NWK' }),
    ]));
  });
});

describe('weeknight/holiday schedule', () => {
  test('WTC to NEW should return NWK target for WTC', () => {
    const expectedTargets = [
      expect.objectContaining({ key: 'WTC', target: 'NWK' }),
    ];
    expect(getDestinationTargets('WTC', 'NEW', 'weeknight')).toEqual(expectedTargets);
    expect(getDestinationTargets('WTC', 'NEW', 'holiday')).toEqual(expectedTargets);
  });
});

describe('Weekend schedule', () => {
  test('WTC to NEW should return NWK target for WTC', () => {
    expect(getDestinationTargets('WTC', 'NEW', 'weekend')).toEqual([
      expect.objectContaining({ key: 'WTC', target: 'NWK' }),
    ]);
  });

  test('JSQ to 23S should return 33S target for JSQ', () => {
    expect(getDestinationTargets('JSQ', '23S', 'weekend')).toEqual([
      { key: 'JSQ', target: '33S' },
    ]);
  });
});

describe('Multiple routes', () => {
  test('23S to EXP on weekday should return HOB and JSQ targets for 23S', () => {
    expect(getDestinationTargets('23S', 'EXP', 'weekday')).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: '23S', target: 'JSQ' }),
      expect.objectContaining({ key: '23S', target: 'HOB' }),
    ]));
  });
});

describe('Transfer', () => {
  test('WTC to NEW should return transfer key GRV for WTC', () => {
    expect(getDestinationTargets('WTC', 'NEW', 'weekend')).toEqual([
      { key: 'WTC', target: 'NWK', transferKey: 'GRV' },
    ]);
  });
});
