import Vue from 'vue';
import { PluginObject } from 'vue';

import LangPlugin from './lang/lang';
import ButtonPlugin from './button/button';
import DynamicTemplatePlugin from './dynamic-template/dynamic-template';
import IconPlugin from './icon/icon';
import LinkPlugin from './link/link';
import ListBulletPlugin from './list-bullet/list-bullet';
import PanelPlugin from './panel/panel';
import RippleEffectPlugin from './ripple-effect/ripple-effect';
import StatusList from './status-list';
import TextIconPlugin from './text-icon/text-icon';

const ComponentsPlugin: PluginObject<any> = {
    install(v, options) {
        Vue.use(LangPlugin);
        Vue.use(ButtonPlugin);
        Vue.use(DynamicTemplatePlugin);
        Vue.use(IconPlugin);
        Vue.use(LinkPlugin);
        Vue.use(ListBulletPlugin);
        Vue.use(PanelPlugin);
        Vue.use(RippleEffectPlugin);
        Vue.use(TextIconPlugin);
        Vue.use(StatusList);
    }
};

export default ComponentsPlugin;
