import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './message.html?style=./message.scss';
import { MESSAGE_NAME } from '../component-names';

@WithRender
@Component
export class MMessage extends Vue {
    @Prop({ default: 'success' })
    public type: string;
    @Prop({ default: 'regular' })
    public mode: string;
    @Prop({ default: false })
    public hasIcon: boolean;
    @Prop({ default: true })
    public hasCloseButton: boolean;
    @Prop({ default: false })
    public isVisible: boolean;

    private componentName = MESSAGE_NAME;

    public get showCloseButton(): boolean {
        return this.$props.mode == 'regular' && !this.$props.hasCloseButton;
    }

    public onClose(event): void {
        this.$emit('onClose', event);
        this.$props.isVisible = false;
    }

    public getIcon(): string {
        let icon: string = '';
        switch (this.$props.type) {
            case 'success':
                icon = 'pastille-crochet';
                break;
            case 'info':
                icon = 'pastille-attention-rouge';
                break;
            case 'warning':
                icon = 'pastille-attention';
                break;
            case 'error':
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
