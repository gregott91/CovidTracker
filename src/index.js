import {retrieveCovidData} from './data';
import {startApp} from './root';

async function start() {
  const data = await retrieveCovidData();
  startApp(data);
}

start();
