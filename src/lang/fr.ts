import { PluginObject } from 'vue';
import { FRENCH } from '../utils/i18n/i18n';

const FrenchPlugin: PluginObject<any> = {
    install(v, options) {
        console.debug('FrenchPlugin', 'plugin.install');
        if ((v as any).$i18n) {
            (v as any).$i18n.addMessages(FRENCH, require('../components/accordion/accordion.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/accordion-group/accordion-group.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/list-item/list-item.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/dialog/dialog.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/datefields/datefields.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/datepicker/datepicker.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/dropdown/dropdown.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/dropdown-item/dropdown-item.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/dropdown-group/dropdown-group.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/file-select/file-select.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/input-style/input-style.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/link/link.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/limit-text/limit-text.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/message/message.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/menu/menu.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/modal/modal.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/phone-number/phone-number.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/scroll-top/scroll-top.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/sidebar/sidebar.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/spinner/spinner.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/switch/switch.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/textfield/textfield.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/timepicker/timepicker.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/tooltip/tooltip.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/validation-message/validation-message.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/upload/upload.lang.fr.json'));
        } else {
            throw new Error('FrenchPlugin.install -> You must use the i18n plugin.');
        }
    }
};

export default FrenchPlugin;
