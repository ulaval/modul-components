import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { ModulVue } from '../../utils/vue/vue';
import { INPUT_NAME } from '../component-names';
import WithRender from './input.html';

@WithRender
@Component
export class MInput extends ModulVue {


}


const InputPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(INPUT_NAME, MInput);
    }
};

export default InputPlugin;
