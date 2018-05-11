import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import { BackdropMode, Portal, PortalMixin, PortalMixinImpl, PortalTransitionDuration } from '../../mixins/portal/portal';
import { ModulVue } from '../../utils/vue/vue';
import { DIALOG_NAME } from '../component-names';
import WithRender from './dialog.html?style=./dialog.scss';

export enum MDialogSize {
    FullScreen = 'full-screen',
    Large = 'large',
    Regular = 'regular',
    Small = 'small'
}

@WithRender
@Component({
    mixins: [Portal]
})
export class MDialog extends ModulVue implements PortalMixinImpl {
    @Prop({
        default: MDialogSize.Regular,
        validator: value =>
            value === MDialogSize.Regular ||
            value === MDialogSize.FullScreen ||
            value === MDialogSize.Large ||
            value === MDialogSize.Small
    })
    public size: MDialogSize;

    @Prop({ default: true })
    public closeOnBackdrop: boolean;

    @Prop()
    public title: string;
    @Prop({ default: true })
    public bodyMaxWidth: boolean;
    @Prop({ default: true })
    public padding: boolean;
    @Prop({ default: true })
    public paddingHeader: boolean;
    @Prop({ default: true })
    public paddingBody: boolean;
    @Prop({ default: true })
    public paddingFooter: boolean;

    $refs: {
        body: HTMLElement;
        dialogWrap: HTMLElement;
        article: HTMLElement;
    };

    public closeDialog(): void {
        this.as<PortalMixin>().tryClose();
    }

    public handlesFocus(): boolean {
        return true;
    }

    public doCustomPropOpen(value: boolean): boolean {
        return false;
    }

    public getBackdropMode(): BackdropMode {
        return this.sizeFullSceen ? BackdropMode.ScrollOnly : BackdropMode.BackdropFast;
    }

    public get sizeFullSceen(): boolean {
        let fullScreen: boolean = !this.as<MediaQueriesMixin>().isMqMinS ? true : this.size === MDialogSize.FullScreen ? true : false;
        this.as<Portal>().transitionDuration = fullScreen ? PortalTransitionDuration.XSlow : PortalTransitionDuration.Regular;
        return fullScreen;
    }

    public get sizeLarge(): boolean {
        return this.as<MediaQueriesMixin>().isMqMinS && this.size === MDialogSize.Large;
    }

    public get sizeSmall(): boolean {
        return this.as<MediaQueriesMixin>().isMqMinS && this.size === MDialogSize.Small;
    }

    public getPortalElement(): HTMLElement {
        return this.$refs.article;
    }

    protected mounted(): void {
        if (!this.hasHeader) {
            this.$log.warn('<' + DIALOG_NAME + '> needs a header slot or title prop.');
        }
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }

    private get hasHeader(): boolean {
        return this.hasTitle || !!this.$slots.header;
    }

    private get hasTitle(): boolean {
        return !!this.title;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }

    private backdropClick(): void {
        if (this.closeOnBackdrop) {
            this.as<PortalMixin>().tryClose();
        }
    }
}

const DialogPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(DIALOG_NAME, MDialog);
    }
};

export default DialogPlugin;
