import { PluginObject } from 'vue';
import { MDynamicTemplate } from './dynamic-template';
import { DYNAMIC_TEMPLATE_NAME } from '../component-names';

export class Text implements PluginObject<any> {
    public install(v, options) {
        v.component(DYNAMIC_TEMPLATE_NAME, MDynamicTemplate);
    }
}

export default new Text();
