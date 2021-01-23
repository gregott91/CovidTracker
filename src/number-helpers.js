export function formatWithCommas(number) {
  return Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatPercent(number) {
  return parseFloat(number).toFixed(2)+'%';
}
