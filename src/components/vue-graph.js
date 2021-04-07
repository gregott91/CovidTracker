import Vue from 'vue';
import {createGraph, setGraphData, openTooltip, closeTooltip} from '../graph';

export function initializeGraphComponent() {
  Vue.component('vue-graph', {
    props: ['id', 'index', 'fulldata', 'selecteddatatype'],
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
        for (let i = this.fulldata.length - 1; i >= 0; i--) {
          data.push(this.fulldata[i]);
        }

        const dataType = this.selecteddatatype.Name;
        const dataSet = {
          Values: data.map((x) => x.Raw[dataType].NewCount.RawValue),
          RollingValues: data.map((x) => x.Rolling[dataType].NewCount.RawValue),
          Labels: data.map((x) => x.DisplayDate),
        };

        setGraphData(this.graph, dataSet, dataType);
      },
      openChartTooltip() {
        closeTooltip(this.graph);
        openTooltip(this.graph, this.fulldata.length - this.index - 1);
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
      index: function(val) {
        this.openChartTooltip();
      },
    },
  });
}
