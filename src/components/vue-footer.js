import Vue from 'vue';

export function initializeFooterComponent() {
  Vue.component('vue-footer', {
    props: ['retrievaltime'],
    template: `
<footer class="footer mt-auto py-2">
  <div class="container">
    <div class="row">
      <div class="col-sm-4">
        <a class="text-muted footer-text" href="https://github.com/gregott91/CovidTracker">See the source on GitHub</a>
      </div>
      <div class="col-sm-4">
        <span class="text-muted footer-text">Built using data from The COVID Tracking Project</span>
      </div>
      <div class="col-sm-4">
        <span class="text-muted footer-text">Data last refreshed on: {{ retrievaltime }}</span>
      </div>
    </div>
  </div>
</footer>`,
  });
}
