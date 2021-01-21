import Vue from 'vue';
import {Observable} from './observable';
import {initializeDatapointComponent} from './components/datapoint';
import {initializeDatePickerComponent} from './components/datepicker';
import {ARROW_ACTION} from './constants';

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

  dateObservable.subscribe((event) => {
    const changeIndex = (addition) => {
      Vue.set(data, 'index', data.index + addition);
    };

    switch (event) {
      case ARROW_ACTION.BACKWARD: changeIndex(1); break;
      case ARROW_ACTION.FORWARD: changeIndex(-1); break;
    }
  });
}
