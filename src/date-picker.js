import datepicker from 'js-datepicker';
import {formatDateForDisplay, parseAsUTCDate} from './date-helpers';
import {EVENT_TYPE} from './constants';

export function initializeDatePicker(elementID, maxDate, minDate, observable) {
  const picker = datepicker(document.getElementById(elementID), {
    formatter: (input, date, instance) => {
      input.value = formatDateForDisplay(date);
    },
    onSelect: (instance, date) => {
      observable.publish(EVENT_TYPE.DATE_CHANGED, date);
    },
    maxDate: parseAsUTCDate(maxDate),
    minDate: parseAsUTCDate(minDate),
  });

  setDatePickerDate(picker, maxDate);

  return picker;
}

export function setDatePickerDate(datePicker, date) {
  datePicker.setDate(parseAsUTCDate(date), true);
}
