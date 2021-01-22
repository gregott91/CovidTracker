import Vue from 'vue';
import {ARROW_ACTION, EVENT_TYPE} from '../constants';
import {initializeDatePicker, setDatePickerDate} from '../datepicker';

export function initializeDatePickerComponent(observable) {
  Vue.component('vue-datepicker', {
    props: ['id', 'index', 'fulldata'],
    mounted: function() {
      this.datepicker = initializeDatePicker(this.id, this.fulldata[this.index].Date, observable);
    },
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
    <i class="fas fa-arrow-circle-left date-icon" v-on:click="goBack"></i>
    <input :id="id"/>
    <i class="fas fa-arrow-circle-right date-icon" v-on:click="goForward"></i>
</div>
`,
    watch: {
      index: function(val) {
        setDatePickerDate(this.datepicker, this.fulldata[val].Date);
      },
    },
  });
}
