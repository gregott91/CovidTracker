import {retrieveCovidData} from './data';
import {startApp} from './component';

async function start() {
  const data = await retrieveCovidData();
  startApp(data);
}

start();
