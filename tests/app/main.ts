import '../../src/utils/polyfills';
import Vue from 'vue';
import Router from 'vue-router';
import routerFactory from './router';
import '../../src/styles/main.scss';

import ComponentsPlugin from '../../src/components';
import DirectivesPlugin from '../../src/directives';
import UtilsPlugin, { UtilsPluginOptions } from '../../src/utils';

import I18nLanguagePlugin, { FRENCH, I18nPluginOptions } from '../../src/utils/i18n/i18n';
import FrenchPlugin from '../../src/lang/fr';
import DefaultSpritesPlugin from '../../src/utils/svg/default-sprites';

import MetaFactory from './meta-init';

Vue.config.productionTip = false;

const utilsPluginOptions: UtilsPluginOptions = {
    securityPluginOptions: {
        protectedUrls: []
    }
};

let i18nOptions: I18nPluginOptions = {
    curLang: FRENCH
};
Vue.use(I18nLanguagePlugin, i18nOptions);

Vue.use(ComponentsPlugin);
Vue.use(DirectivesPlugin);
Vue.use(UtilsPlugin, utilsPluginOptions);

Vue.use(FrenchPlugin);
Vue.use(DefaultSpritesPlugin);

MetaFactory();

let router: Router = routerFactory();

const vue = new Vue({
    router,
    template: '<router-view></router-view>'
});

vue.$mount('#vue');
