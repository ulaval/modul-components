import { PluginObject } from 'vue';
import { FRENCH } from '../utils/i18n/i18n';

const FrenchPlugin: PluginObject<any> = {
    install(v, options) {
        if ((v as any).$i18n) {
            (v as any).$i18n.addMessages(FRENCH, require('../components/accordion/accordion.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/accordion-group/accordion-group.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/dialog/dialog.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/dropdown/dropdown.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/link/link.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/template/template.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/message/message.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/spinner/spinner.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/switch/switch.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/validation-message/validation-message.lang.fr.json'));
            (v as any).$i18n.addMessages(FRENCH, require('../components/upload/upload.lang.fr.json'));
        } else {
            throw new Error('FrenchPlugin.install -> You must use the i18n plugin.');
        }
    }
};

export default FrenchPlugin;
