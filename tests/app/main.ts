import './polyfills';
import Vue from 'vue';
import router from './router';

import ComponentsPlugin from '../../src/components';
import DirectivesPlugin from '../../src/directives';
import UtilsPlugin, { UtilsPluginOptions } from '../../src/utils';

Vue.config.productionTip = false;

const utilsPluginOptions: UtilsPluginOptions = {
    securityPluginOptions: {
        protectedUrls: []
    }
};

Vue.use(ComponentsPlugin);
Vue.use(DirectivesPlugin);
Vue.use(UtilsPlugin, utilsPluginOptions);

const vue = new Vue({
    router,
    template: '<router-view></router-view>'
});

vue.$mount('#vue');
