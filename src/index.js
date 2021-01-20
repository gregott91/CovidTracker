import Vue from 'vue'
import { retrieveCovidData } from '../src/data'

async function component() {
  let doThing = (name) => { return `hello ${name}` }  
  
  const element = document.createElement('div');
  
    element.innerHTML = doThing(await retrieveCovidData())
  
    return element;
}
 
component().then(result => document.body.appendChild(result))