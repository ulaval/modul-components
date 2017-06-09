import Vue from 'vue';
import { PluginObject } from 'vue';

import AccordionGroupPlugin from './accordion-group/accordion-group';
import AccordionPlugin from './accordion/accordion';
import ButtonPlugin from './button/button';
import DialogPlugin from './dialog/dialog';
import DynamicTemplatePlugin from './dynamic-template/dynamic-template';
import IconPlugin from './icon/icon';
import LangPlugin from './lang/lang';
import LinkPlugin from './link/link';
import ListBulletPlugin from './list-bullet/list-bullet';
import PanelPlugin from './panel/panel';
import StatusList from './status-list';
import TablePlugin from './table/table';
import TextIconPlugin from './text-icon/text-icon';
import MessagePlugin from './message/message';

/* Avec la libs element-ui */
import { Upload } from 'element-ui';
import UploadPlugin from './upload/upload';

const ComponentsPlugin: PluginObject<any> = {
    install(v, options) {
        Vue.use(AccordionGroupPlugin);
        Vue.use(AccordionPlugin);
        Vue.use(ButtonPlugin);
        Vue.use(DialogPlugin);
        Vue.use(DynamicTemplatePlugin);
        Vue.use(IconPlugin);
        Vue.use(LangPlugin);
        Vue.use(LinkPlugin);
        Vue.use(ListBulletPlugin);
        Vue.use(PanelPlugin);
        Vue.use(StatusList);
        Vue.use(TablePlugin);
        Vue.use(TextIconPlugin);
        Vue.use(MessagePlugin);

        /* Avec la libs element-ui */
        Vue.component(Upload.name, Upload);
        Vue.use(UploadPlugin);
    }
};

export default ComponentsPlugin;
