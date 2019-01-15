import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { MESSAGE_NAME } from '../component-names';
import { MMessageSkin, MMessageState } from './message';
import WithRender from './message.sandbox.html';


@WithRender
@Component
export class MMessageSandbox extends Vue {
    messageSkin: MMessageSkin = MMessageSkin.Default;
    messageState: MMessageState = MMessageState.Confirmation;
    messageVisible: boolean = true;

    get messageSkinAsArray(): any {
        return MMessageSkin;
    }

    get messageStateAsArray(): any {
        return MMessageState;
    }
}

const MessageSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${MESSAGE_NAME}-sandbox`, MMessageSandbox);
    }
};

export default MessageSandboxPlugin;
