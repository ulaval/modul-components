import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { RICH_TEXT_EDITOR_NAME } from '../component-names';
import MRichText from './rich-text';
import MRichTextEdit from './rich-text-edit';
import WithRender from './rich-text-editor.sandbox.html';

@WithRender
@Component({
    components: { MRichTextEdit, MRichText }
})
export class MRichTextEditorSandBox extends Vue {
    public model: string = '';
    public isReadOnly: boolean = true;
}

const RichTextEditorSandBoxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${RICH_TEXT_EDITOR_NAME}-sandbox`, MRichTextEditorSandBox);
    }
};

export default RichTextEditorSandBoxPlugin;
