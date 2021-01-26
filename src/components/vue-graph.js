import Vue from 'vue';
import {createGraph, setGraphData} from '../graph';

export function initializeGraphComponent() {
  Vue.component('vue-graph', {
    props: ['id', 'fulldata', 'selecteddatatype'],
    mounted: function() {
      this.buildGraph();
    },
    methods: {
      buildGraph: function() {
        this.graph = createGraph(document.getElementById(this.id));
        this.refreshData();
      },
      refreshData: function() {
        const data = [];
        for (let i = this.fulldata.length -1; i >= 0; i--) {
          data.push(this.fulldata[i]);
        }

        const dataType = this.selecteddatatype;
        const dataSet = {
          Values: data.map((x) => x.Raw[dataType].NewCount.RawValue),
          RollingValues: data.map((x) => x.Rolling[dataType].NewCount.RawValue),
          Labels: data.map((x) => x.DisplayDate),
        };

        setGraphData(this.graph, dataSet, dataType);
      },
    },
    template: `
<div class="card datapoint-container graph-card">
  <div class="card-body graph-canvas-container">
    <canvas :id="id" class="graph-canvas"></canvas>
  </div>
</div>
    `,
    watch: {
      selecteddatatype: function(val) {
        this.refreshData();
      },
    },
  });
}
