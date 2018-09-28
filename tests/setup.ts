import Vue from 'vue';

import MessagePlugin, { DebugMode, ENGLISH, FormatMode, I18nPluginOptions } from '../src/utils/i18n/i18n';
import LoggerPlugin, { ConsoleOptions } from '../src/utils/logger/logger';

let i18nOptions: I18nPluginOptions = {
    curLang: ENGLISH,
    debug: DebugMode.Warn,
    formatMode: FormatMode.Vsprintf
};

let consoleOptions: ConsoleOptions = {
    displayDebugs: false
};

Vue.config.productionTip = false;
Vue.config.silent = true;
Vue.use(LoggerPlugin, consoleOptions);
Vue.use(MessagePlugin, i18nOptions);
