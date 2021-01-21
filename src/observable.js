export class Observable {
  constructor() {
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  publish(event) {
    this.subscribers.forEach((subscriber) => subscriber(event));
  }
}
