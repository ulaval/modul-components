import { PluginObject } from 'vue';
import { ButtonComponent } from './button';
import ComponentsMeta from '../components-meta';

class Buttons implements PluginObject<any> {
    public install(v, options) {
        v.component('mpo-button', ButtonComponent);
    }
}

export default new Buttons();
