import Vue from 'vue';
import {EVENT_TYPE} from '../constants';

export function initializeDataTypesComponent(observable) {
  Vue.component('vue-datatypes', {
    props: ['datatypes', 'selecteddatatype'],
    template: `
<nav class="d-none d-md-block sidebar">
  <div class="sidebar-sticky">
    <ul class="nav flex-column">
      <li class="nav-item" v-for="datatype in datatypes" v-on:click="dataTypeClicked" v-bind:datatype="datatype">
        <div class="tab-inner selected-tab" v-if="datatype == selecteddatatype">{{ datatype }}</div>
        <div class="tab-inner unselected-tab" v-else>{{ datatype }}</div>
      </li>
    </ul>
  </div>
</nav>
`,
    methods: {
      dataTypeClicked: function(event) {
        const datatype = event.target.parentElement.attributes['datatype'].value;
        observable.publish(EVENT_TYPE.DATATYPE_CHANGED, datatype);
      },
    },
  });
}
