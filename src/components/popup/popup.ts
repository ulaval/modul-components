import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './popup.html?style=./popup.scss';
import { POPUP_NAME } from '../component-names';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import PopperPlugin, { MPopperPlacement } from '../popper/popper';
import { MOpenTrigger, OpenTrigger, OpenTriggerMixin } from '../../mixins/open-trigger/open-trigger';
import SidebarPlugin from '../sidebar/sidebar';

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
    @Prop({ default: true })
    public shadow: boolean;
    @Prop({ default: true })
    public padding: boolean;
    @Prop({ default: false })
    public paddingHeader: boolean;
    @Prop({ default: false })
    public paddingBody: boolean;
    @Prop({ default: false })
    public paddingFooter: boolean;
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

    private internalOpen: boolean = false;

    public get popupBody(): Element {
        return (this.$children[0] as any).popupBody;
    }

    private get propOpen(): boolean {
        return this.open == undefined ? this.internalOpen : this.open;
    }

    private set propOpen(value: boolean) {
        this.internalOpen = value;
        this.$emit('update:open', value);
    }

    public get propOpenTrigger(): MOpenTrigger {
        return this.openTrigger; // todo: mobile + hover ??
    }

    public get trigger(): any {
        return !this.as<OpenTriggerMixin>().triggerHook ? undefined : this.as<OpenTriggerMixin>().triggerHook;
    }

    private onOpen(): void {
        this.$emit('open');
    }

    private onClose(): void {
        this.$emit('close');
    }

    private get hasHeaderSlot(): boolean {
        return !!this.$slots.header;
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }

    private get hasTriggerSlot(): boolean {
        return !!this.$slots.trigger;
    }
}

const PopupPlugin: PluginObject<any> = {
    install(v, options) {
        v.use(PopperPlugin);
        v.use(SidebarPlugin);
        v.component(POPUP_NAME, MPopup);
    }
};

export default PopupPlugin;
