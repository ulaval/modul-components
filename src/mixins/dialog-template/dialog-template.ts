import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import uuid from '../../utils/uuid/uuid';
import { MediaQueries } from '../../mixins/media-queries/media-queries';

const MODE_PRIMARY: string = 'primary';
const MODE_SECONDARY: string = 'secondary';
const MODE_PANEL: string = 'panel';

const DIALOG_ID: string = 'mDialog';
const TRANSITION_DURATION: number = 300;
const TRANSITION_DURATION_LONG: number = 600;

export interface DialogTemplateMixin {
    mode: string;
    componentName: string;
}

@Component({
    mixins: [MediaQueries]
})
export class DialogTemplate extends ModulVue implements DialogTemplateMixin {

    @Prop({ default: DIALOG_ID })
    public id: string;
    @Prop({ default: false })
    public open: boolean;
    @Prop({ default: false })
    public disabled: boolean;
    @Prop()
    public closeOnBackdrop: boolean;
    @Prop({ default: '' })
    public title: string;
    @Prop()
    public className: string;
    @Prop({ default: true })
    public padding: boolean;
    @Prop({ default: true })
    public paddingHeader: boolean;
    @Prop({ default: true })
    public paddingBody: boolean;
    @Prop({ default: true })
    public paddingFooter: boolean;

    public mode: string;
    public componentName: string;
    public propCloseOnBackdrop: boolean;
    public transitionDuration: number = TRANSITION_DURATION;
    public isScreenMaxS: boolean;

    private get propMode(): string {
        let mode: string = this.mode == MODE_SECONDARY || this.mode == MODE_PANEL ? this.mode : MODE_PRIMARY;
        switch (mode) {
            case MODE_SECONDARY:
                this.propCloseOnBackdrop = this.closeOnBackdrop == undefined ? true : this.closeOnBackdrop;
                this.transitionDuration = this.isScreenMaxS ? TRANSITION_DURATION_LONG : TRANSITION_DURATION;
                break;
            case MODE_PANEL:
                this.propCloseOnBackdrop = this.closeOnBackdrop == undefined ? true : this.closeOnBackdrop;
                this.transitionDuration = TRANSITION_DURATION_LONG;
                break;
            default:
                this.propCloseOnBackdrop = this.closeOnBackdrop == undefined ? false : this.closeOnBackdrop;
                this.transitionDuration = TRANSITION_DURATION;
        }
        return mode;
    }

    private get hasTitle(): boolean {
        return this.title == '' ? false : true;
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

    private get hasDefaultSlots(): boolean {
        return !!this.$slots.default;
    }
}
