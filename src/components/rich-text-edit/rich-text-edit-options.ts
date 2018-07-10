import { library } from '@fortawesome/fontawesome';
import faAlignCenter from '@fortawesome/fontawesome-free-solid/faAlignCenter';
import faAlignJustify from '@fortawesome/fontawesome-free-solid/faAlignJustify';
import faAlignLeft from '@fortawesome/fontawesome-free-solid/faAlignLeft';
import faAlignRight from '@fortawesome/fontawesome-free-solid/faAlignRight';
import faArrowsAltV from '@fortawesome/fontawesome-free-solid/faArrowsAltV';
import faBars from '@fortawesome/fontawesome-free-solid/faBars';
import faBold from '@fortawesome/fontawesome-free-solid/faBold';
import faCompress from '@fortawesome/fontawesome-free-solid/faCompress';
import faEdit from '@fortawesome/fontawesome-free-solid/faEdit';
import faEraser from '@fortawesome/fontawesome-free-solid/faEraser';
import faExpand from '@fortawesome/fontawesome-free-solid/faExpand';
import faExternalLinkAlt from '@fortawesome/fontawesome-free-solid/faExternalLinkAlt';
import faHeading from '@fortawesome/fontawesome-free-solid/faHeading';
import faIndent from '@fortawesome/fontawesome-free-solid/faIndent';
import faItalic from '@fortawesome/fontawesome-free-solid/faItalic';
import faLink from '@fortawesome/fontawesome-free-solid/faLink';
import faListOl from '@fortawesome/fontawesome-free-solid/faListOl';
import faListUl from '@fortawesome/fontawesome-free-solid/faListUl';
import faMousePointer from '@fortawesome/fontawesome-free-solid/faMousePointer';
import faOutdent from '@fortawesome/fontawesome-free-solid/faOutdent';
import faParagraph from '@fortawesome/fontawesome-free-solid/faParagraph';
import faQuestion from '@fortawesome/fontawesome-free-solid/faQuestion';
import faQuoteLeft from '@fortawesome/fontawesome-free-solid/faQuoteLeft';
import faRedo from '@fortawesome/fontawesome-free-solid/faRedo';
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';
import faSquare from '@fortawesome/fontawesome-free-solid/faSquare';
import faStrikethrough from '@fortawesome/fontawesome-free-solid/faStrikethrough';
import faSubscript from '@fortawesome/fontawesome-free-solid/faSubscript';
import faSuperScript from '@fortawesome/fontawesome-free-solid/faSuperScript';
import faTable from '@fortawesome/fontawesome-free-solid/faTable';
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';
import faTrash from '@fortawesome/fontawesome-free-solid/faTrash';
import faUnderline from '@fortawesome/fontawesome-free-solid/faUnderline';
import faUndo from '@fortawesome/fontawesome-free-solid/faUndo';
import faUnlink from '@fortawesome/fontawesome-free-solid/faUnlink';

library.add(faExpand, faCompress, faBold, faItalic, faUnderline, faStrikethrough, faSubscript, faSuperScript, faParagraph, faAlignLeft, faAlignCenter,
    faAlignRight, faAlignJustify, faListOl, faListUl, faOutdent, faIndent, faQuoteLeft, faLink, faExternalLinkAlt, faEdit, faUnlink, faSearch, faTable, faHeading, faTrash, faBars,
    faSquare, faArrowsAltV, faTimes, faMousePointer, faEraser, faQuestion, faUndo, faRedo);

export abstract class MRichTextEditorDefaultOptions {
    public immediateVueModelUpdate: boolean = true;
    public iconsTemplate: string = 'font_awesome_5';
    public charCounterCount: boolean = false;
    public tableInsertHelper: boolean = false;
    public lineBreakerTags: string [] = [];
    public zIndex: number = 200;
    public toolbarSticky: boolean = true;
    public toolbarStickyOffset: number = 0;

    constructor(public key: string, public language: string = 'en_CA') {
        if (!key) {
            throw new Error('In order to use the rich-text-editor you need to provide a valid froala key.');
        }
    }
}

export class MRichTextEditorStandardOptions extends MRichTextEditorDefaultOptions {
    public toolbarButtons: string[] = ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'paragraphFormat', 'align', 'formatOL',
        'formatUL', 'outdent', 'indent', 'quote', '|', 'insertLink', 'insertTable', '|', 'specialCharacters', 'selectAll', 'clearFormatting', '|',
        'help', '|', 'undo', 'redo' ];

    public tableEditButtons: string[] = ['tableHeader', 'tableRemove', '|', 'tableRows', 'tableColumns', '|', 'tableCells',
        'tableCellVerticalAlign', 'tableCellHorizontalAlign'];

    public linkEditButtons: string[] = ['linkOpen', 'linkEdit', 'linkRemove'];

    constructor(key: string, language?: string | undefined) { super(key, language); }
}
