import { library } from '@fortawesome/fontawesome';
import faArrowLeft from '@fortawesome/fontawesome-free-solid/faArrowLeft';
import faBold from '@fortawesome/fontawesome-free-solid/faBold';
import faCompress from '@fortawesome/fontawesome-free-solid/faCompress';
import faEdit from '@fortawesome/fontawesome-free-solid/faEdit';
import faExpand from '@fortawesome/fontawesome-free-solid/faExpand';
import faExternalLinkAlt from '@fortawesome/fontawesome-free-solid/faExternalLinkAlt';
import faIndent from '@fortawesome/fontawesome-free-solid/faIndent';
import faItalic from '@fortawesome/fontawesome-free-solid/faItalic';
import faLink from '@fortawesome/fontawesome-free-solid/faLink';
import faListOl from '@fortawesome/fontawesome-free-solid/faListOl';
import faListUl from '@fortawesome/fontawesome-free-solid/faListUl';
import faOutdent from '@fortawesome/fontawesome-free-solid/faOutdent';
import faParagraph from '@fortawesome/fontawesome-free-solid/faParagraph';
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus';
import faSubscript from '@fortawesome/fontawesome-free-solid/faSubscript';
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';
import faTrash from '@fortawesome/fontawesome-free-solid/faTrash';
import faUnlink from '@fortawesome/fontawesome-free-solid/faUnlink';

// import faSuperScript from '@fortawesome/fontawesome-free-solid/faSuperScript';
library.add(faExpand, faCompress, faBold, faItalic, faSubscript/*, faSuperScript*/, faParagraph, faListOl, faListUl, faOutdent, faIndent, faLink, faExternalLinkAlt, faEdit, faUnlink, faTrash,
    faTimes, faArrowLeft, faPlus);

export abstract class MRichTextEditorDefaultOptions {
    public immediateVueModelUpdate: boolean = true;
    public iconsTemplate: string = 'font_awesome_5';
    public charCounterCount: boolean = false;
    public tableInsertHelper: boolean = false;
    public lineBreakerTags: string [] = [];
    public zIndex: number = 200;
    public toolbarSticky: boolean = true;
    public scrollableContainer: string = 'body';
    public toolbarStickyOffset: number = 0;
    public wordDeniedTags: string[] = ['img', 'table', 'tr', 'td', 'th'];
    public pluginsEnabled: string[] = ['align', 'draggable', 'embedly', 'entities', 'file', 'fontFamily', 'fontSize', 'fullscreen', 'inlineStyle', 'lineBreaker', 'link', 'lists', 'paragraphFormat', 'paragraphStyle', 'quote', 'save', 'specialCharacters', 'table', 'url', 'wordPaste', 'stylesPlugin', 'listesPlugin', 'insertionsPlugin'];

    constructor(public key: string, public language: string = 'en_CA') {
        if (!key) {
            throw new Error('In order to use the rich-text-editor you need to provide a valid froala key.');
        }
    }
}

export class MRichTextEditorStandardOptions extends MRichTextEditorDefaultOptions {
    public toolbarButtons: string[] = ['bold', 'italic', 'subscript', 'superscript', '|', 'paragraphFormat', 'formatUL',
        'formatOL', 'outdent', 'indent', '|', 'insertLink', 'specialCharacters', '|', 'fullscreen'];
    public toolbarButtonsXS: string[] = ['stylesPopup', 'listesPopup', 'insertionsPopup', 'fullscreen'];

    public linkEditButtons: string[] = ['linkOpen', 'linkEdit', 'linkRemove'];

    public linkInsertButtons: string[] = ['linkBack'];

    constructor(key: string, language?: string | undefined) { super(key, language); }
}
