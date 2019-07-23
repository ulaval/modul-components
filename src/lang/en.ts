import { PluginObject } from 'vue';
import { BundleMessagesMap, ENGLISH, Messages } from '../utils/i18n/i18n';

const EnglishPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug('EnglishPlugin', 'plugin.install');
        const i18n: Messages = (v.prototype).$i18n;
        if (i18n) {
            const msgs: BundleMessagesMap[] = [
                require('../components/accordion/accordion.lang.en.json'),
                require('../components/accordion-group/accordion-group.lang.en.json'),
                require('../components/address/address-editor/address-editor.lang.en.json'),
                require('../components/address/address-lookup-field/address-lookup-field.lang.en.json'),
                require('../components/list-item/list-item.lang.en.json'),
                require('../components/modal/modal.lang.en.json'),
                require('../components/chip/chip.lang.en.json'),
                require('../components/copy-to-clipboard/copy-to-clipboard.lang.en.json'),
                require('../components/datefields/datefields.lang.en.json'),
                require('../components/datepicker/datepicker.lang.en.json'),
                require('../components/daterangepicker/daterangepicker.lang.en.json'),
                require('../components/dropdown/dropdown.lang.en.json'),
                require('../components/dropdown-group/dropdown-group.lang.en.json'),
                require('../components/overlay/overlay.lang.en.json'),
                require('../components/file-select/file-select.lang.en.json'),
                require('../components/file-upload/file-upload.lang.en.json'),
                require('../components/icon-file/icon-file.lang.en.json'),
                require('../components/inplace-edit/inplace-edit.lang.en.json'),
                require('../components/input-style/input-style.lang.en.json'),
                require('../components/link/link.lang.en.json'),
                require('../components/limit-elements/limit-elements.lang.en.json'),
                require('../components/limit-text/limit-text.lang.en.json'),
                require('../components/login/login.lang.en.json'),
                require('../components/message/message.lang.en.json'),
                require('../components/menu/menu.lang.en.json'),
                require('../components/option/option.lang.en.json'),
                require('../components/dialog/dialog.lang.en.json'),
                require('../components/pagination/pagination.lang.en.json'),
                require('../components/phone-number/phone-number.lang.en.json'),
                require('../components/phonefield/phonefield.lang.en.json'),
                require('../components/repeater/repeater.lang.en.json'),
                require('../components/rich-text-editor/rich-text-editor.lang.en.json'),
                require('../components/table/table.lang.en.json'),
                require('../components/toast/toast.lang.en.json'),
                require('../components/tree/tree.lang.en.json'),
                require('../components/select/select.lang.en.json'),
                require('../components/scroll-top/scroll-top.lang.en.json'),
                require('../components/show-more/show-more.lang.en.json'),
                require('../components/sidebar/sidebar.lang.en.json'),
                require('../components/spinner/spinner.lang.en.json'),
                require('../components/switch/switch.lang.en.json'),
                require('../components/textfield/textfield.lang.en.json'),
                require('../components/timepicker/timepicker.lang.en.json'),
                require('../components/tooltip/tooltip.lang.en.json'),
                require('../components/validation-message/validation-message.lang.en.json'),
                require('../filters/filesize/filesize.lang.en.json'),
                require('../filters/date/date/date.lang.en.json'),
                require('../filters/date/period/period.lang.en.json'),
                require('../filters/date/time/time.lang.en.json'),
                require('../filters/date/date-time/date-time.lang.en.json')

            ];

            msgs.forEach(msgs => i18n.addMessages(ENGLISH, msgs));
        } else {
            throw new Error(
                'EnglishPlugin.install -> You must use the i18n plugin.'
            );
        }
    }
};

export default EnglishPlugin;
