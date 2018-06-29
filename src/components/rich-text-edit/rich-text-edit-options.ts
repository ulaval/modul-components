import { library } from '@fortawesome/fontawesome';
import faAlignCenter from '@fortawesome/fontawesome-free-solid/faAlignCenter';
import faAlignJustify from '@fortawesome/fontawesome-free-solid/faAlignJustify';
import faAlignLeft from '@fortawesome/fontawesome-free-solid/faAlignLeft';
import faAlignRight from '@fortawesome/fontawesome-free-solid/faAlignRight';
import faBold from '@fortawesome/fontawesome-free-solid/faBold';
import faCompress from '@fortawesome/fontawesome-free-solid/faCompress';
import faEraser from '@fortawesome/fontawesome-free-solid/faEraser';
import faExpand from '@fortawesome/fontawesome-free-solid/faExpand';
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
import faStrikethrough from '@fortawesome/fontawesome-free-solid/faStrikethrough';
import faSubscript from '@fortawesome/fontawesome-free-solid/faSubscript';
import faSuperScript from '@fortawesome/fontawesome-free-solid/faSuperScript';
import faTable from '@fortawesome/fontawesome-free-solid/faTable';
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';
import faUnderline from '@fortawesome/fontawesome-free-solid/faUnderline';
import faUndo from '@fortawesome/fontawesome-free-solid/faUndo';

library.add(faExpand, faCompress, faBold, faItalic, faUnderline, faStrikethrough, faSubscript, faSuperScript, faParagraph, faAlignLeft, faAlignCenter,
    faAlignRight, faAlignJustify, faListOl, faListUl, faOutdent, faIndent, faQuoteLeft, faLink, faSearch, faTable, faTimes, faMousePointer, faEraser,
    faQuestion, faUndo, faRedo);

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
