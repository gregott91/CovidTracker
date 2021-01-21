import Vue from 'vue';

export function initializeDatapointComponent() {
  Vue.component('vue-datapoint', {
    props: ['index', 'datapoint', 'datatype'],
    template: `
    <div>
        <div>{{ datatype }}</div>
        <div>{{ datapoint[index].Date }}</div>
        <div>{{ datapoint[index][datatype] }}</div>
    </div>
    `,
  });
}
