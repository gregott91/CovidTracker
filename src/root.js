import Vue from 'vue';
import {initializeComponents} from './components/components';
import {ARROW_ACTION, EVENT_TYPE, QUERY_PARAMETER} from './constants';
import {getIndexForDate} from './data';
import {setValue} from './vue-helpers';
import {setQueryParameter} from './query';

export function startApp(covidData, observable) {
  initializeComponents(observable);
  defineApp(covidData, observable);
}

function defineApp(covidData, observable) {
  const vueData = {
    index: 0,
    retrievaltime: covidData.RetrievalTimeDisplay,
    datatypes: covidData.DataTypes,
    fulldatatypes: covidData.FullDataTypes,
    selecteddatatype: covidData.DataTypes[0],
    datatypepositivity: covidData.DataTypeRenderInfo[covidData.DataTypes[0]].IsPositive,
    datatypecumulative: covidData.DataTypeRenderInfo[covidData.DataTypes[0]].IsCumulative,
    fulldata: covidData.DailyData,
  };

  new Vue({
    el: '#app',
    data: vueData,
  });

  subscribeToEvents(observable, vueData, covidData);
}

function subscribeToEvents(observable, vueData, covidData) {
  observable.subscribe(EVENT_TYPE.ARROW_CLICKED, (arrowAction) => {
    const changeIndex = (addition) => {
      setDataIndex(vueData, vueData.index + addition);
    };

    switch (arrowAction) {
      case ARROW_ACTION.BACKWARD: changeIndex(1); break;
      case ARROW_ACTION.FORWARD: changeIndex(-1); break;
    }
  });

  observable.subscribe(EVENT_TYPE.DATE_CHANGED, (date) => {
    const index = getIndexForDate(date, covidData);

    setDataIndex(vueData, index);
  });

  observable.subscribe(EVENT_TYPE.DATATYPE_CHANGED, (datatype) => {
    vueData.datatypepositivity = covidData.DataTypeRenderInfo[datatype].IsPositive;
    vueData.datatypecumulative = covidData.DataTypeRenderInfo[datatype].IsCumulative;
    setValue(vueData, 'selecteddatatype', datatype);
    setQueryParameter(QUERY_PARAMETER.SELECTED_DATATYPE, datatype);
  });
}

function setDataIndex(data, index) {
  if (index < data.fulldata.length && index >= 0) {
    setValue(data, 'index', index);
    setQueryParameter(QUERY_PARAMETER.DATE, data.fulldata[index].Date);
  }
}
