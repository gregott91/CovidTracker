export function formatDateForDisplay(date) {
  return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
}

export function areUtcDatesEqual(date1, date2) {
  return date1.getUTCFullYear() == date2.getUTCFullYear() &&
  date1.getUTCMonth() == date2.getUTCMonth() &&
  date1.getUTCDate() == date2.getUTCDate();
}

export function parseAsUTCDate(date) {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function formatDateTimeForDisplay(date) {
  const locale = getLocale();
  const dateString = date.toLocaleDateString(locale, {
    dateStyle: 'short',
  });
  const timeString = date.toLocaleTimeString(locale, {
    timeStyle: 'medium',
  });
  return `${dateString} ${timeString}`;
}

function getLocale() {
  try {
    return navigator.languages[0];
  } catch {
    return 'en-US';
  }
}
