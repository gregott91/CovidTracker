import Vue from 'vue';
import {EVENT_TYPE} from '../constants';

export function initializeDataTypesComponent(observable) {
  Vue.component('vue-datatypes', {
    props: ['datatypes', 'selecteddatatype'],
    template: `
<div class="tab-bar">
  <div v-for="datatype in datatypes" v-on:click="dataTypeClicked" v-bind:datatype="datatype">
      <div class="tab-inner selected-tab" v-if="datatype == selecteddatatype">{{ datatype }}</div>
      <div class="tab-inner unselected-tab" v-else>{{ datatype }}</div>
  </div>
</div>
`,
    methods: {
      dataTypeClicked: function(event) {
        const datatype = event.target.parentElement.attributes['datatype'].value;
        observable.publish(EVENT_TYPE.DATATYPE_CHANGED, datatype);
      },
    },
  });
}
