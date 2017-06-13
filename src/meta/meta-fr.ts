import { PluginObject } from 'vue';
import {
    ACCORDION_NAME, ACCORDION_GROUP_NAME, BUTTON_NAME, DIALOG_NAME, DYNAMIC_TEMPLATE_NAME, I18N_NAME, ICON_NAME, LINK_NAME, LIST_BULLET_NAME, MESSAGE_NAME, PANEL_NAME,
    STATUS_LIST_NAME, TABLE_NAME, TEXT_ICON_NAME, UPLOAD_NAME
} from '../components/component-names';
import { BACKGROUND_COLOR_NAME, RIPPLE_EFFECT_NAME } from '../directives/directive-names';
import { Meta } from './meta';

export class MetaFr implements PluginObject<any> {
    public install(v, options) {
        if (!options) {
            throw new Error('MetaFr.install -> you must provide a Meta object within the options argument');
        }
        (options as Meta).mergeComponentMeta('fr', ACCORDION_NAME, require('../components/accordion/accordion.meta.fr.json'));
        (options as Meta).mergeComponentMeta('fr', ACCORDION_GROUP_NAME, require('../components/accordion-group/accordion-group.meta.fr.json'));
        (options as Meta).mergeComponentMeta('fr', BUTTON_NAME, require('../components/button/button.meta.fr.json'));
        (options as Meta).mergeComponentMeta('fr', DIALOG_NAME, require('../components/dialog/dialog.meta.fr.json'));
        (options as Meta).mergeComponentMeta('fr', DYNAMIC_TEMPLATE_NAME, require('../components/dynamic-template/dynamic-template.meta.fr.json'));
        (options as Meta).mergeComponentMeta('fr', I18N_NAME, require('../components/i18n/i18n.meta.fr.json'));
        (options as Meta).mergeComponentMeta('fr', ICON_NAME, require('../components/icon/icon.meta.fr.json'));
        (options as Meta).mergeComponentMeta('fr', LINK_NAME, require('../components/link/link.meta.fr.json'));
        (options as Meta).mergeComponentMeta('fr', LIST_BULLET_NAME, require('../components/list-bullet/list-bullet.meta.fr.json'));
        (options as Meta).mergeComponentMeta('fr', MESSAGE_NAME, require('../components/message/message.meta.fr.json'));
        (options as Meta).mergeComponentMeta('fr', PANEL_NAME, require('../components/panel/panel.meta.fr.json'));
        (options as Meta).mergeComponentMeta('fr', STATUS_LIST_NAME, require('../components/status-list/status-list.meta.fr.json'));
        (options as Meta).mergeComponentMeta('fr', TABLE_NAME, require('../components/table/table.meta.fr.json'));
        (options as Meta).mergeComponentMeta('fr', TEXT_ICON_NAME, require('../components/text-icon/text-icon.meta.fr.json'));
        (options as Meta).mergeComponentMeta('fr', UPLOAD_NAME, require('../components/upload/upload.meta.fr.json'));

        (options as Meta).mergeComponentMeta('fr', BACKGROUND_COLOR_NAME, require('../directives/background-color/background-color.meta.fr.json'));
        (options as Meta).mergeComponentMeta('fr', RIPPLE_EFFECT_NAME, require('../directives/ripple-effect/ripple-effect.meta.fr.json'));
    }
}

export default new MetaFr();
