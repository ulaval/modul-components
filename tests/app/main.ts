
import Vue from 'vue';
import Router from 'vue-router';
import DynamicTemplatePlugin from '../../src/components/dynamic-template/dynamic-template';
import FlexTemplatePlugin from '../../src/components/flex-template/flex-template';
import LinkPlugin from '../../src/components/link/link';
import TemplatePlugin from '../../src/components/template/template';
import FrenchPlugin from '../../src/lang/fr';
import '../../src/styles/main.scss';
import { FRENCH } from '../../src/utils/i18n/i18n';
import '../../src/utils/polyfills';
import DefaultSpritesPlugin from '../../src/utils/svg/default-sprites';
import UtilsPlugin, { UtilsPluginOptions } from '../../src/utils/utils-plugin';
import { AppFrame } from './app-frame/app-frame';
import MetaFactory from './meta-init';
import routerFactory from './router';
import { getSandboxPlugin } from './sandbox-loader';

Vue.config.productionTip = false;

let utilsOptions: UtilsPluginOptions = {
    propagateVueParserErrors: false,
    i18PluginOptions: {
        curLang: FRENCH
    }
};

Vue.use(UtilsPlugin, utilsOptions);
Vue.use(FrenchPlugin);

// Vue.use(EnglishPlugin);
Vue.use(DefaultSpritesPlugin);
// required components
Vue.use(FlexTemplatePlugin);
Vue.use(LinkPlugin);
Vue.use(DynamicTemplatePlugin);
Vue.use(TemplatePlugin);

// initialize all sandboxes
Vue.use(getSandboxPlugin());

Vue.component('app-frame', AppFrame);

MetaFactory();

let router: Router = routerFactory();

const vue: Vue = new Vue({
    router,
    template: '<app-frame></app-frame>'
});

vue.$mount('#vue');
