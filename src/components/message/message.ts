
import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import I18nFilterPlugin from '../../filters/i18n/i18n';
import { MESSAGE_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import IconButtonPlugin from '../icon-button/icon-button';
import IconPlugin from '../icon/icon';
import MessagePagePlugin, { MMessagePageSkin } from '../message-page/message-page';
import WithRender from './message.html?style=./message.scss';

export enum MMessageState {
    Confirmation = 'confirmation',
    Information = 'information',
    Warning = 'warning',
    Error = 'error'
}

export enum MMessageSkin {
    Default = 'default',
    Light = 'light',
    PageLight = 'page-light',
    Page = 'page'
}

@WithRender
@Component
export class MMessage extends Vue {
    @Prop({
        default: MMessageState.Confirmation,
        validator: value =>
            value === MMessageState.Confirmation ||
            value === MMessageState.Information ||
            value === MMessageState.Warning ||
            value === MMessageState.Error
    })
    public state: MMessageState;

    @Prop({
        default: MMessageSkin.Default,
        validator: value =>
            value === MMessageSkin.Default ||
            value === MMessageSkin.Light ||
            value === MMessageSkin.PageLight ||
            value === MMessageSkin.Page
    })
    public skin: MMessageSkin;

    @Prop({ default: true })
    public icon: boolean;

    @Prop()
    public title: string;

    @Prop()
    public closeButton: boolean;

    @Prop({ default: true })
    public visible: boolean;

    private internalVisible: boolean = true;
    private animReady: boolean = false;

    @Emit('close')
    onClose(event: Event): void {
        this.propVisible = false;
    }

    protected mounted(): void {
        this.propVisible = this.visible;
        setTimeout(() => {
            this.animReady = true;
        });
    }

    @Watch('visible')
    private onVisibleChange(value: boolean): void {
        this.propVisible = value;
    }

    private get propVisible(): boolean {
        return this.internalVisible;
    }

    private set propVisible(visible: boolean) {
        this.internalVisible = visible === undefined ? true : visible;
        this.$emit('update:visible', this.internalVisible);
    }

    private getIcon(): string {
        let icon: string = '';
        switch (this.state) {
            case MMessageState.Confirmation:
                icon = 'm-svg__confirmation';
                break;
            case MMessageState.Information:
                icon = 'm-svg__information';
                break;
            case MMessageState.Warning:
                icon = 'm-svg__warning';
                break;
            case MMessageState.Error:
                icon = 'm-svg__error';
                break;
            default:
                break;
        }
        return icon;
    }

    private get isSkinDefault(): boolean {
        return this.skin === MMessageSkin.Default;
    }

    private get isSkinLight(): boolean {
        return this.skin === MMessageSkin.Light;
    }

    private get isNotSkinPage(): boolean {
        return !this.isSkinPage && !this.isSkinPageLight;
    }

    private get skinPageValue(): string {
        return this.isSkinPage ? MMessagePageSkin.Default : MMessagePageSkin.Light;
    }

    private get isSkinPage(): boolean {
        return this.skin === MMessageSkin.Page;
    }

    private get isSkinPageLight(): boolean {
        return this.skin === MMessageSkin.PageLight;
    }

    private get isStateInformation(): boolean {
        return this.state === MMessageState.Information;
    }

    private get isStateWarning(): boolean {
        return this.state === MMessageState.Warning;
    }

    private get isStateError(): boolean {
        return this.state === MMessageState.Error;
    }

    private get isStateConfirmation(): boolean {
        return this.state === MMessageState.Confirmation;
    }

    private get showCloseButton(): boolean {
        return this.skin === MMessageSkin.Default && this.closeButton;
    }
}

const MessagePlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(IconPlugin);
        v.use(IconButtonPlugin);
        v.use(MessagePagePlugin);
        v.use(I18nFilterPlugin);
        v.use(I18nPlugin);
        v.component(MESSAGE_NAME, MMessage);
    }
};

export default MessagePlugin;
