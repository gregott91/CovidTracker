import {formatDateForDisplay, areUtcDatesEqual, formatDateTimeForDisplay} from './date-helpers';
import {formatWithCommas, formatPercent, roundNumber} from './number-helpers';
import {getRollingAverage, getGroupedDataAverage, roundToNearestHighDigit} from './math';

const rollAmount = 7;

export function getDaysToSignificantValues(index, dataType, covidData) {
  const divisor = 10;
  const topValue = covidData[0].Raw[dataType].TotalCount.RawValue;
  const significantValue = roundToNearestHighDigit(topValue, divisor);

  const daysTo = [];

  let dayCount = 0;
  let lastValue = significantValue;
  for (let i = covidData.length - 1; i >= index; i--) {
    dayCount++;

    if (covidData[i].Raw[dataType].TotalCount.RawValue > lastValue) {
      daysTo.push(`${dayCount} day(s) to ${formatWithCommas(lastValue)}`);

      dayCount = 0;
      lastValue += significantValue;
    }
  }

  return daysTo;
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
  const dailyData = limitDailyData(covidData['DailyData'], new Date(2020, 2, 0));
  const dataTypes = covidData.DataTypes.map((x) => x.Name);
  const countTypes = ['NewCount', 'TotalCount'];

  const output = {
    DailyData: [],
    DataTypes: dataTypes,
    FullDataTypes: covidData.DataTypes,
    DataTypeRenderInfo: {},
    RetrievalTimeDisplay: formatDateTimeForDisplay(new Date(covidData['RetrievalTime'])),
  };

  covidData.DataTypes.forEach((x) => {
    output.DataTypeRenderInfo[x.Name] = {
      IsPositive: x.IsPositive,
      IsCumulative: x.IsCumulative,
      ShowDecimals: x.ShowDecimals,
    };
  });

  let transformedData = getMetadata(dailyData);
  transformedData = transformAndMergeData(dailyData, transformedData, covidData.DataTypes, countTypes, 'Raw', getTransformRawPointFunction(dailyData));
  transformedData = transformAndMergeData(dailyData, transformedData, covidData.DataTypes, countTypes, 'Rolling', getTransformRollingFunction(covidData.DataTypes, countTypes, dailyData));
  transformedData = transformAndMergeData(dailyData, transformedData, covidData.DataTypes, countTypes, 'Predicted', getTransformPredictionFunction(covidData.DataTypes, countTypes, dailyData));

  output.DailyData = transformedData;

  return output;
}

function limitDailyData(covidData, firstDay) {
  const dailyData = [];
  covidData.forEach((x) => {
    if (new Date(x.Date) >= firstDay) {
      dailyData.push(x);
    }
  });

  return dailyData;
}

function getTransformPredictionFunction(dataTypes, countTypes, dailyData) {
  const groupedAverages = calculateGroupedDataAverages(dataTypes, countTypes, dailyData);
  const daysInWeek = 7;
  return (index, data, dataType, countType) => {
    const tomorrowIndex = index - 1;
    const tomorrowGroupIndex = (daysInWeek + tomorrowIndex) % daysInWeek;
    const todayGroupIndex = index % daysInWeek;
    const tomorrowGroupedAverage = groupedAverages[dataType.Name][countType][tomorrowGroupIndex];
    const todayGroupedAverage = groupedAverages[dataType.Name][countType][todayGroupIndex];
    const output = {
      Value: formatAsRoundedOrDecimal(tomorrowGroupedAverage * (data / todayGroupedAverage), dataType),
      HasActual: false,
    };

    if (tomorrowIndex >= 0) {
      output.HasActual = true;
      output.Actual = formatAsRoundedOrDecimal(dailyData[tomorrowIndex][dataType.Name][countType], dataType);
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
  const dataPoint = dataArray[index][dataType.Name][countType];

  const data = {
    Value: formatAsRoundedOrDecimal(dataPoint, dataType),
    RawValue: roundNumber(dataPoint, 2),
  };

  const previousIndex = index + daysInWeek;

  data.HasPrevious = !(previousIndex >= dataArray.length);
  if (data.HasPrevious) {
    const previousDataPoint = dataArray[previousIndex][dataType.Name][countType];
    const percent = (dataPoint - previousDataPoint) / previousDataPoint;
    data.PercentChange = formatPercent(percent);
    data.RawPercentChange = percent;
    data.PreviousValue = formatAsRoundedOrDecimal(previousDataPoint, dataType);
  }

  return data;
}

function formatAsRoundedOrDecimal(dataPoint, dataType) {
  if (dataType.ShowDecimals) {
    return roundNumber(dataPoint, 2);
  } else {
    return formatWithCommas(dataPoint);
  }
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
      transformedDataPoint[dataType.Name] = {};

      countTypes.forEach((countType) => {
        const newData = transformFunc(index, dataPoint[dataType.Name][countType], dataType, countType);
        transformedDataPoint[dataType.Name][countType] = newData;
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
      const roll = getRollingAverage(rollAmount, data.map((x) => x[dataType.Name][countType]));

      rollingAverages = rollingAverages.map((dataPoint, index) => {
        const rollPoint = roll[index];

        if (!dataPoint[dataType.Name]) {
          dataPoint[dataType.Name] = {};
        }

        dataPoint[dataType.Name][countType] = rollPoint;

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
    predictions[dataType.Name] = {};
    countTypes.forEach((countType) => {
      const groupedAverages = getGroupedDataAverage(daysInWeek, data.map((x) => x[dataType.Name][countType]));
      predictions[dataType.Name][countType] = groupedAverages;
    });
  });

  return predictions;
}
