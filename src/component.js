import Vue from 'vue';

export function startApp(covidData) {
  defineComponents();

  // eslint-disable-next-line no-unused-vars
  const app = new Vue({
    el: '#app',
    data: {
      datatype: 'Deaths',
      datapoint: covidData['DailyData'][0],
    },
  });
}

function defineComponents() {
  Vue.component('data-point', {
    props: ['datapoint', 'datatype'],
    template: `
<div>
    <div>{{ datatype }}</div>
    <div>{{ datapoint[datatype] }}</div>
</div>
`,
  });
}
