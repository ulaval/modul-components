import { PluginObject } from 'vue';
import { MButton } from './button';
import { BUTTON_NAME } from '../component-names';

export class Buttons implements PluginObject<any> {
    public install(v, options) {
        v.component(BUTTON_NAME, MButton);
    }
}

export default new Buttons();
