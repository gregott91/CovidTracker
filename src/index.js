import {retrieveCovidData} from './api';
import {startApp} from './root';
import {transformData} from './data';

async function start() {
  console.log('Starting download');
  const data = await retrieveCovidData();
  console.log('Download complete, starting data transformation');
  const transformed = transformData(data);
  console.log('Transformation complete, starting app');
  startApp(transformed);
  console.log('App started');
}

start();
