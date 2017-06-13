import '../../src/utils/polyfills';
import Vue from 'vue';
import router from './router';

import ComponentsPlugin from '../../src/components';
import DirectivesPlugin from '../../src/directives';
import UtilsPlugin, { UtilsPluginOptions } from '../../src/utils';

import I18nLanguagePlugin, { currentLang, FRENCH } from '../../src/utils/i18n';
import FrenchPlugin from '../../src/lang/fr';

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

const vue = new Vue({
    router,
    template: '<router-view></router-view>'
});

vue.$mount('#vue');
