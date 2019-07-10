import Vue, { PluginObject } from 'vue';
import { Component, Emit, Prop, Watch } from 'vue-property-decorator';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import { ModulVue } from '../../utils/vue/vue';
import ButtonPlugin from '../button/button';
import { INPLACE_EDIT_NAME } from '../component-names';
import OverlayPlugin from '../overlay/overlay';
import AccordionTransitionPlugin from '../transitions/accordion-transition/accordion-transition';
import WithRender from './inplace-edit.html?style=./inplace-edit.scss';

@WithRender
@Component({
    mixins: [MediaQueries]
})
export class MInplaceEdit extends ModulVue {

    @Prop()
    public editMode: boolean;
    @Prop()
    public error: boolean;
    @Prop()
    public waiting: boolean;
    @Prop()
    public padding: string;
    @Prop()
    public editModePadding: string;
    @Prop({
        default: () => (Vue.prototype).$i18n.translate('m-inplace-edit:modify')
    })
    public title: string;

    private internalEditMode: boolean = false;
    private mqMounted: boolean;

    @Emit('ok')
    onOk(): void { }

    @Emit('cancel')
    onCancel(): void { }

    @Emit('click')
    onClick(event: MouseEvent): void { }

    public confirm(event: Event): void {
        if (this.editMode) {
            this.onOk();
        }
    }

    public cancel(event: Event): void {
        if (this.editMode) {
            this.propEditMode = false;
            this.onCancel();
        }
    }

    @Watch('editMode')
    public onEditMode(value: boolean): void {
        this.internalEditMode = value;
    }

    @Watch('isMqMaxS')
    public onMaxS(value: boolean, old: boolean): void {
        if (this.mqMounted) {
            this.propEditMode = false;
        }
    }

    get propPadding(): string {
        if (!this.propEditMode && this.padding) {
            return 'padding:' + this.padding;
        } else if (this.propEditMode && this.editModePadding) {
            return 'padding:' + this.editModePadding;
        } else {
            return '';
        }
    }

    private mounted(): void {
        // should be in next tick to skip the media query initial trigger on mounted
        this.$nextTick(() => this.mqMounted = true);
    }

    private get propEditMode(): boolean {
        return this.editMode || this.internalEditMode;
    }

    private set propEditMode(value: boolean) {
        this.internalEditMode = value;
        this.$emit('update:editMode', value);
    }
}

const InplaceEditPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(AccordionTransitionPlugin);
        v.use(OverlayPlugin);
        v.use(ButtonPlugin);
        v.component(INPLACE_EDIT_NAME, MInplaceEdit);
    }
};

export default InplaceEditPlugin;
