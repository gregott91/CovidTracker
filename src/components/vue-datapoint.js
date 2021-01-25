import Vue from 'vue';

export function initializeDatapointComponent() {
  Vue.component('vue-datapoint', {
    props: ['index', 'fulldata', 'selecteddatatype'],
    template: `
<div class="card datapoint-container">
  <div class="card-body">
    <h3 class="card-title"><span class="card-title">{{ selecteddatatype }} for {{ fulldata[index].DisplayDate }}</span></h3>
    <div class="datapoint-primarydata">Total: {{ fulldata[index].Raw[selecteddatatype].TotalCount.Value }}</div>
    <div class="datapoint-primarydata">New: {{ fulldata[index].Raw[selecteddatatype].NewCount.Value }}</div>
    <div class="datapoint-secondaryData">Change from last week: {{ fulldata[index].Raw[selecteddatatype].NewCount.PercentChange }}</div>
    <div class="datapoint-secondaryData">Value last week: {{ fulldata[index].Raw[selecteddatatype].NewCount.PreviousValue }}</div>
    <div class="datapoint-primarydata">Rolling average (7-day): {{ fulldata[index].Rolling[selecteddatatype].NewCount.Value }}</div>
    <div class="datapoint-secondaryData">Change from last week: {{ fulldata[index].Rolling[selecteddatatype].NewCount.PercentChange }}</div>
    <div class="datapoint-secondaryData">Value last week: {{ fulldata[index].Rolling[selecteddatatype].NewCount.PreviousValue }}</div>
    <div class="datapoint-primarydata">Expected next day: {{ fulldata[index].Predicted[selecteddatatype].NewCount.Value }}</div>
    <div v-if="fulldata[index].Predicted[selecteddatatype].NewCount.HasActual" class="datapoint-secondaryData">Actual: {{ fulldata[index].Predicted[selecteddatatype].NewCount.Actual }}</div>
  </div>
</div>   
    `,
  });
}
