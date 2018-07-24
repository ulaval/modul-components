import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { MRichTextEdit } from '../rich-text-edit/rich-text-edit';
import { MRichText } from './rich-text';
import WithRender from './rich-text.sandbox.html';

@WithRender
@Component({
    components: { MRichTextEdit, MRichText }
})
export class MRichTextSandBox extends Vue {
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

const RichTextSandBoxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`m-rich-text-sandbox`, MRichTextSandBox);
    }
};

export default RichTextSandBoxPlugin;
