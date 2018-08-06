import * as Components from '../../src/components/component-names';
import Meta from '../../src/meta/meta';

const components: string[] = [
    Components.ACCORDION_GROUP_NAME,
    Components.ACCORDION_NAME,
    Components.BUTTON_NAME,
    Components.BUTTON_GROUP_NAME,
    Components.CAROUSEL_NAME,
    Components.CAROUSEL_ITEM_NAME,
    Components.CHARACTER_COUNT_NAME,
    Components.CHECKBOX_NAME,
    Components.DATEFIELDS_NAME,
    Components.DATEPICKER_NAME,
    Components.DIALOG_NAME,
    Components.DROPDOWN_NAME,
    Components.DROPDOWN_ITEM_NAME,
    Components.DROPDOWN_GROUP_NAME,
    Components.DYNAMIC_TEMPLATE_NAME,
    Components.ERROR_ACCESS_DENIED_NAME,
    Components.ERROR_BROWSER_NOT_SUPPORTED_NAME,
    Components.ERROR_CONFIG_NOT_SUPPORTED_NAME,
    Components.ERROR_COOKIES_NOT_SUPPORTED_NAME,
    Components.ERROR_MESSAGE_NAME,
    Components.ERROR_PAGE_NOT_FOUND_NAME,
    Components.ERROR_TECHNICAL_DIFFICULTY_NAME,
    Components.ERROR_TEMPLATE_NAME,
    Components.EDIT_WINDOW_NAME,
    Components.FILE_SELECT_NAME,
    Components.FILE_UPLOAD_NAME,
    Components.FLEX_TEMPLATE_NAME,
    Components.I18N_NAME,
    Components.ICON_NAME,
    Components.ICON_FILE_NAME,
    Components.ICON_BUTTON_NAME,
    Components.INPLACE_EDIT_NAME,
    Components.INPUT_STYLE_NAME,
    Components.LIMIT_TEXT_NAME,
    Components.LINK_NAME,
    Components.LIST_ITEM_NAME,
    Components.MESSAGE_NAME,
    Components.MODAL_NAME,
    Components.NAVBAR_NAME,
    Components.NAVBAR_ITEM_NAME,
    Components.MENU_NAME,
    Components.MENU_ITEM_NAME,
    Components.PAGE_NOT_FOUND_NAME,
    Components.PANEL_NAME,
    Components.PHONE_NUMBER_NAME,
    Components.POPPER_NAME,
    Components.PROGRESS_NAME,
    Components.POPUP_NAME,
    Components.RADIO_NAME,
    Components.RICH_TEXT_NAME,
    Components.RADIO_GROUP_NAME,
    Components.RADIO_STYLE_NAME,
    Components.SCROLL_TOP_NAME,
    Components.SESSION_EXPIRED_NAME,
    Components.SIDEBAR_NAME,
    Components.SLIDER_NAME,
    Components.SPINNER_NAME,
    Components.STATUS_NAME,
    Components.STEP_NAME,
    Components.STEPPERS_NAME,
    Components.STEPPERS_ITEM_NAME,
    Components.SWITCH_NAME,
    Components.TAB_PANEL_NAME,
    Components.TABS_NAME,
    Components.TEMPLATE_NAME,
    Components.TEXTAREA_NAME,
    Components.TEXTFIELD_NAME,
    Components.TIMEPICKER_NAME,
    Components.TOOLTIP_NAME,
    Components.VALIDATION_MESSAGE_NAME
];

const factory: () => void = () => {
    components.forEach(c => Meta.mergeComponentMeta(c, undefined));
};

export default factory;
