import { PluginObject } from 'vue';
import { MBackgroundColor } from './background-color';
import { BACKGROUND_COLOR_NAME } from '../component-names';

export class Directives implements PluginObject<any> {
    public install(v, options) {
        v.directive(BACKGROUND_COLOR_NAME, new MBackgroundColor());
    }
}

export default new Directives();
