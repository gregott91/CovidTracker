import Vue from 'vue'

function component() {
  let doThing = (name) => { return `hello ${name}` }  
  
  const element = document.createElement('div');
  
    element.innerHTML = doThing("webpack")
  
    return element;
}
  
  document.body.appendChild(component());