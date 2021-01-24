import Vue from 'vue';
import {EVENT_TYPE} from '../constants';

export function initializeDataTypesComponent(observable) {
  Vue.component('vue-datatypes', {
    props: ['datatypes', 'selecteddatatype'],
    template: `
<div class="tab-bar">
  <ul class="sidenav sidenav-relative">
    <li v-for="datatype in datatypes" v-on:click="dataTypeClicked" v-bind:datatype="datatype" class="bold">
        <div class="tab-inner selected-tab red lighten-3" v-if="datatype == selecteddatatype">{{ datatype }}</div>
        <div class="waves-effect waves-teal tab-inner unselected-tab" v-else>{{ datatype }}</div>
    </li>
  </ul>
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
