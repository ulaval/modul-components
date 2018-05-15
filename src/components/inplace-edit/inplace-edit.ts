import Vue, { PluginObject } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';

import { ElementQueries } from '../../mixins/element-queries/element-queries';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import { ModulVue } from '../../utils/vue/vue';
import ButtonPlugin from '../button/button';
import { INPLACE_EDIT } from '../component-names';
import DialogPlugin from '../dialog/dialog';
import IconButtonPlugin from '../icon-button/icon-button';
import WithRender from './inplace-edit.html?style=./inplace-edit.scss';

export type SaveFn = () => Promise<void>;

@WithRender
@Component({
    mixins: [MediaQueries, ElementQueries]
})
export class MInplaceEdit extends ModulVue {

    @Prop()
    public editMode: boolean;

    @Prop()
    public error: boolean;

    @Prop({
        default: () => (Vue.prototype as any).$i18n.translate('m-inplace-edit:modify')
    })
    public title: string;

    @Prop()
    public saveFn: SaveFn;

    private internalEditMode: boolean = false;
    private submitted: boolean = false;
    private isInitMobile: boolean;
    private isInitTable: boolean;

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

    private mounted(): void {
        this.isInitMobile = this.as<MediaQueries>().isMqMaxS;
        this.isInitTable = this.as<MediaQueries>().isMqMinS;
        this.as<ElementQueries>().$on('resizeDone', this.resetEditMode);
    }

    private onClick(event: MouseEvent): void {
        this.$emit('click', event);
    }

    private get propEditMode(): boolean {
        return this.editMode === undefined ? this.internalEditMode : this.editMode;
    }

    private set propEditMode(value: boolean) {
        this.internalEditMode = value;
        this.$emit('update:editMode', value);
    }

    private resetEditMode(): void {
        if (this.isInitMobile && this.as<MediaQueries>().isMqMinS && this.propEditMode) {
            this.isInitMobile = false;
            this.isInitTable = true;
        } else if (this.isInitTable && this.as<MediaQueries>().isMqMaxS && this.propEditMode) {
            this.isInitMobile = true;
            this.isInitTable = false;
            this.propEditMode = false;
        }
    }
}

const InplaceEditPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.warn(INPLACE_EDIT + ' is not ready for production');
        v.use(MediaQueriesPlugin);
        v.use(IconButtonPlugin);
        v.use(ButtonPlugin);
        v.use(DialogPlugin);
        v.component(INPLACE_EDIT, MInplaceEdit);
    }
};

export default InplaceEditPlugin;
