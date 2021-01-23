import Vue from 'vue';

export function initializeDatapointComponent() {
  Vue.component('vue-datapoint', {
    props: ['index', 'fulldata', 'selecteddatatype'],
    template: `
    <div>
        <div>{{ selecteddatatype }} for {{ fulldata[index].DisplayDate }}</div>
        <div>New: {{ fulldata[index].Raw[selecteddatatype].NewCount }}</div>
        <div>New Rolling Average: {{ fulldata[index].Rolling[selecteddatatype].NewCount }}</div>
        <div>Total: {{ fulldata[index].Raw[selecteddatatype].TotalCount }}</div>
        <div>Total Rolling Average: {{ fulldata[index].Rolling[selecteddatatype].TotalCount }}</div>
    </div>
    `,
  });
}
