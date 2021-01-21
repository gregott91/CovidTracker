import Vue from 'vue';
import datepicker from 'js-datepicker';
import {ARROW_ACTION} from '../constants';

export function initializeDatePickerComponent(observable) {
  Vue.component('vue-datepicker', {
    props: ['id', 'selecteddate'],
    mounted: function() {
      datepicker(document.getElementById(this.id), {});
    },
    // define methods under the `methods` object
    methods: {
      goBack: function(event) {
        observable.publish(ARROW_ACTION.BACKWARD);
      },
      goForward: function(event) {
        observable.publish(ARROW_ACTION.FORWARD);
      },
    },
    template: `
<div>
    <i class="fas fa-arrow-circle-left dateicon" v-on:click="goBack"></i>
    <input :id="id" class="datepicker"/>
    <i class="fas fa-arrow-circle-right dateicon" v-on:click="goForward"></i>
</div>
`,
  });
}
