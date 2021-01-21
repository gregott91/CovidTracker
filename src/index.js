import {retrieveCovidData} from './api';
import {startApp} from './root';
import {transformData} from './data';

async function start() {
  const data = await retrieveCovidData();
  startApp(transformData(data));
}

start();
