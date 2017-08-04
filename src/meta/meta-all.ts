import { PluginObject } from 'vue';
import {
    ACCORDION_NAME, ACCORDION_GROUP_NAME, BULLET_LIST_NAME, BUTTON_NAME, BUTTON_GROUP_NAME, CHECKBOX_NAME, DIALOG_NAME, DROPDOWN_NAME, DROPDOWN_ITEM_NAME, DYNAMIC_TEMPLATE_NAME, I18N_NAME, LIMIT_TEXT_NAME, ICON_NAME, LINK_NAME, MESSAGE_NAME, NAV_BAR_NAME, NAV_BAR_ITEM_NAME, OPTIONS_MENU_NAME, PANEL_NAME, PANEL_DIALOG_NAME, POPPER_NAME, RADIO_BUTTONS_NAME, SECONDARY_DIALOG_NAME, SELECT_NAME, SPINNER_NAME, STATUS_LIST_NAME, STEP_NAME, SWITCH_NAME, TABLE_NAME, TABS_NAME, TEMPLATE_NAME, TEXT_FIELD_NAME,
    UPLOAD_NAME, UPLOAD_INPUT_NAME, UPLOAD_DRAGDROP_NAME, UPLOAD_FILESLIST_NAME
} from '../components/component-names';
import { RIPPLE_EFFECT_NAME } from '../directives/directive-names';
import { Meta } from './meta';

// should be i18n key format
export const CATEGORY_COMUNICATION: string = 'meta:communication';
export const CATEGORY_CONTENT: string = 'meta:content';
export const CATEGORY_FORMS: string = 'meta:forms';
export const CATEGORY_INDICATORS: string = 'meta:indicators';
export const CATEGORY_NAVIGATION: string = 'meta:navigation';
export const CATEGORY_SEARCH_SORT: string = 'meta:search-sort';
export const CATEGORY_LAYOUT: string = 'meta:layout';

export class MetaAll implements PluginObject<any> {
    public install(v, options) {
        if (!options) {
            throw new Error('MetaAll.install -> you must provide a Meta object within the options argument');
        }
        const meta: Meta = options as Meta;
        meta.mergeComponentMeta(ACCORDION_NAME, require('../components/accordion/accordion.meta.json'), CATEGORY_CONTENT);
        meta.mergeComponentMeta(ACCORDION_GROUP_NAME, require('../components/accordion-group/accordion-group.meta.json'), CATEGORY_CONTENT);
        meta.mergeComponentMeta(BULLET_LIST_NAME, require('../components/bullet-list/bullet-list.meta.json'), CATEGORY_LAYOUT);
        meta.mergeComponentMeta(BUTTON_NAME, require('../components/button/button.meta.json'), CATEGORY_FORMS);
        meta.mergeComponentMeta(BUTTON_GROUP_NAME, require('../components/button-group/button-group.meta.json'), CATEGORY_FORMS);
        meta.mergeComponentMeta(CHECKBOX_NAME, require('../components/checkbox/checkbox.meta.json'), CATEGORY_FORMS);
        meta.mergeComponentMeta(DIALOG_NAME, require('../components/dialog/dialog.meta.json'), CATEGORY_COMUNICATION);
        meta.mergeComponentMeta(DROPDOWN_NAME, require('../components/dropdown/dropdown.meta.json'), CATEGORY_FORMS);
        meta.mergeComponentMeta(DROPDOWN_ITEM_NAME, require('../components/dropdown-item/dropdown-item.meta.json'), CATEGORY_FORMS);
        meta.mergeComponentMeta(DYNAMIC_TEMPLATE_NAME, require('../components/dynamic-template/dynamic-template.meta.json'), CATEGORY_LAYOUT);
        meta.mergeComponentMeta(I18N_NAME, require('../components/i18n/i18n.meta.json'));
        meta.mergeComponentMeta(ICON_NAME, require('../components/icon/icon.meta.json'), CATEGORY_INDICATORS);
        meta.mergeComponentMeta(LIMIT_TEXT_NAME, require('../components/limit-text/limit-text.meta.json'), CATEGORY_CONTENT);
        meta.mergeComponentMeta(LINK_NAME, require('../components/link/link.meta.json'), CATEGORY_NAVIGATION);
        meta.mergeComponentMeta(MESSAGE_NAME, require('../components/message/message.meta.json'), CATEGORY_COMUNICATION);
        meta.mergeComponentMeta(NAV_BAR_NAME, require('../components/nav-bar/nav-bar.meta.json'), CATEGORY_NAVIGATION);
        meta.mergeComponentMeta(NAV_BAR_NAME, require('../components/nav-bar-item/nav-bar-item.meta.json'), CATEGORY_NAVIGATION);
        meta.mergeComponentMeta(OPTIONS_MENU_NAME, require('../components/options-menu/options-menu.meta.json'), CATEGORY_CONTENT);
        meta.mergeComponentMeta(PANEL_NAME, require('../components/panel/panel.meta.json'), CATEGORY_LAYOUT);
        meta.mergeComponentMeta(PANEL_DIALOG_NAME, require('../components/panel-dialog/panel-dialog.meta.json'), CATEGORY_COMUNICATION);
        meta.mergeComponentMeta(POPPER_NAME, require('../components/popper/popper.meta.json'), CATEGORY_LAYOUT);
        meta.mergeComponentMeta(RADIO_BUTTONS_NAME, require('../components/radio-buttons/radio-buttons.meta.json'), CATEGORY_FORMS);
        meta.mergeComponentMeta(SECONDARY_DIALOG_NAME, require('../components/secondary-dialog/secondary-dialog.meta.json'), CATEGORY_COMUNICATION);
        meta.mergeComponentMeta(SELECT_NAME, require('../components/select/select.meta.json'), CATEGORY_FORMS);
        meta.mergeComponentMeta(SPINNER_NAME, require('../components/spinner/spinner.meta.json'), CATEGORY_INDICATORS);
        meta.mergeComponentMeta(STATUS_LIST_NAME, require('../components/status-list/status-list.meta.json'), CATEGORY_LAYOUT);
        meta.mergeComponentMeta(STEP_NAME, require('../components/step/step.meta.json'), CATEGORY_LAYOUT);
        meta.mergeComponentMeta(SWITCH_NAME, require('../components/switch/switch.meta.json'), CATEGORY_FORMS);
        meta.mergeComponentMeta(TABLE_NAME, require('../components/table/table.meta.json'), CATEGORY_LAYOUT);
        meta.mergeComponentMeta(TABS_NAME, require('../components/tabs/tabs.meta.json'), CATEGORY_LAYOUT);
        meta.mergeComponentMeta(TEMPLATE_NAME, require('../components/template/template.meta.json'), CATEGORY_LAYOUT);
        meta.mergeComponentMeta(TEXT_FIELD_NAME, require('../components/text-field/text-field.meta.json'), CATEGORY_FORMS);
        meta.mergeComponentMeta(UPLOAD_NAME, require('../components/upload/upload.meta.json'), CATEGORY_FORMS);
        meta.mergeComponentMeta(RIPPLE_EFFECT_NAME, require('../directives/ripple-effect/ripple-effect.meta.json'), CATEGORY_LAYOUT);
    }
}

export default new MetaAll();
