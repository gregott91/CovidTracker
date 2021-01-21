export function getIndexForDate(date, covidData) {
  for (let i = 0; i < covidData.DailyData.length; i++) {
    const thisDate = covidData.DailyData[i].Date;
    console.log(thisDate.getTime());
    console.log(date.getTime());
    if (thisDate.getTime() === date.getTime()) {
      return i;
    }
  }

  return -1;
}

export function transformData(covidData) {
  const output = {
    DailyData: [],
    RetrievalTime: new Date(covidData['RetrievalTime']),
  };

  covidData['DailyData'].forEach((data) => {
    const dailyData = {
      Date: new Date(data['Date']),
      Deaths: {
        NewCount: data['Deaths'].NewCount,
        TotalCount: data['Deaths'].TotalCount,
      },
      Cases: {
        NewCount: data['Cases'].NewCount,
        TotalCount: data['Cases'].TotalCount,
      },
    };

    output.DailyData.push(dailyData);
  });

  return output;
}
