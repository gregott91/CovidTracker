import {initializeDatapointComponent} from './vue-datapoint';
import {initializeDatePickerComponent} from './vue-datepicker';
import {initializeDataTypesComponent} from './vue-datatypes';
import {initializeGraphComponent} from './vue-graph';
import {initializeFooterComponent} from './vue-footer';
import {initializeDaysToComponent} from './vue-daysto';

export function initializeComponents(observable) {
  initializeDatapointComponent();
  initializeDatePickerComponent(observable);
  initializeDataTypesComponent(observable);
  initializeFooterComponent();
  initializeGraphComponent();
  initializeDaysToComponent();
}
