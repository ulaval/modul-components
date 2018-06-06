import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { DATEPICKER_NAME } from '../component-names';
import WithRender from './datepicker.sandbox.html';

@WithRender
@Component
export class MDatepickerSandbox extends Vue {
}

const DatepickerSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${DATEPICKER_NAME}-sandbox`, MDatepickerSandbox);
    }
};

export default DatepickerSandboxPlugin;
