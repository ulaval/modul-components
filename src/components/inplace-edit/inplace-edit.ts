import { MediaQueries } from '../../mixins/media-queries/media-queries';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { INPLACE_EDIT } from '../component-names';
import WithRender from './inplace-edit.html?style=./inplace-edit.scss';
import Vue, { PluginObject } from 'vue';
import I18nPlugin from '../i18n/i18n';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import IconButtonPlugin from '../icon-button/icon-button';
import ButtonPlugin from '../button/button';
import DialogPlugin from '../dialog/dialog';
import { ModulVue } from '../../utils/vue/vue';

export type SaveFn = () => Promise<void>;

@WithRender
@Component({
    mixins: [MediaQueries]
})
export class MInplaceEdit extends ModulVue {

    @Prop()
    public editMode: boolean;

    @Prop({
        default: () => (Vue.prototype as any).$i18n.translate('m-inplace-edit:modify')
    })
    public title: string;

    @Prop()
    public saveFn: SaveFn;

    private error: boolean = false;

    private internalEditMode: boolean = false;

    private submitted: boolean = false;

    public get isError(): boolean {
        return this.error;
    }

    public confirm(event: Event): void {
        if (this.editMode) {
            this.save();
            this.$emit('ok');
        }
    }

    public cancel(event: Event): void {
        if (this.editMode) {
            this.error = false;
            this.propEditMode = false;
            this.$emit('cancel');
        }
    }

    @Watch('editMode')
    public onEditMode(value: boolean): void {
        this.internalEditMode = value;
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

    private save(): void {
        if (this.saveFn) {
            this.submitted = true;
            this.error = false;
            this.saveFn().then(() => {
                this.propEditMode = false;
            }, () => {
                this.error = true;
            }).then(() => this.submitted = false);
        } else {
            console.warn('No save function provided (save-fn prop is undefined)');
        }
    }
}

const InplaceEditPlugin: PluginObject<any> = {
    install(v, options): void {
        console.warn(INPLACE_EDIT + ' is not ready for production');
        v.use(MediaQueriesPlugin);
        v.use(IconButtonPlugin);
        v.use(ButtonPlugin);
        v.use(DialogPlugin);
        v.component(INPLACE_EDIT, MInplaceEdit);
    }
};

export default InplaceEditPlugin;
