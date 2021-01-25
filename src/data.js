import {formatDateForDisplay, areUtcDatesEqual, formatDateTimeForDisplay} from './date-helpers';
import {formatWithCommas, formatPercent, roundNumber} from './number-helpers';
import {getRollingAverage, getGroupedDataAverage} from './math';

const rollAmount = 7;

export function getDaysToSignificantValues(index, dataType, covidData) {
  return ['93 days to 7asd'];
}

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
    FullDataTypes: {},
    RetrievalTimeDisplay: formatDateTimeForDisplay(new Date(covidData['RetrievalTime'])),
  };

  covidData.DataTypes.forEach((x) => {
    output.FullDataTypes[x.Name] = {
      IsPositive: x.IsPositive,
    };
  });

  let transformedData = getMetadata(dailyData);
  transformedData = transformAndMergeData(dailyData, transformedData, dataTypes, countTypes, 'Raw', getTransformRawPointFunction(dailyData));
  transformedData = transformAndMergeData(dailyData, transformedData, dataTypes, countTypes, 'Rolling', getTransformRollingFunction(dataTypes, countTypes, dailyData));
  transformedData = transformAndMergeData(dailyData, transformedData, dataTypes, countTypes, 'Predicted', getTransformPredictionFunction(dataTypes, countTypes, dailyData));

  output.DailyData = transformedData;

  return output;
}

function getTransformPredictionFunction(dataTypes, countTypes, dailyData) {
  const groupedAverages = calculateGroupedDataAverages(dataTypes, countTypes, dailyData);
  const daysInWeek = 7;
  return (index, data, dataType, countType) => {
    const tomorrowIndex = index - 1;
    const tomorrowGroupIndex = (daysInWeek + tomorrowIndex) % daysInWeek;
    const todayGroupIndex = index % daysInWeek;
    const tomorrowGroupedAverage = groupedAverages[dataType][countType][tomorrowGroupIndex];
    const todayGroupedAverage = groupedAverages[dataType][countType][todayGroupIndex];
    const output = {
      Value: formatWithCommas(tomorrowGroupedAverage * (data / todayGroupedAverage)),
      HasActual: false,
    };

    if (tomorrowIndex >= 0) {
      output.HasActual = true;
      output.Actual = formatWithCommas(dailyData[tomorrowIndex][dataType][countType]);
    }

    return output;
  };
}

function getTransformRawPointFunction(dailyData) {
  return (index, _, dataType, countType) => {
    return defaultTransformData(dailyData, dataType, countType, index);
  };
}

function getTransformRollingFunction(dataTypes, countTypes, dailyData) {
  const rollingAverages = calculateRollingAverages(dataTypes, countTypes, dailyData);

  return (index, _, dataType, countType) => {
    return defaultTransformData(rollingAverages, dataType, countType, index);
  };
}

function defaultTransformData(dataArray, dataType, countType, index) {
  const daysInWeek = 7;
  const dataPoint = dataArray[index][dataType][countType];
  const data = {
    Value: formatWithCommas(dataPoint),
    RawValue: roundNumber(dataPoint, 2),
  };

  const previousIndex = index + daysInWeek;

  data.HasPrevious = !(previousIndex >= dataArray.length);
  if (data.HasPrevious) {
    const previousDataPoint = dataArray[previousIndex][dataType][countType];
    const percent = (dataPoint - previousDataPoint) / previousDataPoint;
    data.PercentChange = formatPercent(percent);
    data.RawPercentChange = percent;
    data.PreviousValue = formatWithCommas(previousDataPoint);
  }

  return data;
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
  let rollingAverages = data.map((x) => {
    return {};
  });

  dataTypes.forEach((dataType) => {
    countTypes.forEach((countType) => {
      const roll = getRollingAverage(rollAmount, data.map((x) => x[dataType][countType]));

      rollingAverages = rollingAverages.map((dataPoint, index) => {
        const rollPoint = roll[index];

        if (!dataPoint[dataType]) {
          dataPoint[dataType] = {};
        }

        dataPoint[dataType][countType] = rollPoint;

        return dataPoint;
      });
    });
  });

  return rollingAverages;
}


function calculateGroupedDataAverages(dataTypes, countTypes, data) {
  const predictions = {};
  const daysInWeek = 7;
  dataTypes.forEach((dataType) => {
    predictions[dataType] = {};
    countTypes.forEach((countType) => {
      const groupedAverages = getGroupedDataAverage(daysInWeek, data.map((x) => x[dataType][countType]));
      predictions[dataType][countType] = groupedAverages;
    });
  });

  return predictions;
}
