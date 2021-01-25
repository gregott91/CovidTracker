import Vue from 'vue';

export function initializeDatapointComponent() {
  Vue.component('vue-datapoint', {
    props: ['index', 'fulldata', 'selecteddatatype', 'datatypepositivity'],
    template: `
<div class="card datapoint-container">
  <div class="card-body">
    <h3 class="card-title">{{ selecteddatatype }} for {{ fulldata[index].DisplayDate }}</h3>
    <div class="datapoint-primarydata">Total: {{ fulldata[index].Raw[selecteddatatype].TotalCount.Value }}</div>
    <div class="datapoint-primarydata">New: {{ fulldata[index].Raw[selecteddatatype].NewCount.Value }}</div>
    <div class="datapoint-secondaryData">
      Change from last week: 
      <span v-bind:class="rawClass">{{ fulldata[index].Raw[selecteddatatype].NewCount.PercentChange }}</span>
    </div>
    <div class="datapoint-secondaryData">Value last week: {{ fulldata[index].Raw[selecteddatatype].NewCount.PreviousValue }}</div>
    <div class="datapoint-primarydata">Rolling average (7-day): {{ fulldata[index].Rolling[selecteddatatype].NewCount.Value }}</div>
    <div class="datapoint-secondaryData">
      Change from last week: 
      <span v-bind:class="rollClass">{{ fulldata[index].Rolling[selecteddatatype].NewCount.PercentChange }}</span>
    </div>
    <div class="datapoint-secondaryData">Value last week: {{ fulldata[index].Rolling[selecteddatatype].NewCount.PreviousValue }}</div>
    <div class="datapoint-primarydata">Expected next day: {{ fulldata[index].Predicted[selecteddatatype].NewCount.Value }}</div>
    <div v-if="fulldata[index].Predicted[selecteddatatype].NewCount.HasActual" class="datapoint-secondaryData">Actual: {{ fulldata[index].Predicted[selecteddatatype].NewCount.Actual }}</div>
  </div>
</div>
    `,
    computed: {
      rawClass: function() {
        return {
          'datapoint-text text-success': this.isChangePositive(this.fulldata[this.index].Raw[this.selecteddatatype].NewCount.RawPercentChange),
          'datapoint-text text-danger': !this.isChangePositive(this.fulldata[this.index].Raw[this.selecteddatatype].NewCount.RawPercentChange),
        };
      },
      rollClass: function() {
        return {
          'datapoint-text text-success': this.isChangePositive(this.fulldata[this.index].Rolling[this.selecteddatatype].NewCount.RawPercentChange),
          'datapoint-text text-danger': !this.isChangePositive(this.fulldata[this.index].Rolling[this.selecteddatatype].NewCount.RawPercentChange),
        };
      },
    },
    methods: {
      isChangePositive: function(changeValue) {
        return changeValue > 0 && this.datatypepositivity || changeValue < 0 && !this.datatypepositivity;
      },
    },
  });
}
