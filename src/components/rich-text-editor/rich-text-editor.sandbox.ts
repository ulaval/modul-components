import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { MRichText } from '../rich-text/rich-text';
import { MRichTextEditor } from './rich-text-editor';
import WithRender from './rich-text-editor.sandbox.html';

@WithRender
@Component({
    components: { MRichTextEditor, MRichText }
})
export class MRichTextEditorSandBox extends Vue {
    public model: string = '';
    public isReadOnly: boolean = true;
    public focus: boolean = false;
    public error: boolean = false;
    public errorMessage: string = '';
    public validMessage: string = '';
    public helperMessage: string = '';
    public waiting: boolean = false;
    public disabled: boolean = false;
    public afficherFormulairePleinePage: boolean = false;
    public fullScreenFormModel: string = '';
    public initializedModel: string = '<p>Test text</p><p><strong>I should be bold</strong></p><p><em>I should be italic</em></p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;I should be tabulated</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;And me even more</p><ol><li>Ordered list</li><li>Unordered list</li></ol>';
    public inputFocusTestInputType = '';

    public alertTestSuccess(message: string): void {
        alert(message);
    }
}

const RichTextEditorSandBoxPlugin: PluginObject<any> = {
    install(v): void {
        v.component(`m-rich-text-editor-sandbox`, MRichTextEditorSandBox);
    }
};

export default RichTextEditorSandBoxPlugin;
