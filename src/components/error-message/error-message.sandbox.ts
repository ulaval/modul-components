import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { ERROR_MESSAGE_NAME } from '../component-names';
import WithRender from './error-message.sandbox.html';

@WithRender
@Component
export class MErrorMessageSandbox extends Vue {
    private e: any = {
        stack: `An error occured
error line
from line
because of this line
a line
last line
before the last line
where are in a loop
error line
from line
because of this line
a line
last line
before the last line`
    };
}

const ErrorMessageSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${ERROR_MESSAGE_NAME}-sandbox`, MErrorMessageSandbox);
    }
};

export default ErrorMessageSandboxPlugin;
