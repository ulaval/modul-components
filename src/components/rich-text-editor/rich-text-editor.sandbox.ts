import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { InputManagement } from '../../mixins/input-management/input-management';
import { MRichText } from '../rich-text/rich-text';
import { MRichTextEditor } from './rich-text-editor';
import WithRender from './rich-text-editor.sandbox.html';

@WithRender
@Component({
    components: { MRichTextEditor, MRichText }
})
export class MRichTextEditorSandBox extends Vue {
    public model: string = '';
    public focus: boolean = false;
    public error: boolean = false;
    public errorMessage: string = '';
    public validMessage: string = '';
    public helperMessage: string = '';
    public waiting: boolean = false;
    public disabled: boolean = false;
    public readonly: boolean = false;
    public afficherFormulairePleinePage: boolean = false;
    public fullScreenFormModel: string = '';

    public initializedModel: string = '<p>Test text</p><p><strong>I should be bold</strong></p><p><em>I should be italic</em></p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;I should be tabulated</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;And me even more</p><ol><li>Ordered list</li><li>Unordered list</li></ol>';
    public linksOpenInNewWindowModel = '<p>Tests de la La case à cocher « Ouvrir dans un nouvel onglet ».</p><ol><li>Elle est <strong>sélectionnée par défaut&nbsp;</strong>à la création d&#39;un <strong>nouveau&nbsp;</strong>lien externe.</li><li>Elle est <strong>sélectionnée&nbsp;</strong>lors de la modification d&#39;un lien existant, si l&#39;utilisateur l&#39;a laissé sélectionnée à la création du <a href="http://google.ca" rel="noopener noreferrer" target="_blank">lien</a>.</li><li>Par contre, elle <strong>n&#39;est pas&nbsp;</strong><strong>sélectionnée&nbsp;</strong>lors de la modification d&#39;un lien existant, si l&#39;utilisateur l&#39;avait désélectionnée à la création du <a href="http://google.ca">lien</a>.</li></ol></div>';
    public inputFocusTestInputType = '';

    public todos: {todo: string, done: boolean}[] = [];
    public currentTodo: {todo: string, done: boolean} = { todo: '', done: false };
    public resetValue: string = '';

    public alertTestSuccess(message: string): void {
        alert(message);
    }

    public addTodo(): void {
        this.todos.push({ todo: this.currentTodo.todo, done: this.currentTodo.done });
        this.currentTodo = { todo: this.resetValue, done: false };
    }

    public focusEditor(): void {
        (this.$refs['rteTestFocus'] as InputManagement).focusInput();
    }
}
const RichTextEditorSandBoxPlugin: PluginObject<any> = {
    install(v): void {
        v.component(`m-rich-text-editor-sandbox`, MRichTextEditorSandBox);
    }
};

export default RichTextEditorSandBoxPlugin;
