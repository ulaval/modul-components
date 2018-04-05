import { PluginObject } from 'vue';

import { BundleMessagesMap, FRENCH, Messages } from '../utils/i18n/i18n';

const FrenchPlugin: PluginObject<any> = {
    install(v, options): void {
        console.debug('FrenchPlugin', 'plugin.install');
        const i18n: Messages = (v.prototype as any).$i18n;
        if (i18n) {
            const msgs: BundleMessagesMap[] = [
                require('../components/accordion/accordion.lang.fr.json'),
                require('../components/accordion-group/accordion-group.lang.fr.json'),
                require('../components/list-item/list-item.lang.fr.json'),
                require('../components/dialog/dialog.lang.fr.json'),
                require('../components/datefields/datefields.lang.fr.json'),
                require('../components/datepicker/datepicker.lang.fr.json'),
                require('../components/dropdown/dropdown.lang.fr.json'),
                require('../components/dropdown-item/dropdown-item.lang.fr.json'),
                require('../components/dropdown-group/dropdown-group.lang.fr.json'),
                require('../components/edit-window/edit-window.lang.fr.json'),
                require('../components/error-message/error-message.lang.fr.json'),
                require('../components/file-select/file-select.lang.fr.json'),
                require('../components/file-upload/file-upload.lang.fr.json'),
                require('../components/input-style/input-style.lang.fr.json'),
                require('../components/link/link.lang.fr.json'),
                require('../components/limit-text/limit-text.lang.fr.json'),
                require('../components/login/login.lang.fr.json'),
                require('../components/message/message.lang.fr.json'),
                require('../components/menu/menu.lang.fr.json'),
                require('../components/modal/modal.lang.fr.json'),
                require('../components/phone-number/phone-number.lang.fr.json'),
                require('../components/scroll-top/scroll-top.lang.fr.json'),
                require('../components/sidebar/sidebar.lang.fr.json'),
                require('../components/spinner/spinner.lang.fr.json'),
                require('../components/switch/switch.lang.fr.json'),
                require('../components/textfield/textfield.lang.fr.json'),
                require('../components/timepicker/timepicker.lang.fr.json'),
                require('../components/tooltip/tooltip.lang.fr.json'),
                require('../components/validation-message/validation-message.lang.fr.json')
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
