import Vue from 'vue';
import {EVENT_TYPE} from '../constants';

export function initializeDataTypesComponent(observable) {
  Vue.component('vue-datatypes', {
    props: ['selecteddatatype', 'fulldatatypes'],
    template: `
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#top-navbar">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="top-navbar">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item" v-for="datatype in fulldatatypes" v-on:click="dataTypeClicked" v-bind:datatype="datatype.Name">
          <div class="tab-inner selected-tab" v-if="datatype.Name == selecteddatatype">{{ datatype.Display}}</div>
          <div class="tab-inner unselected-tab" v-else>{{ datatype.Display }}</div>
        </li>
      </ul>
    </div>
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
