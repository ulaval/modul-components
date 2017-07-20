import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './message.html?style=./message.scss';
import { MESSAGE_NAME } from '../component-names';

export const STATE_SUCCESS: string = 'success';
export const STATE_INFORMATION: string = 'information';
export const STATE_WARNING: string = 'warning';
export const STATE_ERROR: string = 'error';

export const MODE_REGULAR: string = 'regular';
export const MODE_LIGHT: string = 'light';

@WithRender
@Component
export class MMessage extends Vue {
    @Prop({ default: STATE_SUCCESS })
    public state: string;
    @Prop({ default: MODE_REGULAR })
    public mode: string;
    @Prop({ default: true })
    public icon: boolean;
    @Prop({ default: false })
    public closeButton: boolean;
    @Prop({ default: true })
    public visible: boolean;

    public componentName = MESSAGE_NAME;

    private onClose(event): void {
        this.$emit('close', event);
        this.visible = false;
    }

    private getIcon(): string {
        let icon: string = '';
        switch (this.state) {
            case STATE_SUCCESS:
                icon = 'chip-check';
                break;
            case STATE_INFORMATION:
                icon = 'default';
                break;
            case STATE_WARNING:
                icon = 'chip-warning';
                break;
            case STATE_ERROR:
                icon = 'chip-error';
                break;
            default:
                break;
        }
        return icon;
    }

    private get showCloseButton(): boolean {
        return this.mode == MODE_REGULAR && this.closeButton;
    }

}

const MessagePlugin: PluginObject<any> = {
    install(v, options) {
        v.component(MESSAGE_NAME, MMessage);
    }
};

export default MessagePlugin;
