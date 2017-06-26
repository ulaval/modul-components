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
    @Prop({ default: STATE_ERROR })
    public state: string;
    @Prop({ default: MODE_REGULAR })
    public mode: string;
    @Prop({ default: true })
    public hasIcon: boolean;
    @Prop({ default: false })
    public hasCloseButton: boolean;
    @Prop({ default: true })
    public isVisible: boolean;

    public componentName = MESSAGE_NAME;

    private get showCloseButton(): boolean {
        return this.mode == MODE_REGULAR && this.hasCloseButton;
    }

    private onClose(event): void {
        this.$emit('close', event);
        this.isVisible = false;
    }

    private getIcon(): string {
        let icon: string = '';
        switch (this.state) {
            case STATE_SUCCESS:
                icon = 'pastille-crochet';
                break;
            case STATE_INFORMATION:
                icon = 'pastille-attention-rouge';
                break;
            case STATE_WARNING:
                icon = 'pastille-attention';
                break;
            case STATE_ERROR:
                icon = 'pastille-erreur';
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
