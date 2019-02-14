import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { POPPER_NAME } from '../component-names';
import PopperPlugin from './popper';
import WithRender from './popper.sandbox.html';


@WithRender
@Component
export class MPopperSandbox extends ModulVue {
    private onClose(): void {
        this.$log.log('$emit(\'close\') popper');
    }
}

const PopperSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(PopperPlugin);
        v.component(`${POPPER_NAME}-sandbox`, MPopperSandbox);
    }
};

export default PopperSandboxPlugin;
