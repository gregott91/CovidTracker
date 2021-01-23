import {formatDateForDisplay} from './date-helpers';
import {formatWithCommas, formatPercent} from './number-helpers';
import {areUtcDatesEqual} from './date-helpers';
import {getRollingAverage, getGroupedDataAverage} from './math';

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

  let transformedData = getMetadata(dailyData);
  transformedData = transformAndMergeData(dailyData, transformedData, dataTypes, countTypes, 'Raw', getTransformRawPointFunction(dailyData));
  transformedData = transformAndMergeData(dailyData, transformedData, dataTypes, countTypes, 'Rolling', getTransformRollingFunction(dataTypes, countTypes, dailyData));
  transformedData = transformAndMergeData(dailyData, transformedData, dataTypes, countTypes, 'Predicted', getTransformPredictionFunction(dataTypes, countTypes, dailyData));

  output.DailyData = transformedData;

  return output;
}

function getTransformPredictionFunction(dataTypes, countTypes, dailyData) {
  const groupedAverages = calculateGroupedDataAverages(dataTypes, countTypes, dailyData);
  return (index, data, dataType, countType) => {
    const tomorrowIndex = index - 1;
    const groupIndex = tomorrowIndex % rollAmount;
    const groupedAverage = groupedAverages[dataType][countType][groupIndex];

    const output = {
      Value: formatWithCommas(groupedAverage * data),
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
  const dataPoint = dataArray[index][dataType][countType];
  const data = {
    Value: formatWithCommas(dataPoint),
  };

  const previousIndex = index + rollAmount;

  data.HasPrevious = !(previousIndex >= dataArray.length);
  if (data.HasPrevious) {
    const previousDataPoint = dataArray[previousIndex][dataType][countType];
    data.PercentChange = formatPercent((dataPoint - previousDataPoint) / previousDataPoint);
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

  dataTypes.forEach((dataType) => {
    predictions[dataType] = {};
    countTypes.forEach((countType) => {
      const groupedAverages = getGroupedDataAverage(rollAmount, data.map((x) => x[dataType][countType]));
      predictions[dataType][countType] = groupedAverages;
    });
  });

  return predictions;
}
