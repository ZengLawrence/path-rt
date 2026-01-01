import { describe, test, expect } from 'vitest';
import { scheduleType } from "./schedules";

describe('Schedule type', () => {
  const January = 0;

  test('Monday to Friday 6am to 11pm (exclusive) should return "weekday" schedule', () => {
    expect(scheduleType(new Date(2026, January, 5, 10, 0))).toEqual('weekday');
    expect(scheduleType(new Date(2026, January, 6, 6, 0))).toEqual('weekday');
    expect(scheduleType(new Date(2026, January, 7, 8, 45))).toEqual('weekday');
    expect(scheduleType(new Date(2026, January, 8, 20, 15))).toEqual('weekday');
    expect(scheduleType(new Date(2026, January, 9, 22, 59))).toEqual('weekday');
  });

  test('Monday to Friday 11pm to 6am (exclusive) should return "weeknight" schedule', () => {
    expect(scheduleType(new Date(2026, January, 5, 23, 0))).toEqual('weeknight');
    expect(scheduleType(new Date(2026, January, 6, 0, 30))).toEqual('weeknight');
    expect(scheduleType(new Date(2026, January, 7, 5, 59))).toEqual('weeknight');
    expect(scheduleType(new Date(2026, January, 8, 4, 15))).toEqual('weeknight');
    expect(scheduleType(new Date(2026, January, 9, 23, 0))).toEqual('weeknight');
  });

  test('New year\'s day should return "holiday" schedule', () => {
    expect(scheduleType(new Date(2026, January, 1, 10, 0))).toEqual('holiday');
  });

  test('Independence day should return "holiday" schedule', () => {
    const July = 6;
    expect(scheduleType(new Date(2025, July, 4, 15, 30))).toEqual('holiday');
  });

  test('Christmas day should return "holiday" schedule', () => {
    const December = 11;
    expect(scheduleType(new Date(2026, December, 25, 9, 45))).toEqual('holiday');
  });

  test('Weekend all day should return "weekend" schedule', () => {
    expect(scheduleType(new Date(2026, January, 10, 0, 0))).toEqual('weekend');
    expect(scheduleType(new Date(2026, January, 10, 10, 0))).toEqual('weekend');
    expect(scheduleType(new Date(2026, January, 10, 23, 59))).toEqual('weekend');
    expect(scheduleType(new Date(2026, January, 11, 0, 0))).toEqual('weekend');
    expect(scheduleType(new Date(2026, January, 11, 14, 30))).toEqual('weekend');
    expect(scheduleType(new Date(2026, January, 11, 23, 59))).toEqual('weekend');
  });
});