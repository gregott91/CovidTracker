import {retrieveCovidData} from './api';
import {startApp} from './root';
import {transformData} from './data';
import {configureGlobalShortcuts} from './shortcuts';
import {Observable} from './observable';

async function start() {
  console.log('Starting download');
  const data = await retrieveCovidData();
  console.log('Download complete');
  const transformed = transformData(data);
  console.log('Transformation complete');
  const observable = new Observable();
  configureGlobalShortcuts(observable);
  console.log('Shortcuts configured');
  startApp(transformed, observable);
  console.log('App started');
}

start();
