import Vue from 'vue';

export function setValue(data, property, toSet) {
  Vue.set(data, property, toSet);
}
