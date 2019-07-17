import { PluginObject } from 'vue';
import { BundleMessagesMap, FRENCH, Messages } from '../utils/i18n/i18n';

const FrenchPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug('FrenchPlugin', 'plugin.install');
        const i18n: Messages = (v.prototype).$i18n;
        if (i18n) {
            const msgs: BundleMessagesMap[] = [
                require('../components/accordion/accordion.lang.fr.json'),
                require('../components/accordion-group/accordion-group.lang.fr.json'),
                require('../components/address/address-editor/address-editor.lang.fr.json'),
                require('../components/address/address-lookup-field/address-lookup-field.lang.fr.json'),
                require('../components/list-item/list-item.lang.fr.json'),
                require('../components/modal/modal.lang.fr.json'),
                require('../components/calendar/calendar.lang.fr.json'),
                require('../components/chip/chip.lang.fr.json'),
                require('../components/copy-to-clipboard/copy-to-clipboard.lang.fr.json'),
                require('../components/datefields/datefields.lang.fr.json'),
                require('../components/datepicker/datepicker.lang.fr.json'),
                require('../components/daterangepicker/daterangepicker.lang.fr.json'),
                require('../components/dropdown/dropdown.lang.fr.json'),
                require('../components/dropdown-group/dropdown-group.lang.fr.json'),
                require('../components/overlay/overlay.lang.fr.json'),
                require('../components/error-pages/error-access-denied/error-access-denied.lang.fr.json'),
                require('../components/error-pages/error-browser-not-supported/error-browser-not-supported.lang.fr.json'),
                require('../components/error-pages/error-config-not-supported/error-config-not-supported.lang.fr.json'),
                require('../components/error-pages/error-cookies-not-supported/error-cookies-not-supported.lang.fr.json'),
                require('../components/error-message/error-message.lang.fr.json'),
                require('../components/error-pages/error-page-not-found/error-page-not-found.lang.fr.json'),
                require('../components/error-pages/error-technical-difficulty/error-technical-difficulty.lang.fr.json'),
                require('../components/file-select/file-select.lang.fr.json'),
                require('../components/file-upload/file-upload.lang.fr.json'),
                require('../components/form/form.lang.fr.json'),
                require('../components/icon-file/icon-file.lang.fr.json'),
                require('../components/inplace-edit/inplace-edit.lang.fr.json'),
                require('../components/input-style/input-style.lang.fr.json'),
                require('../components/link/link.lang.fr.json'),
                require('../components/limit-elements/limit-elements.lang.fr.json'),
                require('../components/limit-text/limit-text.lang.fr.json'),
                require('../components/login/login.lang.fr.json'),
                require('../components/message/message.lang.fr.json'),
                require('../components/menu/menu.lang.fr.json'),
                require('../components/option/option.lang.fr.json'),
                require('../components/dialog/dialog.lang.fr.json'),
                require('../components/page-not-found/page-not-found.lang.fr.json'),
                require('../components/pagination/pagination.lang.fr.json'),
                require('../components/phone-number/phone-number.lang.fr.json'),
                require('../components/phonefield/phonefield.lang.fr.json'),
                require('../components/repeater/repeater.lang.fr.json'),
                require('../components/rich-text-editor/rich-text-editor.lang.fr.json'),
                require('../components/table/table.lang.fr.json'),
                require('../components/toast/toast.lang.fr.json'),
                require('../components/tree/tree.lang.fr.json'),
                require('../components/select/select.lang.fr.json'),
                require('../components/scroll-top/scroll-top.lang.fr.json'),
                require('../components/session-expired/session-expired.lang.fr.json'),
                require('../components/show-more/show-more.lang.fr.json'),
                require('../components/sidebar/sidebar.lang.fr.json'),
                require('../components/spinner/spinner.lang.fr.json'),
                require('../components/switch/switch.lang.fr.json'),
                require('../components/textfield/textfield.lang.fr.json'),
                require('../components/timepicker/timepicker.lang.fr.json'),
                require('../components/tooltip/tooltip.lang.fr.json'),
                require('../components/validation-message/validation-message.lang.fr.json'),
                require('../filters/filesize/filesize.lang.fr.json'),
                require('../filters/date/date/date.lang.fr.json'),
                require('../filters/date/period/period.lang.fr.json'),
                require('../filters/date/time/time.lang.fr.json'),
                require('../filters/date/date-time/date-time.lang.fr.json')
            ];

            msgs.forEach(msgs => i18n.addMessages(FRENCH, msgs));
        } else {
            throw new Error(
                'FrenchPlugin.install -> You must use the i18n plugin.'
            );
        }
    }
};

export default FrenchPlugin;
