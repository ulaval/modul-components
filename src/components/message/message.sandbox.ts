import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { MESSAGE_NAME } from '../component-names';
import WithRender from './message.sandbox.html';

@WithRender
@Component
export class MMessageSandbox extends Vue {
}

const MessageSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${MESSAGE_NAME}-sandbox`, MMessageSandbox);
    }
};

export default MessageSandboxPlugin;
