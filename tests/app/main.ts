import '../../src/utils/polyfills';
import Vue from 'vue';
import Router from 'vue-router';
import routerFactory from './router';
import '../../src/styles/main.scss';

import ComponentsPlugin from '../../src/components';
import DirectivesPlugin from '../../src/directives';
import FiltersPlugin from '../../src/filters';
import UtilsPlugin, { UtilsPluginOptions } from '../../src/utils';

import { FRENCH } from '../../src/utils/i18n/i18n';
import FrenchPlugin from '../../src/lang/fr';
import DefaultSpritesPlugin from '../../src/utils/svg/default-sprites';

import MetaFactory from './meta-init';

Vue.config.productionTip = false;

let utilsOptions: UtilsPluginOptions = {
    i18PluginOptions: {
        curLang: FRENCH
    }
};

Vue.use(UtilsPlugin, utilsOptions);
Vue.use(ComponentsPlugin);
Vue.use(DirectivesPlugin);
Vue.use(FiltersPlugin);

Vue.use(FrenchPlugin);
Vue.use(DefaultSpritesPlugin);

MetaFactory();

let router: Router = routerFactory();

const vue = new Vue({
    router,
    template: '<router-view></router-view>'
});

vue.$mount('#vue');
