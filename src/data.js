import {formatDateForDisplay} from './date-helpers';
import {formatWithCommas, formatPercent} from './number-helpers';
import {areUtcDatesEqual} from './date-helpers';
import {getRollingAverage} from './math';

const rollAmount = 7;

export function getIndexForDate(date, covidData) {
  for (let i = 0; i < covidData.DailyData.length; i++) {
    const thisDate = covidData.DailyData[i].Date;
    if (areUtcDatesEqual(thisDate, date)) {
      return i;
    }
  }

  return -1;
}

export function transformData(covidData) {
  const dailyData = covidData['DailyData'];
  const dataTypes = covidData.DataTypes.map((x) => x.Name);
  const countTypes = ['NewCount', 'TotalCount'];

  const output = {
    DailyData: [],
    DataTypes: dataTypes,
    RetrievalTime: new Date(covidData['RetrievalTime']),
    RetrievalTimeDisplay: new Date(covidData['RetrievalTime']),
  };

  const rollingAverages = calculateRollingAverages(dataTypes, countTypes, dailyData);

  let transformedData = getMetadata(dailyData);
  transformedData = transformAndMergeData(dailyData, transformedData, dataTypes, countTypes, 'Raw', getTransformRawPointFunction());
  transformedData = transformAndMergeData(dailyData, transformedData, dataTypes, countTypes, 'Rolling', getTransformRollingFunction(rollingAverages));

  output.DailyData = transformedData;

  return output;
}

function getTransformRawPointFunction() {
  return (index, data, dataType, countType) => {
    return formatWithCommas(data);
  };
}

function getTransformRollingFunction(rollingAverages) {
  return (index, _, dataType, countType) => {
    const rolled = rollingAverages[dataType][countType][index];
    const data = {
      Value: formatWithCommas(rolled),
    };

    const previousIndex = index + rollAmount;

    data.HasPrevious = !(previousIndex >= rollingAverages[dataType][countType].length);
    if (data.HasPrevious) {
      const previousRolled = rollingAverages[dataType][countType][previousIndex];
      data.PercentChange = formatPercent((rolled - previousRolled) / previousRolled);
      data.PreviousValue = formatWithCommas(previousRolled);
    }

    return data;
  };
}

function transformAndMergeData(
    data,
    originalData,
    dataTypes,
    countTypes,
    transformName,
    transformFunc) {
  const transformedData = [];

  let index = 0;
  data.forEach((dataPoint) => {
    const transformedDataPoint = {};

    dataTypes.forEach((dataType) => {
      transformedDataPoint[dataType] = {};

      countTypes.forEach((countType) => {
        const newData = transformFunc(index, dataPoint[dataType][countType], dataType, countType);
        transformedDataPoint[dataType][countType] = newData;
      });
    });

    transformedData.push(transformedDataPoint);
    index++;
  });

  for (let i = 0; i < originalData.length; i++) {
    originalData[i][transformName] = transformedData[i];
  }

  return originalData;
}

function getMetadata(dailyData) {
  const output = [];

  dailyData.forEach((data) => {
    const date = new Date(data['Date']);
    const dailyData = {
      Date: date,
      DisplayDate: formatDateForDisplay(date),
    };

    output.push(dailyData);
  });

  return output;
}

function calculateRollingAverages(dataTypes, countTypes, data) {
  const rollingAverages = {};

  dataTypes.forEach((dataType) => {
    rollingAverages[dataType] = {};
    countTypes.forEach((countType) => {
      const roll = getRollingAverage(rollAmount, data.map((x) => x[dataType][countType]));
      rollingAverages[dataType][countType] = roll;
    });
  });

  return rollingAverages;
}
