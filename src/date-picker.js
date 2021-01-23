import datepicker from 'js-datepicker';
import {formatDateForDisplay} from './date-helpers';
import {EVENT_TYPE} from './constants';

export function initializeDatePicker(elementID, startDate, observable) {
  const picker = datepicker(document.getElementById(elementID), {
    formatter: (input, date, instance) => {
      input.value = formatDateForDisplay(date);
    },
    onSelect: (instance, date) => {
      observable.publish(EVENT_TYPE.DATE_CHANGED, date);
    },
  });

  setDatePickerDate(picker, startDate);

  return picker;
}

export function setDatePickerDate(datePicker, date) {
  datePicker.setDate(new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()), true);
}
