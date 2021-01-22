import Vue from 'vue';

export function initializeFooterComponent() {
  Vue.component('vue-footer', {
    props: ['retrievaltime'],
    template: `
    <div class="footer">
        Data last retrieved on: {{ retrievaltime }}
    </div>
    `,
  });
}
