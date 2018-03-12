import { MediaQueries } from '../../mixins/media-queries/media-queries';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { WRAPPER_INLINE_EDITION } from '../component-names';
import WithRender from './wrapper-inline-edition.html?style=./wrapper-inline-edition.scss';
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
export class MWrapperInlineEdition extends ModulVue {

    @Prop({ default: () => { return false; } })
    public editMode: boolean;

    @Prop()
    public title: string;

    public confirm(): void {
        if (this.editMode) {
            this.$emit('confirm');
        }
    }

    public cancel(): void {
        if (this.editMode) {
            this.$emit('cancel');
        }
    }

    public get dialogTitle(): string {
        if (!this.title) {
            return this.$i18n.translate('m-wrapper-inline-edition:newValue');
        }
        return this.title;
    }
}

const WrapperInlineEditionPlugin: PluginObject<any> = {
    install(v, options): void {
        console.warn(WRAPPER_INLINE_EDITION + ' is not ready for production');
        v.use(MediaQueriesPlugin);
        v.use(IconButtonPlugin);
        v.use(ButtonPlugin);
        v.use(DialogPlugin);
        v.component(WRAPPER_INLINE_EDITION, MWrapperInlineEdition);
    }
};

export default WrapperInlineEditionPlugin;
