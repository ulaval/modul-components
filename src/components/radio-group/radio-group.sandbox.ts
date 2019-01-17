import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { RADIO_GROUP_NAME } from '../component-names';
import WithRender from './radio-group.sandbox.html';


@WithRender
@Component
export class MRadioGroupSandbox extends ModulVue {
    private model1: string = '1';

    private onFocus(): void {
        this.$log.log('$emit(\'focus\') m-radio-group');
    }

    private onBlur(): void {
        this.$log.log('$emit(\'blur\') m-radio-group');
    }
}

const RadioGroupSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${RADIO_GROUP_NAME}-sandbox`, MRadioGroupSandbox);
    }
};

export default RadioGroupSandboxPlugin;
