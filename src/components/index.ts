import Vue from 'vue';
import { PluginObject } from 'vue';

import AccordionGroupPlugin from './accordion-group/accordion-group';
import AccordionPlugin from './accordion/accordion';
import ButtonPlugin from './button/button';
import CheckboxPlugin from './checkbox/checkbox';
import DialogPlugin from './dialog/dialog';
import DynamicTemplatePlugin from './dynamic-template/dynamic-template';
import IconPlugin from './icon/icon';
import I18nPlugin from './i18n/i18n';
import LinkPlugin from './link/link';
import ListBulletPlugin from './list-bullet/list-bullet';
import PanelPlugin from './panel/panel';
import StatusList from './status-list/status-list';
import TablePlugin from './table/table';
import TextFieldPlugin from './text-field/text-field';
import MessagePlugin from './message/message';
import UploadPlugin from './upload/upload';
import PopperPlugin from './popper/popper';
import PopperListPlugin from './popper-list/popper-list';
import DropdownPlugin from './dropdown/dropdown';
import StepPlugin from './step/step';
import Template from './template/template';

const ComponentsPlugin: PluginObject<any> = {
    install(v, options) {
        Vue.use(AccordionGroupPlugin);
        Vue.use(AccordionPlugin);
        Vue.use(ButtonPlugin);
        Vue.use(CheckboxPlugin);
        Vue.use(DialogPlugin);
        Vue.use(DynamicTemplatePlugin);
        Vue.use(IconPlugin);
        Vue.use(I18nPlugin);
        Vue.use(LinkPlugin);
        Vue.use(ListBulletPlugin);
        Vue.use(PanelPlugin);
        Vue.use(StatusList);
        Vue.use(TablePlugin);
        Vue.use(TextFieldPlugin);
        Vue.use(MessagePlugin);
        Vue.use(UploadPlugin);
        Vue.use(PopperPlugin);
        Vue.use(PopperListPlugin);
        Vue.use(DropdownPlugin);
        Vue.use(StepPlugin);
        Vue.use(Template);
    }
};

export default ComponentsPlugin;
