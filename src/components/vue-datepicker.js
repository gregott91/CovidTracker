import Vue from 'vue';
import {ARROW_ACTION, EVENT_TYPE} from '../constants';
import {initializeDatePicker, setDatePickerDate} from '../date-picker';

export function initializeDatePickerComponent(observable) {
  Vue.component('vue-datepicker', {
    props: ['id', 'index', 'fulldata'],
    mounted: function() {
      this.datepicker = initializeDatePicker(this.id, this.fulldata[0].Date, this.fulldata[this.fulldata.length - 1].Date, observable);
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
<div class="date-picker-container">
  <button type="button" class="btn btn-outline-danger" v-on:click="goBack"><i class="material-icons datepicker-button-icon">keyboard_arrow_left</i></button>
  <input :id="id" class="date-picker-input" onkeypress="return false;"/>
  <button type="button" class="btn btn-outline-danger" v-on:click="goForward"><i class="material-icons datepicker-button-icon">keyboard_arrow_right</i></button>
</div>
`,
    watch: {
      index: function(val) {
        setDatePickerDate(this.datepicker, this.fulldata[val].Date);
      },
    },
  });
}
