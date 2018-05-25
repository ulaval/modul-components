import Vue, { PluginObject } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { INPLACE_EDIT_NAME } from '../component-names';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import { ModulVue } from '../../utils/vue/vue';
import ButtonPlugin from '../button/button';
import DialogPlugin from '../dialog/dialog';
import IconButtonPlugin from '../icon-button/icon-button';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
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
    @Prop({
        default: () => (Vue.prototype as any).$i18n.translate('m-inplace-edit:modify')
    })
    public title: string;

    private internalEditMode: boolean = false;
    private mqMounted: boolean;

    public confirm(event: Event): void {
        if (this.editMode) {
            this.$emit('ok');
        }
    }

    public cancel(event: Event): void {
        if (this.editMode) {
            this.propEditMode = false;
            this.$emit('cancel');
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

    private mounted(): void {
        // should be in next tick to skip the media query initial trigger on mounted
        this.$nextTick(() => this.mqMounted = true);
    }

    private onClick(event: MouseEvent): void {
        this.$emit('click', event);
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
        v.prototype.$log.warn(INPLACE_EDIT_NAME + ' is not ready for production');
        v.use(MediaQueriesPlugin);
        v.use(IconButtonPlugin);
        v.use(ButtonPlugin);
        v.use(DialogPlugin);
        v.component(INPLACE_EDIT_NAME, MInplaceEdit);
    }
};

export default InplaceEditPlugin;
