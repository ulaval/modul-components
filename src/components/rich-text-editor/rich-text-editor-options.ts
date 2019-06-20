import { FroalaToolbarButtons } from './adapter/vue-froala';

// TODO would ideally use a typescript definition
export class MRichTextEditorDefaultOptions {
    public immediateVueModelUpdate: boolean = true;
    public iconsTemplate: string = 'font_awesome_5';
    public charCounterCount: boolean = false;
    public tableInsertHelper: boolean = false;
    public zIndex: number = 5;
    public toolbarSticky: boolean = true;
    public scrollableContainer: string = 'body'; // The froala version 3 don't support 'scrollableContainer' with undefined value. By default is 'body'.
    public toolbarStickyOffset: number = 0;
    public pluginsEnabled: string[] = ['align', 'draggable', 'embedly', 'entities', 'file', 'fontFamily', 'fontSize', 'fullscreen', 'inlineStyle', 'lineBreaker', 'link', 'lists', 'paragraphFormat', 'paragraphStyle', 'quote', 'save', 'specialCharacters', 'table', 'url', 'wordPaste', 'stylesSubMenu', 'listesSubMenu', 'insertionsSubMenu', 'embedly'];
    public wordPasteModal: boolean = false;
    public initOnClick: boolean = true;
    public wordPasteKeepFormatting: boolean = false;
    public placeholderText: string = '';
    public listAdvancedTypes: boolean = false;
    public attribution: boolean = false;

    public paragraphStyles: any = {};
    public paragraphMultipleStyles: boolean = false;

    public linkEditButtons: string[] = ['linkOpen', 'linkEdit', 'linkRemove'];
    public linkInsertButtons: string[] = [];
    public imageResizeWithPercent: boolean = true;
    public imageDefaultWidth: number = 0;// Sets the default wiparagraphStylesdth of the image. Setting it to 0 will not set any width.
    public imageEditButtons: string[] = ['imageReplace', 'imageAlign', 'imageRemove', '|', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '|', 'imageAlt'];
    public shortcutsEnabled: string[] = ['paragraphStyle', 'bold', 'italic', 'subscript', 'superscript', 'formatUL', 'formatOL', 'outdent', 'indent', 'insertLink', 'specialCharacters', 'insertImage', 'fullscreen', 'undo', 'redo'];

    // The list of buttons that appear in the rich text editor's toolbar on large devices (≥ 1200px). 'styles-sub-menu', 'listes-sub-menu'
    public toolbarButtons: any = {
        moreText: {
            buttons: ['bold', 'italic', 'subscript', 'superscript'],
            buttonsVisible: FroalaToolbarButtons.moreTextVisible
        },
        moreParagraph: {
            buttons: ['formatUL', 'formatOL', 'outdent', 'indent'],
            buttonsVisible: FroalaToolbarButtons.moreParagraphVisible
        },
        moreRich: {
            buttons: ['insertLink', 'specialCharacters'],
            buttonsVisible: FroalaToolbarButtons.moreRichVisible
        },
        moreMisc: {
            buttons: ['fullscreen'],
            buttonsVisible: FroalaToolbarButtons.moreMiscVisible,
            align: 'right'
        }
    };

    // The list of buttons that appear in the rich text editor's toolbar on extra small devices (< 768px).
    public toolbarButtonsXS: any = {
        moreText: {
            buttons: ['bold', 'italic', 'subscript', 'superscript'],
            buttonsVisible: FroalaToolbarButtons.moreTextVisibleXS
        },
        moreParagraph: {
            buttons: ['formatUL', 'formatOL', 'outdent', 'indent'],
            buttonsVisible: FroalaToolbarButtons.moreParagraphVisibleXS
        },
        moreRich: {
            buttons: ['insertLink', 'specialCharacters'],
            buttonsVisible: FroalaToolbarButtons.moreRichVisibleXS
        },
        moreMisc: {
            buttons: ['fullscreen'],
            buttonsVisible: FroalaToolbarButtons.moreMiscVisibleXS,
            align: 'right'
        }
    };

    constructor(public key: string, public language: string = 'en_CA') {
        if (!key) {
            throw new Error('In order to use the rich-text-editor you need to provide a valid froala key.');
        }
    }
}
