import Vue, { PluginObject } from 'vue';

import LoggerPlugin from '../utils/logger/logger';
import AccordionGroupPlugin from './accordion-group/accordion-group';
import AccordionPlugin from './accordion/accordion';
import ButtonGroupPlugin from './button-group/button-group';
import ButtonPlugin from './button/button';
import CarouselItemPlugin from './carousel-item/carousel-item';
import CarouselPlugin from './carousel/carousel';
import CharacterCountPlugin from './character-count/character-count';
import CheckboxPlugin from './checkbox/checkbox';
import DatefieldsPlugin from './datefields/datefields';
import DatepickerPlugin from './datepicker/datepicker';
import DialogPlugin from './dialog/dialog';
import DropdownGroupPlugin from './dropdown-group/dropdown-group';
import DropdownItemPlugin from './dropdown-item/dropdown-item';
import DropdownPlugin from './dropdown/dropdown';
import DynamicTemplatePlugin from './dynamic-template/dynamic-template';
import ErrorAccessDenied from './error-access-denied/error-access-denied';
import ErrorBrowserNotSupported from './error-browser-not-supported/error-browser-not-supported';
import ErrorConfigNotSupported from './error-config-not-supported/error-config-not-supported';
import ErrorCookiesNotSupported from './error-cookies-not-supported/error-cookies-not-supported';
import ErrorMessage from './error-message/error-message';
import ErrorPageNotFoundPlugin from './error-page-not-found/error-page-not-found';
import ErrorTechnicalDifficultyPlugin from './error-technical-difficulty/error-technical-difficulty';
import FileSelectPlugin from './file-select/file-select';
import FileUploadPlugin from './file-upload/file-upload';
import FlexTemplatePlugin from './flex-template/flex-template';
import I18nPlugin from './i18n/i18n';
import IconButtonPlugin from './icon-button/icon-button';
import IconFilePlugin from './icon-file/icon-file';
import IconPlugin from './icon/icon';
import InplaceEditPlugin from './inplace-edit/inplace-edit';
import InputStylePlugin from './input-style/input-style';
import LimitTextPlugin from './limit-text/limit-text';
import LinkPlugin from './link/link';
import ListItemPlugin from './list-item/list-item';
import LoginPlugin from './login/login';
import MenuItemPlugin from './menu-item/menu-item';
import MenuPlugin from './menu/menu';
import MessagePagePlugin from './message-page/message-page';
import MessagePlugin from './message/message';
import ModalPlugin from './modal/modal';
import NavbarItemPlugin from './navbar-item/navbar-item';
import NavbarPlugin from './navbar/navbar';
import OptionItemPlugin from './option-item/option-item';
import OptionItemAddPlugin from './option-item/option-item-add';
import OptionItemArchivePlugin from './option-item/option-item-archive';
import OptionItemDeletePlugin from './option-item/option-item-delete';
import OptionItemEditPlugin from './option-item/option-item-edit';
import OptionPlugin from './option/option';
import Overlay from './overlay/overlay';
import PageNotFoundPlugin from './page-not-found/page-not-found';
import PanelPlugin from './panel/panel';
import PhoneNumberPlugin from './phone-number/phone-number';
import PlusPlugin from './plus/plus';
import PopperPlugin from './popper/popper';
import PopupPlugin from './popup/popup';
import ProgressPluggin from './progress/progress';
import RadioGroupPlugin from './radio-group/radio-group';
import RadioStylePlugin from './radio-style/radio-style';
import RadioPlugin from './radio/radio';
import RichTextLicensePlugin, { RichTextLicensePluginOptions } from './rich-text-editor/rich-text-license-plugin';
import RichTextPlugin from './rich-text/rich-text';
import ScrollTopPlugin from './scroll-top/scroll-top';
import SessionExpiredPlugin from './session-expired/session-expired';
import SidebarPlugin from './sidebar/sidebar';
import SliderPlugin from './slider/slider';
import SpinnerPlugin from './spinner/spinner';
import Status from './status/status';
import StepPlugin from './step/step';
import SteppersItemPlugin from './steppers-item/steppers-item';
import SteppersPlugin from './steppers/steppers';
import SwitchPlugin from './switch/switch';
import TabPanelPlugin from './tab-panel/tab-panel';
import TablePlugin from './table/table';
import TabsPlugin from './tabs/tabs';
import TemplatePlugin from './template/template';
import TextareaPlugin from './textarea/textarea';
import TextfieldPlugin from './textfield/textfield';
import TimepickerPlugin from './timepicker/timepicker';
import TooltipPlugin from './tooltip/tooltip';
import TreeIconPlugin from './tree-icon/tree-icon';
import TreeNodePlugin from './tree-node/tree-node';
import TreePlugin from './tree/tree';
import ValidationMessagePlugin from './validation-message/validation-message';

export interface ComponentPluginOptions {
    richTextOptions?: RichTextLicensePluginOptions;
}

const ComponentsPlugin: PluginObject<any> = {
    install(v, options: ComponentPluginOptions = {}): void {
        if (!v.prototype.$log) {
            Vue.use(LoggerPlugin);
        }

        Vue.use(AccordionGroupPlugin);
        Vue.use(AccordionPlugin);
        Vue.use(ButtonPlugin);
        Vue.use(ButtonGroupPlugin);
        Vue.use(CarouselPlugin);
        Vue.use(CarouselItemPlugin);
        Vue.use(CharacterCountPlugin);
        Vue.use(CheckboxPlugin);
        Vue.use(DatefieldsPlugin);
        Vue.use(DatepickerPlugin);
        Vue.use(ModalPlugin);
        Vue.use(DropdownPlugin);
        Vue.use(DropdownItemPlugin);
        Vue.use(DropdownGroupPlugin);
        Vue.use(DynamicTemplatePlugin);
        Vue.use(Overlay);
        Vue.use(ErrorAccessDenied);
        Vue.use(ErrorBrowserNotSupported);
        Vue.use(ErrorConfigNotSupported);
        Vue.use(ErrorCookiesNotSupported);
        Vue.use(ErrorMessage);
        Vue.use(ErrorPageNotFoundPlugin);
        Vue.use(ErrorTechnicalDifficultyPlugin);
        Vue.use(MessagePagePlugin);
        Vue.use(FileSelectPlugin);
        Vue.use(FileUploadPlugin);
        Vue.use(FlexTemplatePlugin);
        Vue.use(I18nPlugin);
        Vue.use(IconPlugin);
        Vue.use(IconButtonPlugin);
        Vue.use(IconFilePlugin);
        Vue.use(InputStylePlugin);
        Vue.use(LimitTextPlugin);
        Vue.use(LinkPlugin);
        Vue.use(ListItemPlugin);
        Vue.use(LoginPlugin);
        Vue.use(MessagePlugin);
        Vue.use(DialogPlugin);
        Vue.use(NavbarPlugin);
        Vue.use(NavbarItemPlugin);
        Vue.use(OptionPlugin);
        Vue.use(MenuPlugin);
        Vue.use(MenuItemPlugin);
        Vue.use(OptionItemAddPlugin);
        Vue.use(OptionItemArchivePlugin);
        Vue.use(OptionItemDeletePlugin);
        Vue.use(OptionItemEditPlugin);
        Vue.use(OptionItemPlugin);
        Vue.use(PageNotFoundPlugin);
        Vue.use(PanelPlugin);
        Vue.use(PhoneNumberPlugin);
        Vue.use(PlusPlugin);
        Vue.use(PopperPlugin);
        Vue.use(PopupPlugin);
        Vue.use(ProgressPluggin);
        Vue.use(RadioPlugin);
        Vue.use(RadioGroupPlugin);
        Vue.use(RadioStylePlugin);
        Vue.use(RichTextLicensePlugin, { key: options.richTextOptions ? options.richTextOptions.key : undefined });
        Vue.use(RichTextPlugin);
        Vue.use(ScrollTopPlugin);
        Vue.use(SessionExpiredPlugin);
        Vue.use(SidebarPlugin);
        Vue.use(SliderPlugin);
        Vue.use(SpinnerPlugin);
        Vue.use(Status);
        Vue.use(StepPlugin);
        Vue.use(SteppersPlugin);
        Vue.use(SteppersItemPlugin);
        Vue.use(SwitchPlugin);
        Vue.use(TabPanelPlugin);
        Vue.use(TablePlugin);
        Vue.use(TabsPlugin);
        Vue.use(TemplatePlugin);
        Vue.use(TextareaPlugin);
        Vue.use(TextfieldPlugin);
        Vue.use(TimepickerPlugin);
        Vue.use(TooltipPlugin);
        Vue.use(ValidationMessagePlugin);
        Vue.use(InplaceEditPlugin);
        Vue.use(TreePlugin);
        Vue.use(TreeIconPlugin);
        Vue.use(TreeNodePlugin);
    }
};

export default ComponentsPlugin;
