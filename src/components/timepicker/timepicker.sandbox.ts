import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { TIMEPICKER_NAME } from '../component-names';
import WithRender from './timepicker.sandbox.html';

@WithRender
@Component
export class MTimepickerSandbox extends Vue {
}

const TimepickerSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${TIMEPICKER_NAME}-sandbox`, MTimepickerSandbox);
    }
};

export default TimepickerSandboxPlugin;
