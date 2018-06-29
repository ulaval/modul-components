export abstract class MRichTextEditorDefaultOptions {
    public immediateVueModelUpdate: boolean = true;
    public iconsTemplate: string = 'font_awesome_5';

    public abstract toolbarButtons: string[] = [];

    constructor(public key: string, public language: string = 'en_CA') {
        if (!key) {
            throw new Error('In order to use the rich-text-editor you need to provide a valid froala key.');
        }
    }
}

export class MRichTextEditorStandardOptions extends MRichTextEditorDefaultOptions {
    public toolbarButtons: string[] = ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'paragraphFormat', 'align', 'formalOL',
        'formalUL', 'outdent', 'indent', 'quote', '|', 'insertLink', 'insertTable', '|', 'specialCharacters', 'selectAll', 'clearFormatting', '|',
        'help', '|', 'undo', 'redo' ];

    constructor(key: string, language: string | undefined) { super(key, language); }
}
