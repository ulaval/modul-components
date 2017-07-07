import { PluginObject } from 'vue';
import {
    ACCORDION_NAME, ACCORDION_GROUP_NAME, BUTTON_NAME, BUTTON_GROUP_NAME, CHECKBOX_NAME, DIALOG_NAME, DROPDOWN_NAME, DYNAMIC_TEMPLATE_NAME, I18N_NAME, LIMIT_TEXT_NAME, ICON_NAME, LINK_NAME,
    LIST_BULLET_NAME, MESSAGE_NAME, PANEL_NAME, POPPER_LIST_NAME, POPPER_NAME, RADIO_BUTTONS_NAME, SPINNER_NAME, STATUS_LIST_NAME, STEP_NAME, SWITCH_NAME, TABLE_NAME, TEMPLATE_NAME, TEXT_FIELD_NAME,
    UPLOAD_NAME
} from '../components/component-names';
import { RIPPLE_EFFECT_NAME } from '../directives/directive-names';
import { Meta } from './meta';

export class MetaAll implements PluginObject<any> {
    public install(v, options) {
        if (!options) {
            throw new Error('MetaAll.install -> you must provide a Meta object within the options argument');
        }
        (options as Meta).mergeComponentMeta(ACCORDION_NAME, require('../components/accordion/accordion.meta.json'));
        (options as Meta).mergeComponentMeta(ACCORDION_GROUP_NAME, require('../components/accordion-group/accordion-group.meta.json'));
        (options as Meta).mergeComponentMeta(BUTTON_NAME, require('../components/button/button.meta.json'));
        (options as Meta).mergeComponentMeta(BUTTON_GROUP_NAME, require('../components/button-group/button-group.meta.json'));
        (options as Meta).mergeComponentMeta(CHECKBOX_NAME, require('../components/checkbox/checkbox.meta.json'));
        (options as Meta).mergeComponentMeta(DIALOG_NAME, require('../components/dialog/dialog.meta.json'));
        (options as Meta).mergeComponentMeta(DROPDOWN_NAME, require('../components/dropdown/dropdown.meta.json'));
        (options as Meta).mergeComponentMeta(DYNAMIC_TEMPLATE_NAME, require('../components/dynamic-template/dynamic-template.meta.json'));
        (options as Meta).mergeComponentMeta(I18N_NAME, require('../components/i18n/i18n.meta.json'));
        (options as Meta).mergeComponentMeta(ICON_NAME, require('../components/icon/icon.meta.json'));
        (options as Meta).mergeComponentMeta(LIMIT_TEXT_NAME, require('../components/limit-text/limit-text.meta.json'));
        (options as Meta).mergeComponentMeta(LINK_NAME, require('../components/link/link.meta.json'));
        (options as Meta).mergeComponentMeta(LIST_BULLET_NAME, require('../components/list-bullet/list-bullet.meta.json'));
        (options as Meta).mergeComponentMeta(MESSAGE_NAME, require('../components/message/message.meta.json'));
        (options as Meta).mergeComponentMeta(PANEL_NAME, require('../components/panel/panel.meta.json'));
        (options as Meta).mergeComponentMeta(POPPER_LIST_NAME, require('../components/popper-list/popper-list.meta.json'));
        (options as Meta).mergeComponentMeta(POPPER_NAME, require('../components/popper/popper.meta.json'));
        (options as Meta).mergeComponentMeta(RADIO_BUTTONS_NAME, require('../components/radio-buttons/radio-buttons.meta.json'));
        (options as Meta).mergeComponentMeta(SPINNER_NAME, require('../components/spinner/spinner.meta.json'));
        (options as Meta).mergeComponentMeta(STATUS_LIST_NAME, require('../components/status-list/status-list.meta.json'));
        (options as Meta).mergeComponentMeta(STEP_NAME, require('../components/step/step.meta.json'));
        (options as Meta).mergeComponentMeta(SWITCH_NAME, require('../components/switch/switch.meta.json'));
        (options as Meta).mergeComponentMeta(TABLE_NAME, require('../components/table/table.meta.json'));
        (options as Meta).mergeComponentMeta(TEMPLATE_NAME, require('../components/template/template.meta.json'));
        (options as Meta).mergeComponentMeta(TEXT_FIELD_NAME, require('../components/text-field/text-field.meta.json'));
        (options as Meta).mergeComponentMeta(UPLOAD_NAME, require('../components/upload/upload.meta.json'));
        (options as Meta).mergeComponentMeta(RIPPLE_EFFECT_NAME, require('../directives/ripple-effect/ripple-effect.meta.json'));
    }
}

export default new MetaAll();
