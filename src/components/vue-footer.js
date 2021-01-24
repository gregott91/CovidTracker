import Vue from 'vue';

export function initializeFooterComponent() {
  Vue.component('vue-footer', {
    props: ['retrievaltime'],
    template: `
<div class="footer">
  <footer class="page-footer grey darken-1">Data last retrieved on: {{ retrievaltime }}</footer>
</div>
    `,
  });
}
