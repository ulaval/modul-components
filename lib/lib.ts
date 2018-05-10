import '../src/utils/polyfills';
import Vue from 'vue';
import '../src/styles/main.scss';

import ComponentsPlugin from '../src/components';
import DirectivesPlugin from '../src/directives';
import FiltersPlugin from '../src/filters';
import UtilsPlugin, { UtilsPluginOptions } from '../src/utils';

import { FRENCH } from '../src/utils/i18n/i18n';
import FrenchPlugin from '../src/lang/fr';
import DefaultSpritesPlugin from '../src/utils/svg/default-sprites';

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
