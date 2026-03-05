export const formatDate = (dateString: string, locale: string = 'en-US'): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const getDayOfWeek = (dateString: string): string => {
  const date = new Date(dateString);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

export const getNextHolidayDate = (holidays: Array<{ date: string; holiday: string }>): { date: string; holiday: string } | null => {
  const today = new Date();
  const futureHolidays = holidays
    .filter(h => new Date(h.date) > today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return futureHolidays.length > 0 ? futureHolidays[0] : null;
};

export const isHolidayToday = (dateString: string): boolean => {
  const today = new Date();
  const holidayDate = new Date(dateString);
  return (
    today.getFullYear() === holidayDate.getFullYear() &&
    today.getMonth() === holidayDate.getMonth() &&
    today.getDate() === holidayDate.getDate()
  );
};

export const getDaysUntilHoliday = (dateString: string): number => {
  const today = new Date();
  const holidayDate = new Date(dateString);
  const timeDiff = holidayDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

export const getMonthName = (month: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1];
};
