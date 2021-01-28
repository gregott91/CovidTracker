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
          pointHitRadius: 2,
        }],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
        }],
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

export function openTooltip(chart, pointIndex) {
  if (chart.tooltip._active == undefined) {
    chart.tooltip._active = [];
  }

  const activeElements = chart.tooltip._active;
  const requestedElem = chart.getDatasetMeta(0).data[pointIndex];

  for (let i = 0; i < activeElements.length; i++) {
    if (requestedElem._index == activeElements[i]._index) {
      return;
    }
  }

  activeElements.push(requestedElem);
  chart.tooltip._active = activeElements;
  chart.tooltip.update(true);
  chart.draw();
}

export function closeTooltip(chart) {
  chart.tooltip._active = [];
  chart.tooltip.update(true);
  chart.draw();
}
