import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './icon-header.html?style=./icon-header.scss';
import { ModulVue } from '../../utils/vue/vue';
import { ICON_HEADER_NAME } from '../component-names';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import { Portal, PortalMixinImpl, PortalMixin, BackdropMode } from '../../mixins/portal/portal';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import IconPlugin from '../icon/icon';

export enum MIconHeaderPosition {
    Absolute = 'absolute',
    Fixed = 'fixed'
}

export enum MIconHeaderPlacement {
    Right = 'right',
    Left = 'left'
}

@WithRender
@Component({
    mixins: [MediaQueries, Portal]
})
export class MIconHeader extends ModulVue {
    @Prop()
    public iconName: string;
    @Prop()
    public title: string;
    @Prop()
    public buttonTitle: string;
    @Prop({ default: '300px' })
    public windowMaxWidth: string;
    @Prop({ default: '460px' })
    public windowMaxHeight: string;
    @Prop()
    public headerHeight: string;
    @Prop({ default: true })
    public outsideClose: boolean;
    @Prop({
        default: MIconHeaderPlacement.Right,
        validator: value =>
            value == MIconHeaderPlacement.Right ||
            value == MIconHeaderPlacement.Left
    })
    public placement: string;
    @Prop({ default: true })
    public padding: boolean;
    @Prop({ default: true })
    public paddingHeader: boolean;
    @Prop({ default: true })
    public paddingBody: boolean;
    @Prop({ default: true })
    public paddingFooter: boolean;

    private clickOnWindowActive: boolean;

    private popper: Popper | undefined;

    public handlesFocus(): boolean {
        return true;
    }

    public getBackdropMode(): BackdropMode {
        return BackdropMode.None;
    }

    public getPortalElement(): HTMLElement {
        return this.$refs.window as HTMLElement;
    }

    public doCustomPropOpen(value: boolean, el: HTMLElement): boolean {
        return true;
    }

    protected mounted(): void {
        this.$modul.event.$on('click', this.onDocumentClick);
    }

    protected beforeDestroy(): void {
        this.$modul.event.$off('click', this.onDocumentClick);
    }

    private onDocumentClick(event: MouseEvent): void {
        if (this.as<PortalMixin>().propOpen && !this.clickOnWindowActive && this.outsideClose) {
            let trigger: HTMLElement | undefined = this.as<PortalMixin>().getTrigger();
            if (!(this.as<PortalMixin>().getPortalElement().contains(event.target as Node) || this.$el.contains(event.target as HTMLElement) ||
                (trigger && trigger.contains(event.target as HTMLElement)))) {
                this.as<PortalMixin>().propOpen = false;
            }
        }

    }

    private onMousedown(): void {
        this.clickOnWindowActive = true;

        setTimeout(() => {
            this.clickOnWindowActive = false;
        }, 300);
    }

    private get hasTitle(): boolean {
        return !!this.title;
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }

    private get styleMaxWidth(): string | undefined {
        return this.as<MediaQueries>().isMqMinS ? this.windowMaxWidth : undefined;
    }

    private get styleMaxHeight(): string | undefined {
        return this.as<MediaQueries>().isMqMinS ? this.windowMaxHeight : undefined;
    }
}

const IconHeaderPlugin: PluginObject<any> = {
    install(v, options): void {
        console.debug(ICON_HEADER_NAME, 'plugin.install');
        v.use(IconPlugin);
        v.use(MediaQueriesPlugin);
        v.component(ICON_HEADER_NAME, MIconHeader);
    }
};

export default IconHeaderPlugin;
