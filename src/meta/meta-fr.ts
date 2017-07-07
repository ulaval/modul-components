import { PluginObject } from 'vue';
import { FRENCH, Messages } from '../utils/i18n/i18n';

const FrenchMetaPlugin: PluginObject<any> = {
    install(v, options) {
        if ((v as any).$i18n) {
            let i18n: Messages = (v as any).$i18n;
            i18n.addMessages(FRENCH, require('./meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/accordion/accordion.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/accordion-group/accordion-group.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/button/button.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/button-group/button-group.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/checkbox/checkbox.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/dialog/dialog.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/dropdown/dropdown.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/dynamic-template/dynamic-template.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/i18n/i18n.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/icon/icon.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/limit-text/limit-text.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/link/link.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/list-bullet/list-bullet.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/message/message.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/panel/panel.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/popper/popper.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/popper-list/popper-list.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/radio-buttons/radio-buttons.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/spinner/spinner.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/status-list/status-list.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/step/step.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/table/table.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/template/template.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/text-field/text-field.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../components/upload/upload.meta.fr.json'));
            i18n.addMessages(FRENCH, require('../directives/ripple-effect/ripple-effect.meta.fr.json'));
        } else {
            throw new Error('FrenchMetaPlugin.install -> You must use the i18n plugin.');
        }
    }
};

export default FrenchMetaPlugin;
