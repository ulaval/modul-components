import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { RICH_TEXT_EDITOR_NAME } from '../component-names';
import WithRender from './rich-text-editor.sandbox.html';

@WithRender
@Component
export class MRichTextEditorSandBox extends Vue {
    public model: string = '';
}

const RichTextEditorSandBoxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${RICH_TEXT_EDITOR_NAME}-sandbox`, MRichTextEditorSandBox);
    }
};

export default RichTextEditorSandBoxPlugin;
