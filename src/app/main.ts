import './polyfills';
import Vue from 'vue';
import router from './router';

import ButtonPlugin from '@/components/button/button';
import ListPlugin from '@/components/list/list';
import DynamicTemplatePlugin from '@/components/dynamic-template/dynamic-template';

Vue.config.productionTip = false;

Vue.use(ButtonPlugin);
Vue.use(ListPlugin);
Vue.use(DynamicTemplatePlugin);

const vue = new Vue({
    router,
    template: '<router-view></router-view>'
});

vue.$mount('#vue');
