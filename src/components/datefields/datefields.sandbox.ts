import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { DATEFIELDS_NAME } from '../component-names';
import WithRender from './datefields.sandbox.html';

@WithRender
@Component
export class MDatefieldsSandbox extends Vue {
}

const DatefieldsSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${DATEFIELDS_NAME}-sandbox`, MDatefieldsSandbox);
    }
};

export default DatefieldsSandboxPlugin;
