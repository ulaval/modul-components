import { MediaQueries } from '../../mixins/media-queries/media-queries';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { INPLACE_EDIT } from '../component-names';
import WithRender from './inplace-edit.html?style=./inplace-edit.scss';
import { PluginObject } from 'vue';
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
    public saveFn: SaveFn;

    @Prop()
    public editMode: boolean;

    // @Prop()
    public error: boolean = false;

    public submitted: boolean = false;

    @Prop()
    public title: string;

    private intEm: boolean = false;

    @Watch('editMode')
    public onEditMode(v: boolean): void {
        this.intEm = v;
    }

    public mounted(): void {
        this.intEm = this.editMode;
    }

    public confirm(event: Event): void {
        if (this.editMode) {
            this.save();
            this.$emit('confirm');
        }
    }

    public cancel(event: Event): void {
        if (this.editMode) {
            this.propEditMode = false;
            this.$emit('cancel');
        }
    }

    public get dialogTitle(): string {
        if (!this.title) {
            return this.$i18n.translate('m-inplace-edit:modify');
        }
        return this.title;
    }

    private onClick(event: MouseEvent): void {
        this.$emit('click', event);
    }

    private get propEditMode(): boolean {
        return this.editMode === undefined ? this.intEm : this.editMode;
    }

    private set propEditMode(v: boolean) {
        this.intEm = v;
        this.$emit('update:editMode', v);
    }

    private save(): void {
        if (this.saveFn) {
            this.submitted = true;
            this.error = false;
            this.saveFn().then(() => {
                this.submitted = false;
                console.log('yes!!!');
                this.propEditMode = false;
            }, () => {
                this.submitted = false;
                this.error = true;
                console.log('nooooooooo!!!');
            });
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
