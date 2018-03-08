import Vue from 'vue';

import MessagePlugin, { currentLang, ENGLISH } from '../src/utils/i18n/i18n';

Vue.config.productionTip = false;
Vue.config.silent = true;
currentLang(ENGLISH);
Vue.use(MessagePlugin);
