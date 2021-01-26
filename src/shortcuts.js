import {ARROW_ACTION, EVENT_TYPE} from './constants';

export function configureGlobalShortcuts(observable) {
  document.onkeydown = function(event) {
    switch (event.code) {
      case 'ArrowLeft':
        observable.publish(EVENT_TYPE.ARROW_CLICKED, ARROW_ACTION.BACKWARD);
        break;
      case 'ArrowRight':
        observable.publish(EVENT_TYPE.ARROW_CLICKED, ARROW_ACTION.FORWARD);
        break;
    }
  };
}
