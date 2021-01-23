export function formatWithCommas(number) {
  return Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatPercent(number) {
  const value = parseFloat(number * 100.0).toFixed(2)+'%';
  let modifier = '+';

  if (number < 0) {
    modifier = '';
  }

  return `${modifier}${value}`;
}
