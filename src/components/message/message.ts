import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import { MESSAGE_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import IconButtonPlugin from '../icon-button/icon-button';
import IconPlugin from '../icon/icon';
import WithRender from './message.html?style=./message.scss';

export enum MMessageState {
    Success = 'success',
    Information = 'information',
    Warning = 'warning',
    Error = 'error'
}

export enum MMessageSkin {
    Regular = 'regular',
    Light = 'light'
}

@WithRender
@Component
export class MMessage extends Vue {
    @Prop({
        default: MMessageState.Success,
        validator: value =>
            value === MMessageState.Success ||
            value === MMessageState.Information ||
            value === MMessageState.Warning ||
            value === MMessageState.Error
    })
    public state: MMessageState;

    @Prop({
        default: MMessageSkin.Regular,
        validator: value =>
            value === MMessageSkin.Regular ||
            value === MMessageSkin.Light
    })
    public skin: MMessageSkin;

    @Prop({ default: true })
    public icon: boolean;

    @Prop()
    public closeButton: boolean;

    @Prop()
    public visible: boolean;

    private internalPropVisible: boolean = true;

    @Watch('visible')
    private onVisibleChange(value: boolean): void {
        // reset to true if prop reset to undefined
        this.internalPropVisible = value === undefined ? true : value;
    }

    private get propVisible(): boolean {
        return this.visible !== undefined ? this.visible : this.internalPropVisible;
    }

    private set propVisible(visible: boolean) {
        this.internalPropVisible = visible;
        this.$emit('update:visible', visible);
    }

    private onClose(event): void {
        this.propVisible = false;
        this.$emit('close', event);
    }

    private getIcon(): string {
        let icon: string = '';
        switch (this.state) {
            case MMessageState.Success:
                icon = 'check';
                break;
            case MMessageState.Information:
                icon = 'information';
                break;
            case MMessageState.Warning:
                icon = 'warning';
                break;
            case MMessageState.Error:
                icon = 'error';
                break;
            default:
                break;
        }
        return icon;
    }

    private get showCloseButton(): boolean {
        return this.skin === MMessageSkin.Regular && this.closeButton;
    }

}

const MessagePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(MESSAGE_NAME, 'plugin.install');
        v.use(IconPlugin);
        v.use(IconButtonPlugin);
        v.use(I18nPlugin);
        v.component(MESSAGE_NAME, MMessage);
    }
};

export default MessagePlugin;
