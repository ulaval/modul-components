import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { PERIODPICKER_NAME } from '../component-names';
import WithRender from './periodpicker.sandbox.html';

@WithRender
@Component
export class MPeriodpickerSandbox extends Vue {
    model: string = '';
}

const PeriodpickerSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${PERIODPICKER_NAME}-sandbox`, MPeriodpickerSandbox);
    }
};

export default PeriodpickerSandboxPlugin;
