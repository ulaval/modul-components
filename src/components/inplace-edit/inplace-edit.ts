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
    public submitted: boolean;

    @Prop()
    public title: string;

    public confirm(event: Event): void {
        if (this.editMode) {
            this.$emit('confirm');
        }
    }

    public cancel(event: Event): void {
        if (this.editMode) {
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
