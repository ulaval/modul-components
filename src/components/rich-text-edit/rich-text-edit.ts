import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ElementQueries } from '../../mixins/element-queries/element-queries';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputState } from '../../mixins/input-state/input-state';
import { InputWidth } from '../../mixins/input-width/input-width';
import { ModulVue } from '../../utils/vue/vue';
import { InputManagement, InputManagementData } from './../../mixins/input-management/input-management';
import VueFroala from './adapter/vue-froala';
import { MRichTextEditorDefaultOptions, MRichTextEditorStandardOptions } from './rich-text-edit-options';
import WithRender from './rich-text-edit.html?style=./rich-text-edit.scss';

require('froala-editor/js/froala_editor.pkgd.min');
require('froala-editor/css/froala_editor.pkgd.min.css');
require('froala-editor/js/languages/fr.js');

export class MRichTextEditorOptions {}

const RICH_TEXT_LICENSE_KEY: string = 'm-rich-text-license-key';

export enum MRichTextEditMode {
    STANDARD
}

@WithRender
@Component({
    components: { Froala: VueFroala },
    mixins: [
        InputState,
        InputManagement,
        InputWidth,
        InputLabel,
        ElementQueries
    ]
})
export class MRichTextEdit extends ModulVue implements InputManagementData {
    // TODO : Do something with internalValue.
    internalValue: string;

    public tag: string = 'textarea';
    @Prop({ default: '' })
    public value: string = '';
    @Prop({ default: true })
    public readOnly: boolean;
    @Prop()
    public options: MRichTextEditorOptions | undefined;
    @Prop({
        default: MRichTextEditMode.STANDARD,
        validator: value => value === MRichTextEditMode.STANDARD
    })

    public mode: MRichTextEditMode;

    protected get internalOptions(): any {
        return Object.assign(this.getDefaultOptions(), this.options);
    }

    protected get froalaLicenseKey(): string {
        return this.$license.getLicense<string>(RICH_TEXT_LICENSE_KEY) || '';
    }

    protected refreshModel(newValue: string): void {
        this.$emit('input', newValue);
    }

    protected getDefaultOptions(): MRichTextEditorDefaultOptions {
        return new MRichTextEditorStandardOptions(this.froalaLicenseKey, this.$i18n.currentLang());
    }
}

export default MRichTextEdit;
