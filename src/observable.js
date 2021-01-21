export class Observable {
  constructor() {
    this.subscribers = {};
  }

  subscribe(eventType, callback) {
    this.validate(eventType);
    this.subscribers[eventType].push(callback);
  }

  publish(eventType, data) {
    this.validate(eventType);
    this.subscribers[eventType].forEach((subscriber) => subscriber(data));
  }

  validate(eventType) {
    if (!this.subscribers[eventType]) {
      this.subscribers[eventType] = [];
    }
  }
}
