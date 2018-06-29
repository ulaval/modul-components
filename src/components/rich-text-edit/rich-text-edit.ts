import { library } from '@fortawesome/fontawesome';
import faAlignCenter from '@fortawesome/fontawesome-free-solid/faAlignCenter';
import faAlignJustify from '@fortawesome/fontawesome-free-solid/faAlignJustify';
import faAlignLeft from '@fortawesome/fontawesome-free-solid/faAlignLeft';
import faAlignRight from '@fortawesome/fontawesome-free-solid/faAlignRight';
import faBold from '@fortawesome/fontawesome-free-solid/faBold';
import faCamera from '@fortawesome/fontawesome-free-solid/faCamera';
import faCode from '@fortawesome/fontawesome-free-solid/faCode';
import faCompress from '@fortawesome/fontawesome-free-solid/faCompress';
import faEraser from '@fortawesome/fontawesome-free-solid/faEraser';
import faExpand from '@fortawesome/fontawesome-free-solid/faExpand';
import faFile from '@fortawesome/fontawesome-free-solid/faFile';
import faFolder from '@fortawesome/fontawesome-free-solid/faFolder';
import faFont from '@fortawesome/fontawesome-free-solid/faFont';
import faImage from '@fortawesome/fontawesome-free-solid/faImage';
import faIndent from '@fortawesome/fontawesome-free-solid/faIndent';
import faItalic from '@fortawesome/fontawesome-free-solid/faItalic';
import faLink from '@fortawesome/fontawesome-free-solid/faLink';
import faListOl from '@fortawesome/fontawesome-free-solid/faListOl';
import faListUl from '@fortawesome/fontawesome-free-solid/faListUl';
import faMagic from '@fortawesome/fontawesome-free-solid/faMagic';
import faMinus from '@fortawesome/fontawesome-free-solid/faMinus';
import faMousePointer from '@fortawesome/fontawesome-free-solid/faMousePointer';
import faOutdent from '@fortawesome/fontawesome-free-solid/faOutdent';
import faPaintBrush from '@fortawesome/fontawesome-free-solid/faPaintBrush';
import faParagraph from '@fortawesome/fontawesome-free-solid/faParagraph';
import faPrint from '@fortawesome/fontawesome-free-solid/faPrint';
import faQuestion from '@fortawesome/fontawesome-free-solid/faQuestion';
import faQuoteLeft from '@fortawesome/fontawesome-free-solid/faQuoteLeft';
import faRedo from '@fortawesome/fontawesome-free-solid/faRedo';
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';
import faSmile from '@fortawesome/fontawesome-free-solid/faSmile';
import faStrikethrough from '@fortawesome/fontawesome-free-solid/faStrikethrough';
import faSubscript from '@fortawesome/fontawesome-free-solid/faSubscript';
import faSuperScript from '@fortawesome/fontawesome-free-solid/faSuperScript';
import faTable from '@fortawesome/fontawesome-free-solid/faTable';
import faTextHeight from '@fortawesome/fontawesome-free-solid/faTextHeight';
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';
import faTint from '@fortawesome/fontawesome-free-solid/faTint';
import faUnderline from '@fortawesome/fontawesome-free-solid/faUnderline';
import faUndo from '@fortawesome/fontawesome-free-solid/faUndo';
import faUpload from '@fortawesome/fontawesome-free-solid/faUpload';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { froalaEditorFunctionality } from './adapter/vue-froala';
import WithRender from './rich-text-edit.html';

[faExpand, faCompress, faBold, faItalic, faUnderline, faStrikethrough, faSubscript, faSuperScript, faFont, faTextHeight,
    faTint, faPaintBrush, faMagic, faParagraph, faAlignLeft, faAlignCenter, faAlignRight, faAlignJustify, faListOl, faListUl, faOutdent, faIndent,
    faQuoteLeft, faLink, faSearch, faImage, faUpload, faFolder, faCamera, faFile, faTable, faSmile, faTimes, faMinus, faMousePointer, faEraser,
    faPrint, faQuestion, faCode, faUndo, faRedo
].forEach(icon => library.add(icon));

require('froala-editor/js/froala_editor.pkgd.min');
require('froala-editor/css/froala_editor.pkgd.min.css');
require('froala-editor/js/languages/fr.js');

class MRichTextEditorDefaultOptions {
    public immediateVueModelUpdate: boolean = true;
    public iconsTemplate: string = 'font_awesome_5';

    constructor(public key: string, public language: string = 'en_CA') {
        if (!key) {
            throw new Error('In order to use the rich-text-editor you need to provide a valid froala key.');
        }
    }
}

export class MRichTextEditorOptions {}

const RICH_TEXT_LICENSE_KEY: string = 'm-rich-text-license-key';

@WithRender
@Component({
    components: { Froala: froalaEditorFunctionality }
})
export class MRichTextEdit extends ModulVue {
    public tag: string = 'textarea';
    @Prop({ default: '' })
    public value: string;
    @Prop({ default: true })
    public readOnly: boolean;
    @Prop()
    public options: MRichTextEditorOptions | undefined;

    protected get internalOptions(): any {
        return Object.assign(new MRichTextEditorDefaultOptions(this.froalaLicenseKey, this.$i18n.currentLang()), this.options);
    }

    protected get froalaLicenseKey(): string {
        return this.$license.getLicense<string>(RICH_TEXT_LICENSE_KEY) || '';
    }

    protected refreshModel(newValue: string): void {
        this.$emit('input', newValue);
    }
}

export default MRichTextEdit;
