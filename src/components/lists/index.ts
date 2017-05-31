import { PluginObject } from 'vue';
import { MList } from './list';
import { LIST_NAME } from '../component-names';

export class Lists implements PluginObject<any> {
    public install(v, options) {
        v.component(LIST_NAME, MList);
    }
}

export default new Lists();
