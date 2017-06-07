import Vue from 'vue';
import { PluginObject } from 'vue';

import LangPlugin from './lang/lang';
import AccodrionPlugin from './accordion/accordion';
import AccodrionGroupPlugin from './accordion-group/accordion-group';
import ButtonPlugin from './button/button';
import DynamicTemplatePlugin from './dynamic-template/dynamic-template';
import IconPlugin from './icon/icon';
import LinkPlugin from './link/link';
import ListBulletPlugin from './list-bullet/list-bullet';
import PanelPlugin from './panel/panel';
import RippleEffectPlugin from './ripple-effect/ripple-effect';
import StatusList from './status-list';
import TextIconPlugin from './text-icon/text-icon';
import TablePlugin from './table/table';

const ComponentsPlugin: PluginObject<any> = {
    install(v, options) {
        Vue.use(LangPlugin);
        Vue.use(AccodrionPlugin);
        Vue.use(AccodrionGroupPlugin);
        Vue.use(ButtonPlugin);
        Vue.use(DynamicTemplatePlugin);
        Vue.use(IconPlugin);
        Vue.use(LinkPlugin);
        Vue.use(ListBulletPlugin);
        Vue.use(PanelPlugin);
        Vue.use(RippleEffectPlugin);
        Vue.use(TextIconPlugin);
        Vue.use(StatusList);
        Vue.use(TablePlugin);
    }
};

export default ComponentsPlugin;
