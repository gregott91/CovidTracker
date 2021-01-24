import Chart from 'chart.js';

export function createGraph(sourceElement) {
  return new Chart(sourceElement, {
    type: 'bar',
    data: {
      datasets: [
        {
          backgroundColor: '#e3624b',
          hoverBackgroundColor: '#bf250a',
          barPercentage: 1.0,
          categoryPercentage: 1.0,
          order: 1,
        },
        {
          type: 'line',
          borderColor: '#802516',
          borderWidth: 4,
          order: 0,
          pointRadius: 0,
          fill: false,
        }],
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
          }],
        },
      },
    },
  });
}

export function setGraphData(chart, dataSet, dataSetType) {
  chart.data.labels = dataSet.Labels;
  chart.data.datasets[0].label = dataSetType;
  chart.data.datasets[0].data = dataSet.Values;
  chart.data.datasets[1].label = '7-Day Rolling Average';
  chart.data.datasets[1].data = dataSet.RollingValues;
  chart.update();
}
