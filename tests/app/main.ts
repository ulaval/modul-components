
import Vue from 'vue';
import Router from 'vue-router';
import DynamicTemplatePlugin from '../../src/components/dynamic-template/dynamic-template';
import FlexTemplatePlugin from '../../src/components/flex-template/flex-template';
import LinkPlugin from '../../src/components/link/link';
import TooltipSandboxPlugin from '../../src/components/tooltip/tooltip.sandbox';
import TemplatePlugin from '../../src/components/template/template';
import '../../src/styles/main.scss';
import UtilsPlugin, { FRENCH, UtilsPluginOptions, ENGLISH } from '../../src/utils';
import '../../src/utils/polyfills';
import DefaultSpritesPlugin from '../../src/utils/svg/default-sprites';
import { AppFrame } from './app-frame/app-frame';
import MetaFactory from './meta-init';
import routerFactory from './router';
import EnglishPlugin from '../../src/lang/en';


Vue.config.productionTip = false;

let utilsOptions: UtilsPluginOptions = {
    propagateVueParserErrors: false,
    i18PluginOptions: {
        curLang: ENGLISH
    }
};

Vue.use(UtilsPlugin, utilsOptions);

Vue.use(EnglishPlugin);

Vue.use(DefaultSpritesPlugin);

// required components
Vue.use(FlexTemplatePlugin);
Vue.use(LinkPlugin);
Vue.use(DynamicTemplatePlugin);
Vue.use(TemplatePlugin);

// Vue.use(getSandboxPlugin());
// Vue.use(FrenchPlugin);
// Vue.use(DefaultSpritesPlugin);
// Vue.use(ComponentsPlugin, { richTextOptions: { key: 'test' } }); // Fake key to avoid error in test pages.
// initialize all sandboxes
// Vue.use(getSandboxPlugin());


Vue.use(TooltipSandboxPlugin);


Vue.component('app-frame', AppFrame);

MetaFactory();

let router: Router = routerFactory();

const vue: Vue = new Vue({
    router,
    template: '<app-frame></app-frame>'
});

vue.$mount('#vue');
