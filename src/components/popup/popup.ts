import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import { MOpenTrigger, OpenTrigger, OpenTriggerMixin } from '../../mixins/open-trigger/open-trigger';
import { ModulVue } from '../../utils/vue/vue';
import { POPUP_NAME } from '../component-names';
import PopperPlugin, { MPopper, MPopperPlacement } from '../popper/popper';
import SidebarPlugin from '../sidebar/sidebar';
import WithRender from './popup.html?style=./popup.scss';


@WithRender
@Component({
    mixins: [MediaQueries, OpenTrigger]
})
export class MPopup extends ModulVue {

    @Prop()
    public open: boolean;
    @Prop({ default: MPopperPlacement.Bottom })
    public placement: MPopperPlacement;
    @Prop({ default: MOpenTrigger.Click })
    public openTrigger: MOpenTrigger;
    @Prop()
    public closeOnBackdrop: boolean;
    @Prop({ default: true })
    public focusManagement: boolean;
    @Prop({ default: 'auto' })
    public width: string;
    @Prop()
    public id: string;
    @Prop()
    public disabled: boolean;
    @Prop()
    public shadow: boolean;
    @Prop({ default: true })
    public padding: boolean;
    @Prop({ default: true })
    public paddingHeader: boolean;
    @Prop({ default: true })
    public paddingBody: boolean;
    @Prop({ default: true })
    public paddingFooter: boolean;
    @Prop({ default: true })
    public background: boolean;
    @Prop()
    public beforeEnter: any;
    @Prop()
    public enter: any;
    @Prop()
    public afterEnter: any;
    @Prop()
    public enterCancelled: any;
    @Prop()
    public beforeLeave: any;
    @Prop()
    public leave: any;
    @Prop()
    public afterLeave: any;
    @Prop()
    public leaveCancelled: any;
    @Prop()
    public desktopOnly: boolean;
    @Prop()
    public className: string;
    @Prop()
    public preload: boolean;
    @Prop()
    public trigger: HTMLElement;
    @Prop({ default: true })
    public lazy: boolean;

    public $refs: {
        popper: MPopper;
    };

    private internalOpen: boolean = false;

    public get popupBody(): Element {
        return (this.$children[0] as any).popupBody;
    }

    private get propOpen(): boolean {
        return this.open === undefined ? this.internalOpen : this.open;
    }

    private set propOpen(value: boolean) {
        if (!this.disabled) {
            this.internalOpen = value;
            this.$emit('update:open', value);
        }
    }

    @Emit('open')
    private onOpen(): void { }

    @Emit('close')
    private onClose(): void { }

    public get propOpenTrigger(): MOpenTrigger {
        return this.openTrigger; // todo: mobile + hover ??
    }

    public get propTrigger(): HTMLElement {
        return this.trigger || this.as<OpenTriggerMixin>().triggerHook || undefined;
    }

    private onPortalMounted(): void {
        this.$emit('portal-mounted');
    }

    private onPortalAfterOpen(): void {
        this.$emit('portal-after-open');
    }

    private get hasTriggerSlot(): boolean {
        return !!this.$slots.trigger;
    }
}

const PopupPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(PopperPlugin);
        v.use(SidebarPlugin);

        v.component(POPUP_NAME, MPopup);
    }
};

export default PopupPlugin;
