import Vue from 'vue';

import MessagePlugin, { currentLang, ENGLISH } from '../src/utils/i18n/i18n';

currentLang(ENGLISH);
Vue.use(MessagePlugin);
