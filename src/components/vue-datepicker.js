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
  <div class="date-picker">
    <a class="btn-floating btn-small waves-effect waves-light red" v-on:click="goBack"><i class="material-icons">keyboard_arrow_left</i></a>
    <input :id="id" class="date-picker-input" onkeypress="return false;"/>
    <a class="btn-floating btn-small waves-effect waves-light red" v-on:click="goForward"><i class="material-icons">keyboard_arrow_right</i></a>
  </div>
</div>
`,
    watch: {
      index: function(val) {
        setDatePickerDate(this.datepicker, this.fulldata[val].Date);
      },
    },
  });
}
