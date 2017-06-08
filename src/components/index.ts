import Vue from 'vue';
import { PluginObject } from 'vue';

import LangPlugin from './lang/lang';
import AccordionPlugin from './accordion/accordion';
import AccordionGroupPlugin from './accordion-group/accordion-group';
import ButtonPlugin from './button/button';
import DynamicTemplatePlugin from './dynamic-template/dynamic-template';
import IconPlugin from './icon/icon';
import LinkPlugin from './link/link';
import ListBulletPlugin from './list-bullet/list-bullet';
import PanelPlugin from './panel/panel';
import StatusList from './status-list';
import TextIconPlugin from './text-icon/text-icon';
import TablePlugin from './table/table';
import DialogPlugin from './dialog/dialog';

const ComponentsPlugin: PluginObject<any> = {
    install(v, options) {
        Vue.use(LangPlugin);
        Vue.use(AccordionPlugin);
        Vue.use(AccordionGroupPlugin);
        Vue.use(ButtonPlugin);
        Vue.use(DynamicTemplatePlugin);
        Vue.use(IconPlugin);
        Vue.use(LinkPlugin);
        Vue.use(ListBulletPlugin);
        Vue.use(PanelPlugin);
        Vue.use(TextIconPlugin);
        Vue.use(StatusList);
        Vue.use(TablePlugin);
        Vue.use(DialogPlugin);
    }
};

export default ComponentsPlugin;
