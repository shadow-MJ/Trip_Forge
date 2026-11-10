export function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return new Date(dateStr);
  return new Date(year, month - 1, day);
}

export function formatShortDate(dateStr) {
  const date = parseLocalDate(dateStr);
  if (!date || Number.isNaN(date.getTime())) return 'Date TBD';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatFullDate(dateStr) {
  const date = parseLocalDate(dateStr);
  if (!date || Number.isNaN(date.getTime())) return 'Date TBD';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return 'Dates TBD';
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);
  if (!start || !end) return 'Dates TBD';

  const sameYear = start.getFullYear() === end.getFullYear();
  const startText = start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
  const endText = end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${startText} – ${endText}`;
}

export function getTripDays(startDate, endDate) {
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);
  if (!start || !end || end < start) return [];

  const days = [];
  const cursor = new Date(start);
  let dayNumber = 1;

  while (cursor <= end && dayNumber <= 30) {
    const yyyy = cursor.getFullYear();
    const mm = String(cursor.getMonth() + 1).padStart(2, '0');
    const dd = String(cursor.getDate()).padStart(2, '0');
    const isoDate = `${yyyy}-${mm}-${dd}`;

    days.push({
      dayNumber,
      date: isoDate,
      label: `Day ${dayNumber}`,
      formattedDate: cursor.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
    });

    cursor.setDate(cursor.getDate() + 1);
    dayNumber += 1;
  }

  return days;
}

export function isEndDateValid(startDate, endDate) {
  if (!startDate || !endDate) return false;
  return endDate >= startDate;
}

export function formatTimestamp(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

