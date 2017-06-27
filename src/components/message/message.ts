import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './message.html?style=./message.scss';
import { MESSAGE_NAME } from '../component-names';

const STATE_SUCCESS: string = 'success';
const STATE_INFORMATION: string = 'information';
const STATE_WARNING: string = 'warning';
const STATE_ERROR: string = 'error';

const MODE_REGULAR: string = 'regular';
const MODE_LIGHT: string = 'light';

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

    private get showCloseButton(): boolean {
        return this.mode == MODE_REGULAR && this.closeButton;
    }

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
                icon = 'chip-warning-red';
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

}

const MessagePlugin: PluginObject<any> = {
    install(v, options) {
        v.component(MESSAGE_NAME, MMessage);
    }
};

export default MessagePlugin;
