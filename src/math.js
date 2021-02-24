export function roundToNearestHighDigit(toRound, divisor) {
  const value = Math.round(toRound / divisor);
  const valueString = value.toString();
  const firstDigit = valueString[0];
  const padded = firstDigit.padEnd(valueString.length, '0');

  return parseInt(padded);
}

export function getRollingAverage(rollAmount, data) {
  return data.map((_, index) => {
    return rollDataPoint(index, data, rollAmount);
  });
}

function rollDataPoint(index, dataArray, rollAmount) {
  const dataToRoll = [];
  const startIndex = index;
  const endIndex = Math.min(dataArray.length - 1, index + rollAmount);

  for (let i = startIndex; i < endIndex; i++) {
    dataToRoll.push(dataArray[i]);
  }

  return (dataToRoll.reduce((a, b) => a + b, 0) / dataToRoll.length);
}

export function getGroupedDataAverage(groupIncrement, data) {
  const groups = new Array(groupIncrement);

  for (let i = 0; i < data.length; i++) {
    const incrementIndex = i % groupIncrement;
    if (!groups[incrementIndex]) {
      groups[incrementIndex] = 0;
    }

    groups[incrementIndex] = groups[incrementIndex] + data[i];
  }

  const expected = groups.reduce((a, b) => a + b, 0) / groupIncrement;

  return groups.map((x) => x / expected);
}
