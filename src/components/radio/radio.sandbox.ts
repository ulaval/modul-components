import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { RADIO_NAME } from '../component-names';
import WithRender from './radio.sandbox.html';
import RadioPlugin from './radio';

@WithRender
@Component
export class MRadioSandbox extends ModulVue {
    public someData: number = 1;

    private onBlur(): void {
        this.$log.log('$emit(\'blur\') m-radio');
    }
}

const RadioSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(RadioPlugin);
        v.component(`${RADIO_NAME}-sandbox`, MRadioSandbox);
    }
};

export default RadioSandboxPlugin;
