import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './popup.html?style=./popup.scss';
import { POPUP_NAME } from '../component-names';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import { MPopperPlacement } from '../popper/popper';
import PopperPlugin from '../popper/popper';
import SidebarPlugin from '../sidebar-window/sidebar-window';

@WithRender
@Component({
    mixins: [MediaQueries]
})
export class MPopup extends ModulVue {

    @Prop({ default: false })
    public open: boolean;
    @Prop({ default: MPopperPlacement.Bottom })
    public placement: MPopperPlacement;
    @Prop({ default: true })
    public openOnClick: boolean;
    @Prop({ default: false })
    public openOnOver: boolean;
    @Prop({ default: true })
    public focusManagement: boolean;
    @Prop({ default: 'auto' })
    public width: string;
    @Prop()
    public id: string;
    @Prop({ default: false })
    public disabled: boolean;
    @Prop({ default: '' })
    public classNamePortalTarget: string;
    @Prop({ default: true })
    public shadow: boolean;
    @Prop({ default: true })
    public padding: boolean;
    @Prop({ default: true })
    public paddingHeader: boolean;
    @Prop({ default: true })
    public paddingBody: boolean;
    @Prop({ default: true })
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

    public componentName: string = POPUP_NAME;
    private internalOpen: boolean = false;

    protected mounted(): void {
        this.propOpen = this.open;
    }

    public get propOpen(): boolean {
        return this.internalOpen;
    }

    public set propOpen(open) {
        if (open) {
            if (!this.internalOpen) {
                this.internalOpen = true;
                this.$emit('open');
            }

        } else {
            if (this.internalOpen) {
                this.internalOpen = false;
                this.$emit('close');
            }
        }
    }

    @Watch('open')
    private openChanged(open: boolean): void {
        this.propOpen = open;
    }

    private togglePopup(open: boolean): void {
        this.propOpen = open;
    }

    private get hasHeaderSlot(): boolean {
        return !!this.$slots.header;
    }

    private get hasBodySlot(): boolean {
        return !!this.$slots.body;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
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
