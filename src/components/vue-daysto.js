import Vue from 'vue';
import {getDaysToSignificantValues} from '../data';

export function initializeDaysToComponent() {
  Vue.component('vue-daysto', {
    props: ['index', 'selecteddatatype', 'fulldata'],
    data: function() {
      return {
        daysto: '',
      };
    },
    template: `
<div class="card datapoint-container">
    <div class="card-body">
        <h3>Days to Significant Values</h3>
        <div v-for="dayto in daysto">{{ dayto }}</div>
    </div>
</div>
`,
    watch: {
      index: function(val) {
        this.getDaysTo();
      },
      selecteddatatype: function(val) {
        this.getDaysTo();
      },
    },
    mounted: function() {
      this.getDaysTo();
    },
    methods: {
      getDaysTo: function() {
        this.daysto = getDaysToSignificantValues(this.index, this.selecteddatatype, this.fulldata);
      },
    },
  });
}
