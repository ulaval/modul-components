import '../../src/styles/main.scss';
import '../../src/utils/polyfills';

import Vue from 'vue';
import Router from 'vue-router';

import DatepickerPlugin from '../../src/components/datepicker/datepicker';
import DynamicTemplatePlugin from '../../src/components/dynamic-template/dynamic-template';
import SandboxesPlugin from '../../src/sandbox';
import UtilsPlugin, { UtilsPluginOptions } from '../../src/utils';
import { FRENCH } from '../../src/utils/i18n/i18n';
import MetaFactory from './meta-init';
import routerFactory from './router';

Vue.config.productionTip = false;

let utilsOptions: UtilsPluginOptions = {
    i18PluginOptions: {
        curLang: FRENCH
    }
};

// Vue.use(UtilsPlugin, utilsOptions);
Vue.use(SandboxesPlugin);
// Vue.use(FrenchPlugin);
// Vue.use(DefaultSpritesPlugin);

Vue.use(DynamicTemplatePlugin);

/* TESTS */
Vue.use(DatepickerPlugin);

/* ***** */

MetaFactory();

let router: Router = routerFactory();

const vue: Vue = new Vue({
    router,
    template: '<router-view></router-view>'
});

vue.$mount('#vue');
