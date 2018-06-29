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
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { froalaEditorFunctionality } from './adapter/vue-froala';
import { MRichTextEditorDefaultOptions, MRichTextEditorStandardOptions } from './rich-text-edit-options';
import WithRender from './rich-text-edit.html';

library.add(faExpand, faCompress, faBold, faItalic, faUnderline, faStrikethrough, faSubscript, faSuperScript, faParagraph, faAlignLeft, faAlignCenter,
    faAlignRight, faAlignJustify, faListOl, faListUl, faOutdent, faIndent, faQuoteLeft, faLink, faSearch, faTable, faTimes, faMousePointer, faEraser,
    faQuestion, faUndo, faRedo);

require('froala-editor/js/froala_editor.pkgd.min');
require('froala-editor/css/froala_editor.pkgd.min.css');
require('froala-editor/js/languages/fr.js');

export class MRichTextEditorOptions {}

const RICH_TEXT_LICENSE_KEY: string = 'm-rich-text-license-key';

export enum MRichTextEditMode {
    STANDARD
}

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
    @Prop({
        default: MRichTextEditMode.STANDARD,
        validator: value => value === MRichTextEditMode.STANDARD
    })
    public mode: MRichTextEditMode;

    protected get internalOptions(): any {
        return Object.assign(this.getDefaultOptions(), this.options);
    }

    protected get froalaLicenseKey(): string {
        return this.$license.getLicense<string>(RICH_TEXT_LICENSE_KEY) || '';
    }

    protected refreshModel(newValue: string): void {
        this.$emit('input', newValue);
    }

    protected getDefaultOptions(): MRichTextEditorDefaultOptions {
        return new MRichTextEditorStandardOptions(this.froalaLicenseKey, this.$i18n.currentLang());
    }
}

export default MRichTextEdit;
