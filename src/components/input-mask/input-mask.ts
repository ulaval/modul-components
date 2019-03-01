import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { ModulVue } from '../../utils/vue/vue';
import { INPUT_MASK_NAME } from '../component-names';
import WithRender from './input-mask.html';

@WithRender
@Component
export class MInputMask extends ModulVue {



}


const InputMaskPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(INPUT_MASK_NAME, MInputMask);
    }
};

export default InputMaskPlugin;
