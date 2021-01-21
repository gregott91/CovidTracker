import Vue from 'vue';
import datepicker from 'js-datepicker';
import {ARROW_ACTION, EVENT_TYPE} from '../constants';

export function initializeDatePickerComponent(observable) {
  Vue.component('vue-datepicker', {
    props: ['id', 'selecteddate'],
    mounted: function() {
      datepicker(document.getElementById(this.id), {
        formatter: (input, date, instance) => {
          input.value = date.toDateString();
        },
        onSelect: (instance, date) => {
          observable.publish(EVENT_TYPE.DATE_CHANGED, date);
        },
      });
    },
    // define methods under the `methods` object
    methods: {
      goBack: function() {
        observable.publish(EVENT_TYPE.ARROW_CLICKED, ARROW_ACTION.BACKWARD);
      },
      goForward: function() {
        observable.publish(EVENT_TYPE.ARROW_CLICKED, ARROW_ACTION.FORWARD);
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
