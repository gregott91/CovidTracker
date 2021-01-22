import Vue from 'vue';

export function initializeDatapointComponent() {
  Vue.component('vue-datapoint', {
    props: ['index', 'fulldata', 'selecteddatatype'],
    template: `
    <div>
        <div>{{ selecteddatatype }}</div>
        <div>{{ fulldata[index][selecteddatatype] }}</div>
    </div>
    `,
  });
}
