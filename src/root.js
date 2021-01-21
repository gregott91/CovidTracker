import Vue from 'vue';
import {Observable} from './observable';
import {initializeDatapointComponent} from './components/datapoint';
import {initializeDatePickerComponent} from './components/datepicker';
import {ARROW_ACTION, EVENT_TYPE} from './constants';
import {getIndexForDate} from './data';
import {setValue} from './vue-helpers';

export function startApp(covidData) {
  const observable = new Observable();

  defineComponents(observable);
  defineApp(covidData, observable);
}

function defineComponents(dateObservable) {
  initializeDatapointComponent();
  initializeDatePickerComponent(dateObservable);
}

function defineApp(covidData, dateObservable) {
  const data = {
    index: 0,
    datatype: 'Deaths',
    datapoint: covidData['DailyData'],
  };

  new Vue({
    el: '#app',
    data: data,
  });

  dateObservable.subscribe(EVENT_TYPE.ARROW_CLICKED, (event) => {
    const changeIndex = (addition) => {
      setValue(data, 'index', data.index + addition);
    };

    switch (event) {
      case ARROW_ACTION.BACKWARD: changeIndex(1); break;
      case ARROW_ACTION.FORWARD: changeIndex(-1); break;
    }
  });

  dateObservable.subscribe(EVENT_TYPE.DATE_CHANGED, (event) => {
    const index = getIndexForDate(event, covidData);
    setValue(data, 'index', index);
  });
}
