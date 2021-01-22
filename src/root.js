import Vue from 'vue';
import {Observable} from './observable';
import {initializeDatapointComponent} from './components/vue-datapoint';
import {initializeDatePickerComponent} from './components/vue-datepicker';
import {ARROW_ACTION, EVENT_TYPE} from './constants';
import {getIndexForDate} from './data';
import {setValue} from './vue-helpers';

export function startApp(covidData) {
  const observable = new Observable();

  defineComponents(observable);
  defineApp(covidData, observable);
}

function defineComponents(observable) {
  initializeDatapointComponent();
  initializeDatePickerComponent(observable);
}

function defineApp(covidData, observable) {
  const data = {
    index: 0,
    datatype: 'Deaths',
    fulldata: covidData['DailyData'],
  };

  new Vue({
    el: '#app',
    data: data,
  });

  observable.subscribe(EVENT_TYPE.ARROW_CLICKED, (event) => {
    const changeIndex = (addition) => {
      setDataIndex(data, data.index + addition);
    };

    switch (event) {
      case ARROW_ACTION.BACKWARD: changeIndex(1); break;
      case ARROW_ACTION.FORWARD: changeIndex(-1); break;
    }
  });

  observable.subscribe(EVENT_TYPE.DATE_CHANGED, (event) => {
    const index = getIndexForDate(event, covidData); // todo need to handle the -1 case
    setDataIndex(data, index);
  });
}

function setDataIndex(data, index) {
  setValue(data, 'index', index);
}
