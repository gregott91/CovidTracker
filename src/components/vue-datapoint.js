import Vue from 'vue';

export function initializeDatapointComponent() {
  Vue.component('vue-datapoint', {
    props: ['index', 'fulldata', 'selecteddatatype'],
    template: `
    <div>
        <div>{{ selecteddatatype }}</div>
        <div>New: {{ fulldata[index][selecteddatatype].NewCount }}</div>
        <div>Total: {{ fulldata[index][selecteddatatype].TotalCount }}</div>
    </div>
    `,
  });
}
