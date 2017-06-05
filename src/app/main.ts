import './polyfills';
import Vue from 'vue';
import router from './router';

import ComponentsPlugin from '../components';
import DirectivesPlugin from '../directives';
import UtilsPlugin from '../utils';

Vue.config.productionTip = false;

Vue.use(ComponentsPlugin);
Vue.use(DirectivesPlugin);
Vue.use(UtilsPlugin);

const vue = new Vue({
    router,
    template: '<router-view></router-view>'
});

vue.$mount('#vue');
