export function getRollingAverage(rollAmount, data) {
  return data.map((_, index) => {
    return rollDataPoint(index, data, rollAmount);
  });
}

function rollDataPoint(index, dataArray, rollAmount) {
  const dataToRoll = [];
  const traverseAmount = Math.floor(rollAmount / 2);
  let startIndex = index - traverseAmount;
  let endIndex = index + traverseAmount;

  if (startIndex < 0) {
    endIndex = endIndex - startIndex;
    startIndex = 0;
  }

  if (endIndex > dataArray.length) {
    startIndex = startIndex - (endIndex - dataArray.length);
    endIndex = dataArray.length;
  }

  for (let i = startIndex; i < endIndex; i++) {
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
