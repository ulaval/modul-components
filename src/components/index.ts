import Vue from 'vue';
import { PluginObject } from 'vue';

import AccordionGroupPlugin from './accordion-group/accordion-group';
import AccordionPlugin from './accordion/accordion';
import ButtonPlugin from './button/button';
import CheckboxPlugin from './checkbox/checkbox';
import DialogPlugin from './dialog/dialog';
import DropdownPlugin from './dropdown/dropdown';
import DynamicTemplatePlugin from './dynamic-template/dynamic-template';
import IconPlugin from './icon/icon';
import I18nPlugin from './i18n/i18n';
import LinkPlugin from './link/link';
import ListBulletPlugin from './list-bullet/list-bullet';
import MessagePlugin from './message/message';
import PanelPlugin from './panel/panel';
import PopperPlugin from './popper/popper';
import PopperListPlugin from './popper-list/popper-list';
import RadioButtonsPlugin from './radio-buttons/radio-buttons';
import StatusList from './status-list/status-list';
import StepPlugin from './step/step';
import TabPanePlugin from './tab-pane/tab-pane';
import TablePlugin from './table/table';
import TabsPlugin from './tabs/tabs';
import Template from './template/template';
import TextFieldPlugin from './text-field/text-field';
import UploadPlugin from './upload/upload';

const ComponentsPlugin: PluginObject<any> = {
    install(v, options) {
        Vue.use(AccordionGroupPlugin);
        Vue.use(AccordionPlugin);
        Vue.use(ButtonPlugin);
        Vue.use(CheckboxPlugin);
        Vue.use(DialogPlugin);
        Vue.use(DropdownPlugin);
        Vue.use(DynamicTemplatePlugin);
        Vue.use(IconPlugin);
        Vue.use(I18nPlugin);
        Vue.use(LinkPlugin);
        Vue.use(ListBulletPlugin);
        Vue.use(MessagePlugin);
        Vue.use(PanelPlugin);
        Vue.use(PopperPlugin);
        Vue.use(PopperListPlugin);
        Vue.use(RadioButtonsPlugin);
        Vue.use(StatusList);
        Vue.use(StepPlugin);
        Vue.use(TabPanePlugin);
        Vue.use(TablePlugin);
        Vue.use(TabsPlugin);
        Vue.use(Template);
        Vue.use(TextFieldPlugin);
        Vue.use(UploadPlugin);
    }
};

export default ComponentsPlugin;
