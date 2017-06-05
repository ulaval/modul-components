import { PluginObject } from 'vue';
import { MTextIcon } from './text-icon';
import { TEXT_ICON_NAME } from '../component-names';

export class Lists implements PluginObject<any> {
    public install(v, options) {
        v.component(TEXT_ICON_NAME, MTextIcon);
    }
}

export default new Lists();
