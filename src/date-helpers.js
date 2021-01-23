export function formatDateForDisplay(date) {
  return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
}

export function areUtcDatesEqual(date1, date2) {
  return date1.getUTCFullYear() == date2.getUTCFullYear() &&
  date1.getUTCMonth() == date2.getUTCMonth() &&
  date1.getUTCDate() == date2.getUTCDate();
}
