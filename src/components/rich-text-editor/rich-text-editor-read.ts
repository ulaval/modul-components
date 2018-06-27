import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import WithRender from './rich-text-editor-read.html';

require('froala-editor/css/froala_editor.pkgd.min.css');

@WithRender
@Component
export class MRichTextEditorRead extends ModulVue {
    @Prop({ default: '' })
    public value: string;
}
