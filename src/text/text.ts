import { PluginObject } from 'vue';
import { DynamicTemplateComponent } from './dynamic-template';
import ComponentsMeta from '../components-meta';

class Text implements PluginObject<any> {
    public install(v, options) {
        v.component('mpo-dynamic-template', DynamicTemplateComponent);
    }
}

export default new Text();
