import Vue from 'vue';

export function initializeFooterComponent() {
  Vue.component('vue-footer', {
    props: ['retrievaltime'],
    template: `
<div class="footer">
  <footer class="footer">
    <div class="container">
      <span class="text-muted">Data last retrieved on: {{ retrievaltime }}</span>
    </div>
  </footer>
</div>
    `,
  });
}
