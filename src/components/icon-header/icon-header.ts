import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './icon-header.html?style=./icon-header.scss';
import { ModulVue } from '../../utils/vue/vue';
import { ICON_HEADER_NAME } from '../component-names';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
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
    mixins: [MediaQueries]
})
export class MIconHeader extends ModulVue {
    @Prop()
    public open: boolean;
    @Prop()
    public iconName: string;
    @Prop()
    public title: string;
    @Prop()
    public titreButton: string;
    @Prop({ default: '300px' })
    public windowMaxWidth: string;
    @Prop({ default: '460px' })
    public windowMaxHeight: string;
    @Prop()
    public headerHeight: string;
    @Prop({
        default: MIconHeaderPosition.Fixed,
        validator: value =>
            value == MIconHeaderPosition.Absolute ||
            value == MIconHeaderPosition.Fixed
    })
    public position: string;
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

    private internalOpen: boolean = false;

    protected mounted(): void {
        this.isOpen = this.open;
        this.$modul.event.$on('click', this.onDocumentClick);
    }

    protected beforeDestroy(): void {
        this.$modul.event.$off('click', this.onDocumentClick);
    }

    @Watch('open')
    private openChanged(open: boolean): void {
        this.isOpen = open;
    }

    private get isOpen(): boolean {
        return this.internalOpen;
    }

    private set isOpen(open: boolean) {
        this.internalOpen = open;
        if (open) {
            this.$emit('open');
        } else {
            this.$emit('close');
        }
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

    private toggleOpen(): void {
        this.isOpen = !this.isOpen;
    }

    private get styleMaxWidth(): string | undefined {
        return this.as<MediaQueries>().isMqMinS ? this.windowMaxWidth : undefined;
    }

    private get styleMaxHeight(): string | undefined {
        return this.as<MediaQueries>().isMqMinS ? this.windowMaxHeight : undefined;
    }

    private onDocumentClick(event: MouseEvent): void {
        if (this.isOpen) {
            let trigger: HTMLElement = this.$refs.window as HTMLElement;
            if (trigger && !trigger.contains(event.target as HTMLElement)) {
                this.isOpen = false;
            }
        }
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
