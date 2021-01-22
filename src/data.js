import {formatDateForDisplay} from './date-helpers';
import {formatWithCommas} from './number-helpers';

export function getIndexForDate(date, covidData) {
  for (let i = 0; i < covidData.DailyData.length; i++) {
    const thisDate = covidData.DailyData[i].Date;
    if (areUtcDatesEqual(thisDate, date)) {
      return i;
    }
  }

  return -1;
}

export function getDataTypes(covidData) {
  const dataTypes = [];
  const firstDataPoint = covidData.DailyData[0];
  for (const key in firstDataPoint) {
    if (key != 'DisplayDate' && key != 'Date') {
      dataTypes.push(key);
    }
  }
  return dataTypes;
}

export function transformData(covidData) {
  const output = {
    DailyData: [],
    RetrievalTime: new Date(covidData['RetrievalTime']),
    RetrievalTimeDisplay: new Date(covidData['RetrievalTime']),
  };

  covidData['DailyData'].forEach((data) => {
    const date = new Date(data['Date']);
    const dailyData = {
      Date: date,
      DisplayDate: formatDateForDisplay(date),
      Deaths: {
        NewCount: formatWithCommas(data['Deaths'].NewCount),
        TotalCount: formatWithCommas(data['Deaths'].TotalCount),
      },
      Cases: {
        NewCount: formatWithCommas(data['Cases'].NewCount),
        TotalCount: formatWithCommas(data['Cases'].TotalCount),
      },
    };

    output.DailyData.push(dailyData);
  });

  return output;
}

function areUtcDatesEqual(date1, date2) {
  return date1.getUTCFullYear() == date2.getUTCFullYear() &&
  date1.getUTCMonth() == date2.getUTCMonth() &&
  date1.getUTCDate() == date2.getUTCDate();
}
