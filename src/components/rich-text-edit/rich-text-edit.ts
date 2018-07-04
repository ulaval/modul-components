import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import VueFroala from './adapter/vue-froala';
import { MRichTextEditorDefaultOptions, MRichTextEditorStandardOptions } from './rich-text-edit-options';
import WithRender from './rich-text-edit.html';

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
    components: { Froala: VueFroala }
})
export class MRichTextEdit extends ModulVue {
    public tag: string = 'div';
    @Prop({ default: '' })
    public value: string;
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
