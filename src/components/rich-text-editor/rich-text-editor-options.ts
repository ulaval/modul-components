
// TODO would ideally use a typescript definition
export class MRichTextEditorDefaultOptions {
    public immediateVueModelUpdate: boolean = true;
    public iconsTemplate: string = 'font_awesome_5';
    public charCounterCount: boolean = false;
    public tableInsertHelper: boolean = false;
    // public lineBreakerTags: string[] = []; //dont need that, because we dont import the plugin lineBreaker.
    // public zIndex: number = 200;
    public toolbarSticky: boolean = true;
    public scrollableContainer: string | undefined;
    public toolbarStickyOffset: number = 0;
    public pluginsEnabled: string[] = ['align', 'draggable', 'embedly', 'entities', 'file', 'fontFamily', 'fontSize', 'fullscreen', 'inlineStyle', 'lineBreaker', 'link', 'lists', 'paragraphFormat', 'paragraphStyle', 'quote', 'save', 'specialCharacters', 'table', 'url', 'wordPaste', 'stylesSubMenu', 'listesSubMenu', 'insertionsSubMenu'];
    public wordPasteModal: boolean = false;
    public initOnClick: boolean = true;
    public wordPasteKeepFormatting: boolean = false;
    public placeholderText: string = '';
    // public toolbarContainer: string = '#toolbarContainer';
    public listAdvancedTypes: boolean = false;

    public paragraphStyles: any = {};
    public paragraphMultipleStyles: boolean = false;

    public linkEditButtons: string[] = ['linkOpen', 'linkEdit', 'linkRemove'];
    public linkInsertButtons: string[] = [];
    public imageResizeWithPercent: boolean = true;
    public imageDefaultWidth: number = 0;// Sets the default wiparagraphStylesdth of the image. Setting it to 0 will not set any width.
    public imageEditButtons: string[] = ['imageReplace', 'imageAlign', 'imageRemove', '|', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '|', 'imageAlt'];
    public shortcutsEnabled: string[] = ['paragraphStyle', 'bold', 'italic', 'subscript', 'superscript', 'formatUL', 'formatOL', 'outdent', 'indent', 'insertLink', 'specialCharacters', 'insertImage', 'fullscreen'];

    // The list of buttons that appear in the rich text editor's toolbar on large devices (≥ 1200px). 'styles-sub-menu', 'listes-sub-menu'
    public toolbarButtons: any = {
        moreText: {
            buttons: ['bold', 'italic', 'subscript', 'superscript'],
            buttonsVisible: 6
        },
        moreParagraph: {
            buttons: ['formatUL', 'formatOL', 'outdent', 'indent'],
            buttonsVisible: 4
        },
        moreRich: {
            buttons: ['insertLink', 'specialCharacters'],
            buttonsVisible: 2
        },
        moreMisc: {
            buttons: ['fullscreen'],
            buttonsVisible: 1,
            align: 'right'
        }
    };
    // // The list of buttons that appear in the rich text editor's toolbar on medium devices (≥ 992px).
    // public toolbarButtonsMD: any = {
    //     moreText: {
    //         buttons: ['paragraphStyle', 'bold', 'italic', 'subscript', 'superscript', '|'],
    //         buttonsVisible: 5
    //     },
    //     moreParagraph: {
    //         buttons: ['listes-sub-menu', 'formatUL', 'formatOL', 'outdent', 'indent', '|'],
    //         buttonsVisible: 5
    //     },
    //     moreRich: {
    //         buttons: ['insertLink', 'specialCharacters', '|'],
    //         buttonsVisible: 2
    //     },
    //     moreMisc: {
    //         buttons: ['fullscreen'],
    //         buttonsVisible: 1,
    //         align: 'right'
    //     }
    // };
    // // The list of buttons that appear in the rich text editor's toolbar on small devices (≥ 768px).
    // public toolbarButtonsSM: any = {
    //     moreText: {
    //         buttons: ['styles-sub-menu', 'paragraphStyle', 'bold', 'italic', 'subscript', '|', 'superscript'],
    //         buttonsVisible: 0
    //     },
    //     moreParagraph: {
    //         buttons: ['listes-sub-menu', 'formatUL', 'formatOL', 'outdent', 'indent', '|'],
    //         buttonsVisible: 0
    //     },
    //     moreRich: {
    //         buttons: ['insertLink', 'specialCharacters', '|'],
    //         buttonsVisible: 0
    //     },
    //     moreMisc: {
    //         buttons: ['fullscreen'],
    //         buttonsVisible: 1,
    //         align: 'right'
    //     }
    // };
    // The list of buttons that appear in the rich text editor's toolbar on extra small devices (< 768px).
    public toolbarButtonsXS: any = {
        moreText: {
            buttons: ['bold', 'italic', 'subscript', 'superscript'],
            buttonsVisible: 0
        },
        moreParagraph: {
            buttons: ['formatUL', 'formatOL', 'outdent', 'indent'],
            buttonsVisible: 0
        },
        moreRich: {
            buttons: ['insertLink', 'specialCharacters'],
            buttonsVisible: 2
        },
        moreMisc: {
            buttons: ['fullscreen'],
            buttonsVisible: 1,
            align: 'right'
        }
    };

    constructor(public key: string, public language: string = 'en_CA') {
        if (!key) {
            throw new Error('In order to use the rich-text-editor you need to provide a valid froala key.');
        }
    }
}
