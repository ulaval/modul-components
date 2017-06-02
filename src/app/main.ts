import './polyfills';
import Vue from 'vue';
import router from './router';

import ButtonPlugin from '@/components/button/button';
import DynamicTemplatePlugin from '@/components/dynamic-template/dynamic-template';
import LinkPlugin from '@/components/link/link';
import ListPlugin from '@/components/list-bullet/list-bullet';
import RippleEffectPlugin from '@/components/ripple-effect/ripple-effect';
import TextIconPlugin from '@/components/text-icon/text-icon';
import StatusList from '@/components/status-list';
import IconPlugin from '@/components/icon/icon';
import PanelPlugin from '@/components/panel/panel';

Vue.config.productionTip = false;

Vue.use(ButtonPlugin);
Vue.use(DynamicTemplatePlugin);
Vue.use(LinkPlugin);
Vue.use(ListPlugin);
Vue.use(RippleEffectPlugin);
Vue.use(TextIconPlugin);
Vue.use(StatusList);
Vue.use(IconPlugin);
Vue.use(PanelPlugin);

const vue = new Vue({
    router,
    template: '<router-view></router-view>'
});

vue.$mount('#vue');
