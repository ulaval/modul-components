import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import VueFroala from 'vue-froala-wysiwyg';
import { Prop } from 'vue-property-decorator';

import LicensePlugin from '../../utils/license/license';
import { ModulVue } from '../../utils/vue/vue';
import { RICH_TEXT_EDITOR_NAME } from './../component-names';
import { MRichTextEditorRead } from './rich-text-editor-read';
import WithRender from './rich-text-editor.html';

require('@fortawesome/fontawesome');
require('@fortawesome/fontawesome-free-solid');

require('froala-editor/js/froala_editor.pkgd.min');
require('froala-editor/css/froala_editor.pkgd.min.css');

export interface RichTextPluginOptions {
    key: string;
}
export interface MRichTextEditorOptions {}

const RICH_TEXT_LICENSE_KEY: string = 'm-rich-text-license-key';

class MRichTextEditorDefaultOptions {
    public immediateVueModelUpdate: boolean = true;
    public iconsTemplate: string = 'font_awesome_5';

    constructor(public key: string) {
        if (!key) {
            throw new Error('In order to use the rich-text-editor you need to provide a valid froala key.');
        }
    }
}

@WithRender
@Component({
    components: { MRichTextEditorRead }
})
export class MRichTextEditor extends ModulVue {
    public tag: string = 'textarea';
    @Prop({ default: '' })
    public value: string;
    @Prop({ default: true })
    public readOnly: boolean;
    @Prop()
    public options: MRichTextEditorOptions | undefined;

    protected get internalOptions(): any {
        return Object.assign(new MRichTextEditorDefaultOptions(this.froalaLicenseKey), this.options);
    }

    protected get froalaLicenseKey(): string {
        return this.$license.getLicense<string>(RICH_TEXT_LICENSE_KEY) || '';
    }

    protected refreshModel(newValue: string): void {
        this.$emit('input', newValue);
    }
}

class RichTextEditorPlugin implements PluginObject<RichTextPluginOptions> {
    install(v, options: RichTextPluginOptions): void {
        v.use(LicensePlugin);
        if (options.key) {
            (v.prototype as ModulVue).$license.addLicense(RICH_TEXT_LICENSE_KEY, options.key);
        }
        v.use(VueFroala);
        v.component(RICH_TEXT_EDITOR_NAME, MRichTextEditor);
        v.component('async-component', (resolve) => {
            resolve(MRichTextEditor);
        });
    }
}

export default new RichTextEditorPlugin();
