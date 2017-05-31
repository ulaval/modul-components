import { PluginObject } from 'vue';
import { Meta } from './meta';
import { BUTTON_NAME, LIST_NAME, DYNAMIC_TEMPLATE_NAME, BACKGROUND_COLOR_NAME } from './component-names';

export class MetaFr implements PluginObject<any> {
    public install(v, options) {
        (options as Meta).mergeComponentMeta('fr', BUTTON_NAME, require('./buttons/button.fr.json'));
        (options as Meta).mergeComponentMeta('fr', LIST_NAME, require('./lists/list.fr.json'));
        (options as Meta).mergeComponentMeta('fr', DYNAMIC_TEMPLATE_NAME, require('./text/dynamic-template.fr.json'));
        (options as Meta).mergeComponentMeta('fr', BACKGROUND_COLOR_NAME, require('./directives/background-color.fr.json'));
    }
}

export default new MetaFr();
