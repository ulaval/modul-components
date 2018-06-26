import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import VueFroala from 'vue-froala-wysiwyg';
import { Prop } from 'vue-property-decorator';

import LicensePlugin from '../../utils/license/license';
import { ModulVue } from '../../utils/vue/vue';
import { RICH_TEXT_EDITOR_NAME } from './../component-names';
import WithRender from './rich-text-editor.html?style=./rich-text-editor.scss';

require('froala-editor');

// Import fontawesome
require('@fortawesome/fontawesome');
require('@fortawesome/fontawesome-free-solid');

// Import froala editor.
require('jquery/dist/jquery.min.js');
require('froala-editor/js/froala_editor.pkgd.min');
require('froala-editor/css/froala_editor.pkgd.min.css');
require('froala-editor/css/froala_style.min.css');

export interface RichTextPluginOptions {
    key: string;
}
export interface MRichTextEditorOptions {}

const RICH_TEXT_LICENSE_KEY: string = 'm-rich-text-license-key';

class MRichTextEditorDefaultOptions {
    public immediateVueModelUpdate: boolean = true;
    public iconsTemplate: string = 'font_awesome_5';
}

@WithRender
@Component
export class MRichTextEditor extends ModulVue {
    public tag: string = 'textarea';
    @Prop()
    public value: string | undefined;
    @Prop()
    public options: MRichTextEditorOptions | undefined;

    public get licenseKey(): string | undefined {
        return this.$license.getLicense<string>(RICH_TEXT_LICENSE_KEY);
    }

    public get internalOptions(): any {
        return Object.assign(new MRichTextEditorDefaultOptions(), this.options);
    }

    public refreshModel(newValue: string): void {
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
            resolve(Object.assign(MRichTextEditor, { data: () => ({ richTextPluginOptions: options }) }));
        });
    }
}

export default new RichTextEditorPlugin();
