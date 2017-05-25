import { PluginObject } from 'vue';
import { ListComponent } from './list';
import ComponentsMeta from '../components-meta';

class Lists implements PluginObject<any> {
    public install(v, options) {
        v.component('mpo-list', ListComponent);
    }
}

export default new Lists();
