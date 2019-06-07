// TODO would ideally use a typescript definition
export class MRichTextEditorDefaultOptions {
    public immediateVueModelUpdate: boolean = true;
    public iconsTemplate: string = 'font_awesome_5';
    public charCounterCount: boolean = false;
    public tableInsertHelper: boolean = false;
    public lineBreakerTags: string[] = [];
    public toolbarSticky: boolean = true;
    public scrollableContainer: string | undefined;
    public toolbarStickyOffset: number = 0;
    public pluginsEnabled: string[] = ['align', 'draggable', 'embedly', 'entities', 'file', 'fontFamily', 'fontSize', 'fullscreen', 'inlineStyle', 'lineBreaker', 'link', 'lists', 'paragraphFormat', 'paragraphStyle', 'quote', 'save', 'specialCharacters', 'table', 'url', 'wordPaste', 'stylesSubMenu', 'listesSubMenu', 'insertionsSubMenu'];
    public wordPasteModal: boolean = false;
    public initOnClick: boolean = true;
    public wordPasteKeepFormatting: boolean = false;
    public placeholderText: string = '';
    public listAdvancedTypes: boolean = false;
    public toolbarButtons: string[] = ['hide', 'styles-sub-menu', 'bold', 'italic', 'subscript', 'superscript', '|', 'listes-sub-menu', 'formatUL',
        'formatOL', 'outdent', 'indent', '|', 'insertLink', 'specialCharacters', '|', 'fullscreen'];

    public paragraphStyles: any = {};
    public paragraphMultipleStyles: boolean = false;

    public linkEditButtons: string[] = ['linkOpen', 'linkEdit', 'linkRemove'];
    public linkInsertButtons: string[] = [];

    public imageResizeWithPercent: boolean = true;
    public imageDefaultWidth: number = 0;
    public imageEditButtons: string[] = ['imageReplace', 'imageAlign', 'imageRemove', '|', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '|', 'imageAlt'];

    constructor(public key: string, public language: string = 'en_CA') {
        if (!key) {
            throw new Error('In order to use the rich-text-editor you need to provide a valid froala key.');
        }
    }
}
