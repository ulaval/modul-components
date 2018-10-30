import '../../src/styles/main.scss';
import '../../src/utils/polyfills';

import Vue from 'vue';
import Router from 'vue-router';

import ComponentsPlugin from '../../src/components';
import DirectivesPlugin from '../../src/directives';
import FiltersPlugin from '../../src/filters';
import FrenchPlugin from '../../src/lang/fr';
import UtilsPlugin, { UtilsPluginOptions } from '../../src/utils';
import { FRENCH } from '../../src/utils/i18n/i18n';
import DefaultSpritesPlugin from '../../src/utils/svg/default-sprites';
import { AppFrame } from './app-frame/app-frame';
import MetaFactory from './meta-init';
import routerFactory from './router';
import { getSandboxPlugin } from './sandbox-loader';

Vue.config.productionTip = false;

let utilsOptions: UtilsPluginOptions = {
    propagateVueParserErrors: false,
    i18PluginOptions: {
        curLang: FRENCH
    }
};

Vue.use(UtilsPlugin, utilsOptions);
Vue.use(ComponentsPlugin, { richTextOptions: { key: 'test' } }); // Fake key to avoid error in test pages.
Vue.use(DirectivesPlugin);
Vue.use(FiltersPlugin);
Vue.use(FrenchPlugin);
Vue.use(DefaultSpritesPlugin);

// initialize all sandboxes
Vue.use(getSandboxPlugin());

Vue.component('app-frame', AppFrame);

MetaFactory();

let router: Router = routerFactory();

const vue: Vue = new Vue({
    router,
    template: '<app-frame></app-frame>'
});

vue.$mount('#vue');
