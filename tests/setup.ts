import Vue from 'vue';

import MessagePlugin, { ENGLISH, I18nPluginOptions, DebugMode } from '../src/utils/i18n/i18n';
import LoggerPlugin from '../src/utils/logger/logger';

let i18nOptions: I18nPluginOptions = {
    curLang: ENGLISH,
    debug: DebugMode.Warn
};

Vue.config.productionTip = false;
Vue.config.silent = true;
Vue.use(LoggerPlugin);
Vue.use(MessagePlugin, i18nOptions);
