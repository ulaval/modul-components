import { PluginObject } from 'vue';
import { MLink } from './link';
import { LINK_NAME } from '../component-names';

export class Lists implements PluginObject<any> {
    public install(v, options) {
        v.component(LINK_NAME, MLink);
    }
}

export default new Lists();
