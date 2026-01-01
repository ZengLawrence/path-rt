
export function getSchedule(date: Date): 'weekday' | 'weeknight' | 'holiday' {
  const hour = date.getHours();
  const isHoliday = (date: Date): boolean => {
    const month = date.getMonth();
    const day = date.getDate();
    if ((month === 0 && day === 1) || // New Year's Day
      (month === 6 && day === 4) || // Independence Day
      (month === 11 && day === 25)) { // Christmas Day
      return true;
    }
    return false;
  };

  if (isHoliday(date)) {
    return 'holiday';
  } else if (hour < 6 || hour >= 23) {
    return 'weeknight';
  } else {
    return 'weekday';
  }
}
