import './polyfills';
import Vue from 'vue';
import router from './router';

import AccordionPlugin from '@/components/accordion/accordion';
import AccordionGroupPlugin from '@/components/accordion-group/accordion-group';
import ButtonPlugin from '@/components/button/button';
import DynamicTemplatePlugin from '@/components/dynamic-template/dynamic-template';
import LinkPlugin from '@/components/link/link';
import ListBulletPlugin from '@/components/list-bullet/list-bullet';
import RippleEffectPlugin from '@/components/ripple-effect/ripple-effect';
import TextIconPlugin from '@/components/text-icon/text-icon';
import StatusList from '@/components/status-list';
import IconPlugin from '@/components/icon/icon';
import PanelPlugin from '@/components/panel/panel';

Vue.config.productionTip = false;

Vue.use(PanelPlugin);
Vue.use(StatusList);
Vue.use(TextIconPlugin);
Vue.use(RippleEffectPlugin);
Vue.use(ListBulletPlugin);
Vue.use(LinkPlugin);
Vue.use(DynamicTemplatePlugin);
Vue.use(ButtonPlugin);
Vue.use(AccordionPlugin);
Vue.use(AccordionGroupPlugin);
Vue.use(IconPlugin);

const vue = new Vue({
    router,
    template: '<router-view></router-view>'
});

vue.$mount('#vue');
