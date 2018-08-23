import { library } from '@fortawesome/fontawesome';
import faAngleLeft from '@fortawesome/fontawesome-free-solid/faAngleLeft';
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
import faSuperscript from '@fortawesome/fontawesome-free-solid/faSuperscript';
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';
import faTrash from '@fortawesome/fontawesome-free-solid/faTrash';
import faUnlink from '@fortawesome/fontawesome-free-solid/faUnlink';

library.add(faExpand, faCompress, faBold, faItalic, faSubscript, faSuperscript, faParagraph, faListOl, faListUl, faOutdent, faIndent, faLink, faExternalLinkAlt, faEdit, faUnlink, faTrash,
    faTimes, faArrowLeft, faPlus, faAngleLeft);

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
