import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './message.html?style=./message.scss';
import { MESSAGE_NAME } from '../component-names';

export enum MMessageState {
    Success = 'success',
    Information = 'information',
    Warning = 'warning',
    Error = 'error'
}

export enum MMessageMode {
    Regular = 'regular',
    Light = 'light'
}

@WithRender
@Component
export class MMessage extends Vue {
    @Prop({ default: MMessageState.Success })
    public state: MMessageState;
    @Prop({ default: MMessageMode.Regular })
    public mode: MMessageMode;
    @Prop({ default: true })
    public icon: boolean;
    @Prop({ default: false })
    public closeButton: boolean;
    @Prop()
    public value: boolean;

    public componentName = MESSAGE_NAME;

    private internalPropVisible: boolean = true;

    private get propVisible(): boolean {
        return this.value != undefined ? this.value : this.internalPropVisible;
    }

    private set propVisible(value: boolean) {
        this.$emit('input', value);
        this.internalPropVisible = value;
    }

    private onClose(event): void {
        this.propVisible = false;
        this.$emit('close', event);
    }

    private getIcon(): string {
        let icon: string = '';
        switch (this.state) {
            case MMessageState.Success:
                icon = 'chip-check';
                break;
            case MMessageState.Information:
                icon = 'default';
                break;
            case MMessageState.Warning:
                icon = 'chip-warning';
                break;
            case MMessageState.Error:
                icon = 'chip-error';
                break;
            default:
                break;
        }
        return icon;
    }

    private get showCloseButton(): boolean {
        return this.mode == MMessageMode.Regular && this.closeButton;
    }

}

const MessagePlugin: PluginObject<any> = {
    install(v, options) {
        v.component(MESSAGE_NAME, MMessage);
    }
};

export default MessagePlugin;
