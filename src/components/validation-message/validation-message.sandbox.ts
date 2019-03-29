import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { VALIDATION_MESSAGE_NAME } from '../component-names';
import ValidationMessagePlugin from './validation-message';
import WithRender from './validation-message.sandbox.html';


@WithRender
@Component
export class MValidationMessageSandbox extends Vue {
    public errorMessage: string = 'Error message';
    public validMessage: string = 'Valid message';
    public helperMessage: string = 'Helper message';
}

const ValidationMessageSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(ValidationMessagePlugin);
        v.component(`${VALIDATION_MESSAGE_NAME}-sandbox`, MValidationMessageSandbox);
    }
};

export default ValidationMessageSandboxPlugin;
