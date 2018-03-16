import './utils/polyfills';
import Vue from 'vue';
import './styles/main.scss';

import ComponentsPlugin from './components';
import DirectivesPlugin from './directives';
import UtilsPlugin, { UtilsPluginOptions } from './utils';

import I18nLanguagePlugin, { currentLang, FRENCH } from './utils/i18n/i18n';
import FrenchPlugin from './lang/fr';
import DefaultSpritesPlugin from './utils/svg/default-sprites';

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
