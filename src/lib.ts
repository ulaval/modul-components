import Vue from 'vue';
import '../src/styles/main.scss';
import ComponentsPlugin from './components';
import DirectivesPlugin from './directives';
import FiltersPlugin from './filters';
import FrenchPlugin from './lang/fr';
import UtilsPlugin, { UtilsPluginOptions } from './utils';
import { FRENCH } from './utils/i18n/i18n';
import './utils/polyfills';
import DefaultSpritesPlugin from './utils/svg/default-sprites';



Vue.config.productionTip = false;

const utilsPluginOptions: UtilsPluginOptions = {
    i18PluginOptions: {
        curLang: FRENCH
    }
};

Vue.use(UtilsPlugin, utilsPluginOptions);
Vue.use(ComponentsPlugin);
Vue.use(DirectivesPlugin);
Vue.use(FiltersPlugin);

Vue.use(FrenchPlugin);
Vue.use(DefaultSpritesPlugin);

