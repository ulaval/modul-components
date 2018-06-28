import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { froalaEditorFunctionality } from './adapter/vue-froala';
import { MRichTextEditorOptions } from './rich-text-editor';
import WithRender from './rich-text-editor-write.html';

require('@fortawesome/fontawesome');
require('@fortawesome/fontawesome-free-solid');

require('froala-editor/js/froala_editor.pkgd.min');
require('froala-editor/css/froala_editor.pkgd.min.css');
require('froala-editor/js/languages/fr.js');

@WithRender
@Component({
    components: { Froala: froalaEditorFunctionality }
})
export class MRichTextEditorWrite extends ModulVue {
    public tag: string = 'textarea';
    @Prop({ default: '' })
    public value: string;
    @Prop()
    public options: MRichTextEditorOptions | undefined;

    protected refreshModel(newValue: string): void {
        this.$emit('input', newValue);
    }
}

export default MRichTextEditorWrite;
