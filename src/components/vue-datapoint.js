import Vue from 'vue';

export function initializeDatapointComponent() {
  Vue.component('vue-datapoint', {
    props: ['index', 'fulldata', 'datatype'],
    template: `
    <div>
        <div>{{ datatype }}</div>
        <div>{{ fulldata[index][datatype] }}</div>
    </div>
    `,
  });
}
