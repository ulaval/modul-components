import '../../src/utils/polyfills';
import Vue from 'vue';
import router from './router';
import '../../src/styles/main.scss';

import ComponentsPlugin from '../../src/components';
import DirectivesPlugin from '../../src/directives';
import UtilsPlugin, { UtilsPluginOptions } from '../../src/utils';

import Meta from '../../src/meta/meta';
import I18nLanguagePlugin, { currentLang, FRENCH } from '../../src/utils/i18n/i18n';
import FrenchPlugin from '../../src/lang/fr';
import DefaultSpritesPlugin from '../../src/utils/svg/default-sprites';

Vue.config.productionTip = false;

const utilsPluginOptions: UtilsPluginOptions = {
    securityPluginOptions: {
        protectedUrls: []
    }
};

Vue.use(ComponentsPlugin);
Vue.use(DirectivesPlugin);
Vue.use(UtilsPlugin, utilsPluginOptions);

currentLang(FRENCH);
Vue.use(I18nLanguagePlugin);
Vue.use(FrenchPlugin);
Vue.use(DefaultSpritesPlugin);

console.log('process', process);
// console.log('patate', patate);

const vue = new Vue({
    router,
    template: '<router-view></router-view>'
});

vue.$mount('#vue');
