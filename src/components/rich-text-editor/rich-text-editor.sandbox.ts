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
}

const RichTextEditorSandBoxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`m-rich-text-editor-sandbox`, MRichTextEditorSandBox);
    }
};

export default RichTextEditorSandBoxPlugin;
