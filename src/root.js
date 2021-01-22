import Vue from 'vue';
import {Observable} from './observable';
import {initializeDatapointComponent} from './components/vue-datapoint';
import {initializeDatePickerComponent} from './components/vue-datepicker';
import {initializeDataTypesComponent} from './components/vue-datatypes';
import {ARROW_ACTION, EVENT_TYPE} from './constants';
import {getIndexForDate, getDataTypes} from './data';
import {setValue} from './vue-helpers';

export function startApp(covidData) {
  const observable = new Observable();

  defineComponents(observable);
  defineApp(covidData, observable);
}

function defineComponents(observable) {
  initializeDatapointComponent();
  initializeDatePickerComponent(observable);
  initializeDataTypesComponent(observable);
}

function defineApp(covidData, observable) {
  const dataTypes = getDataTypes(covidData);

  const data = {
    index: 0,
    datatypes: getDataTypes(covidData),
    selecteddatatype: dataTypes[0],
    fulldata: covidData['DailyData'],
  };

  new Vue({
    el: '#app',
    data: data,
  });

  subscribeToEvents(observable, data);
}

function subscribeToEvents(observable, data) {
  observable.subscribe(EVENT_TYPE.ARROW_CLICKED, (arrowAction) => {
    const changeIndex = (addition) => {
      setDataIndex(data, data.index + addition);
    };

    switch (arrowAction) {
      case ARROW_ACTION.BACKWARD: changeIndex(1); break;
      case ARROW_ACTION.FORWARD: changeIndex(-1); break;
    }
  });

  observable.subscribe(EVENT_TYPE.DATE_CHANGED, (date) => {
    const index = getIndexForDate(date, covidData); // todo need to handle the -1 case
    setDataIndex(data, index);
  });

  observable.subscribe(EVENT_TYPE.DATATYPE_CHANGED, (datatype) => {
    setValue(data, 'selecteddatatype', datatype);
  });
}

function setDataIndex(data, index) {
  setValue(data, 'index', index);
}
