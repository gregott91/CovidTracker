export function getRollingAverage(rollAmount, data) {
  const traverseAmount = Math.floor(rollAmount / 2);
  return data.map((_, index) => {
    return rollDataPoint(index, data, traverseAmount);
  });
}

function rollDataPoint(index, dataArray, traverseAmount) {
  const dataToRoll = [];

  for (let i = index - traverseAmount; i < index + traverseAmount; i++) {
    if (i < 0) {
      continue;
    }

    if (i > dataArray.length) {
      break;
    }

    dataToRoll.push(dataArray[i]);
  }

  return (dataToRoll.reduce((a, b) => a + b, 0) / dataToRoll.length);
}
