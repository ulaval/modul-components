import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { VALIDATION_MESSAGE_NAME } from '../component-names';
import WithRender from './validation-message.sandbox.html';
import ValidationMessagePlugin from './validation-message';

@WithRender
@Component
export class MValidationMessageSandbox extends Vue {
}

const ValidationMessageSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(ValidationMessagePlugin);
        v.component(`${VALIDATION_MESSAGE_NAME}-sandbox`, MValidationMessageSandbox);
    }
};

export default ValidationMessageSandboxPlugin;
