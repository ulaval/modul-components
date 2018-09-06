export abstract class MRichTextEditorDefaultOptions {
    public immediateVueModelUpdate: boolean = true;
    public iconsTemplate: string = 'font_awesome_5';
    public charCounterCount: boolean = false;
    public tableInsertHelper: boolean = false;
    public lineBreakerTags: string [] = [];
    public zIndex: number = 200;
    public toolbarSticky: boolean = true;
    public scrollableContainer: string | undefined;
    public toolbarStickyOffset: number = 0;
    public pluginsEnabled: string[] = ['align', 'draggable', 'embedly', 'entities', 'file', 'fontFamily', 'fontSize', 'fullscreen', 'inlineStyle', 'lineBreaker', 'link', 'lists', 'paragraphFormat', 'paragraphStyle', 'quote', 'save', 'specialCharacters', 'table', 'url', 'wordPaste', 'stylesSubMenu', 'listesSubMenu', 'insertionsSubMenu'];
    public wordPasteModal: boolean = true;

    constructor(public key: string, public language: string = 'en_CA') {
        if (!key) {
            throw new Error('In order to use the rich-text-editor you need to provide a valid froala key.');
        }
    }
}

export class MRichTextEditorStandardOptions extends MRichTextEditorDefaultOptions {
    public toolbarButtons: string[] = ['hide', 'styles-sub-menu', 'bold', 'italic', 'subscript', 'superscript', '|', 'listes-sub-menu', 'formatUL',
        'formatOL', 'outdent', 'indent', '|', 'insertLink', 'specialCharacters', '|', 'fullscreen'];

    public linkEditButtons: string[] = ['linkOpen', 'linkEdit', 'linkRemove'];

    public linkInsertButtons: string[] = [];

    constructor(key: string, language?: string | undefined) { super(key, language); }
}
