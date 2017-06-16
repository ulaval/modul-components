import { PluginObject } from 'vue';
import {
    ACCORDION_NAME, ACCORDION_GROUP_NAME, BUTTON_NAME, CHECKBOX_NAME, DIALOG_NAME, DROPDOWN_NAME, DYNAMIC_TEMPLATE_NAME, I18N_NAME, ICON_NAME, LINK_NAME,
    LIST_BULLET_NAME, MESSAGE_NAME, PANEL_NAME, POPPER_LIST_NAME, POPPER_NAME, STATUS_LIST_NAME, STEP_NAME, TABLE_NAME, TEMPLATE_NAME, TEXT_FIELD_NAME, TEXT_ICON_NAME,
    UPLOAD_NAME
} from '../components/component-names';
import { RIPPLE_EFFECT_NAME } from '../directives/directive-names';
import { Meta } from './meta';

export class MetaAll implements PluginObject<any> {
    public install(v, options) {
        if (!options) {
            throw new Error('MetaAll.install -> you must provide a Meta object within the options argument');
        }
        (options as Meta).mergeComponentMeta('fr', ACCORDION_NAME, require('../components/accordion/accordion.meta.json'));
        (options as Meta).mergeComponentMeta('fr', ACCORDION_GROUP_NAME, require('../components/accordion-group/accordion-group.meta.json'));
        (options as Meta).mergeComponentMeta('fr', BUTTON_NAME, require('../components/button/button.meta.json'));
        (options as Meta).mergeComponentMeta('fr', CHECKBOX_NAME, require('../components/checkbox/checkbox.meta.json'));
        (options as Meta).mergeComponentMeta('fr', DIALOG_NAME, require('../components/dialog/dialog.meta.json'));
        (options as Meta).mergeComponentMeta('fr', DROPDOWN_NAME, require('../components/dropdown/dropdown.meta.json'));
        (options as Meta).mergeComponentMeta('fr', DYNAMIC_TEMPLATE_NAME, require('../components/dynamic-template/dynamic-template.meta.json'));
        (options as Meta).mergeComponentMeta('fr', I18N_NAME, require('../components/i18n/i18n.meta.json'));
        (options as Meta).mergeComponentMeta('fr', ICON_NAME, require('../components/icon/icon.meta.json'));
        (options as Meta).mergeComponentMeta('fr', LINK_NAME, require('../components/link/link.meta.json'));
        (options as Meta).mergeComponentMeta('fr', LIST_BULLET_NAME, require('../components/list-bullet/list-bullet.meta.json'));
        (options as Meta).mergeComponentMeta('fr', MESSAGE_NAME, require('../components/message/message.meta.json'));
        (options as Meta).mergeComponentMeta('fr', PANEL_NAME, require('../components/panel/panel.meta.json'));
        (options as Meta).mergeComponentMeta('fr', POPPER_LIST_NAME, require('../components/popper-list/popper-list.meta.json'));
        (options as Meta).mergeComponentMeta('fr', POPPER_NAME, require('../components/popper/popper.meta.json'));
        (options as Meta).mergeComponentMeta('fr', STATUS_LIST_NAME, require('../components/status-list/status-list.meta.json'));
        (options as Meta).mergeComponentMeta('fr', STEP_NAME, require('../components/step/step.meta.json'));
        (options as Meta).mergeComponentMeta('fr', TABLE_NAME, require('../components/table/table.meta.json'));
        (options as Meta).mergeComponentMeta('fr', TEMPLATE_NAME, require('../components/template/template.meta.json'));
        (options as Meta).mergeComponentMeta('fr', TEXT_FIELD_NAME, require('../components/text-field/text-field.meta.json'));
        (options as Meta).mergeComponentMeta('fr', TEXT_ICON_NAME, require('../components/text-icon/text-icon.meta.json'));
        (options as Meta).mergeComponentMeta('fr', UPLOAD_NAME, require('../components/upload/upload.meta.json'));

        (options as Meta).mergeComponentMeta('fr', RIPPLE_EFFECT_NAME, require('../directives/ripple-effect/ripple-effect.meta.json'));
    }
}

export default new MetaAll();
