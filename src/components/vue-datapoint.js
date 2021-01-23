import Vue from 'vue';

export function initializeDatapointComponent() {
  Vue.component('vue-datapoint', {
    props: ['index', 'fulldata', 'selecteddatatype'],
    template: `
    <div class="datapoint-container">
        <div class="datapoint-header">{{ selecteddatatype }} for {{ fulldata[index].DisplayDate }}</div>
        <div class="datapoint-primarydata">Total: {{ fulldata[index].Raw[selecteddatatype].TotalCount }}</div>
        <div class="datapoint-primarydata">New: {{ fulldata[index].Raw[selecteddatatype].NewCount }}</div>
        <div class="datapoint-primarydata">Rolling average (7-day): {{ fulldata[index].Rolling[selecteddatatype].NewCount.Value }}</div>
        <div class="datapoint-primarydata">Rolling average change from last week: {{ fulldata[index].Rolling[selecteddatatype].NewCount.PercentChange }}</div>
        <div class="datapoint-secondaryData">Rolling average last week: {{ fulldata[index].Rolling[selecteddatatype].NewCount.PreviousValue }}</div>
    </div>
    `,
  });
}
