import { PluginObject } from 'vue';
import { BUTTON_NAME, LIST_NAME, DYNAMIC_TEMPLATE_NAME } from '@/components/component-names';
import { BACKGROUND_COLOR_NAME } from '@/directives/directives-names';
import { Meta } from './meta';

export class MetaFr implements PluginObject<any> {
    public install(v, options) {
        (options as Meta).mergeComponentMeta('fr', BUTTON_NAME, require('../components/button/button.fr.json'));
        (options as Meta).mergeComponentMeta('fr', LIST_NAME, require('../components/list/list.fr.json'));
        (options as Meta).mergeComponentMeta('fr', DYNAMIC_TEMPLATE_NAME, require('../components/dynamic-template/dynamic-template.fr.json'));
        (options as Meta).mergeComponentMeta('fr', BACKGROUND_COLOR_NAME, require('../directives/background-color/background-color.fr.json'));
    }
}

export default new MetaFr();
