import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import VueFroala from 'vue-froala-wysiwyg';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { RICH_TEXT_EDITOR } from './../component-names';
import WithRender from './rich-text-editor.html?style=./rich-text-editor.scss';

// Import froala editor.
require('froala-editor/js/froala_editor.pkgd.min');
require('froala-editor/css/froala_editor.pkgd.min.css');
require('font-awesome/css/font-awesome.css');
require('froala-editor/css/froala_style.min.css');

export interface MRichTextEditorOptions {}

class MRichTextEditorDefaultOptions {
    public immediateVueModelUpdate: boolean = true;
}

@WithRender
@Component
export class MRichTextEditor extends ModulVue {
    public tag: string = 'textarea';
    @Prop()
    public value: string | undefined;
    @Prop()
    public options: MRichTextEditorOptions | undefined;

    public get internalOptions(): any {
        return Object.assign(new MRichTextEditorDefaultOptions(), this.options);
    }

    public refreshModel(newValue: string): void {
        this.$emit('input', newValue);
    }
}

const RichTextEditorPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(VueFroala);
        v.component(RICH_TEXT_EDITOR, MRichTextEditor);
    }
};

export default RichTextEditorPlugin;
