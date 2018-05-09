import Vue, { PluginObject } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';

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
    mixins: [MediaQueries]
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
    private internalError: boolean = false;
    private submitted: boolean = false;

    public get isError(): boolean {
        return this.error ? this.error : this.internalError;
    }

    public confirm(event: Event): void {
        if (this.editMode) {
            this.save();
            this.$emit('ok');
        }
    }

    public cancel(event: Event): void {
        if (this.editMode) {
            this.internalError = false;
            this.propEditMode = false;
            this.$emit('cancel');
        }
    }

    @Watch('editMode')
    public onEditMode(value: boolean): void {
        this.internalEditMode = value;
    }

    @Watch('error')
    private errorChanged(value: boolean): void {
        this.internalError = value;
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
            this.internalError = false;
            this.saveFn().then(() => {
                this.propEditMode = false;
            }, () => {
                this.internalError = true;
            }).then(() => this.submitted = false);
        } else {
            this.$log.warn('No save function provided (save-fn prop is undefined)');
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
