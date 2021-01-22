import Vue from 'vue';
import {EVENT_TYPE} from '../constants';

export function initializeDataTypesComponent(observable) {
  Vue.component('vue-datatypes', {
    props: ['datatypes', 'selecteddatatype'],
    template: `
<div class="tab-bar">
    <div v-for="datatype in datatypes" class="datatype-tab" v-on:click="dataTypeClicked" v-bind:datatype="datatype">
    {{ datatype }}
    </div>
</div>
`,
    methods: {
      dataTypeClicked: function(event) {
        const datatype = event.target.attributes['datatype'].value;
        observable.publish(EVENT_TYPE.DATATYPE_CHANGED, datatype);
      },
    },
  });
}
