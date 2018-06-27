import Component from 'vue-class-component';
import { Prop, Vue } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import VueFroala from './adapter';
import { MRichTextEditorOptions } from './rich-text-editor';
import WithRender from './rich-text-editor-write.html';

require('@fortawesome/fontawesome');
require('@fortawesome/fontawesome-free-solid');

require('froala-editor/js/froala_editor.pkgd.min');
require('froala-editor/css/froala_editor.pkgd.min.css');

Vue.use(VueFroala);
@WithRender
@Component
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
