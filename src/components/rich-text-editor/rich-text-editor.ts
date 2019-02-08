import { MFile } from 'src/utils/file/file';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { ElementQueries } from '../../mixins/element-queries/element-queries';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputManagement, InputManagementData } from '../../mixins/input-management/input-management';
import { InputState, InputStateInputSelector } from '../../mixins/input-state/input-state';
import { InputWidth } from '../../mixins/input-width/input-width';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { RICH_TEXT_EDITOR_NAME } from '../component-names';
import FileUploadPlugin from '../file-upload/file-upload';
import InputStylePlugin from '../input-style/input-style';
import ValidationMessagePlugin from '../validation-message/validation-message';
import VueFroala from './adapter/vue-froala';
import { MRichTextEditorDefaultOptions, MRichTextEditorMediaOptions, MRichTextEditorStandardOptions } from './rich-text-editor-options';
import WithRender from './rich-text-editor.html?style=./rich-text-editor.scss';


const RICH_TEXT_LICENSE_KEY: string = 'm-rich-text-license-key';

export enum MRichTextEditorMode {
    STANDARD,
    MEDIA
}

@WithRender
@Component({
    components: { Froala: VueFroala },
    mixins: [
        InputState,
        InputManagement,
        InputWidth,
        InputLabel,
        ElementQueries
    ]
})
export class MRichTextEditor extends ModulVue implements InputManagementData, InputStateInputSelector {

    selector: string = '.fr-element.fr-view';
    internalValue: string;

    @Prop({ default: '' })
    public value: string;

    @Prop({
        default: MRichTextEditorMode.STANDARD,
        validator: value => {
            return value === MRichTextEditorMode.STANDARD
                || value === MRichTextEditorMode.MEDIA;
        }
    })
    public mode: MRichTextEditorMode;

    @Prop({ default: '0' })
    public toolbarStickyOffset: string;

    @Prop()
    public scrollableContainer: string | undefined;

    public customTranslations: { [key: string]: string } = {
        'Update': this.$i18n.translate('m-inplace-edit:modify'),
        'URL': this.$i18n.translate('m-rich-text-editor:URL')
    };

    protected id: string = `mrich-text-${uuid.generate()}`;

    mounted(): void {
        this.testSelectorProps();
    }

    public get internalOptions(): any {
        const propOptions: any = {
            // Hack to "hide" the default froala placeholder text
            placeholderText: this.as<InputManagement>().placeholder || ' ',
            toolbarStickyOffset: this.calculateToolbarStickyOffset(),
            scrollableContainer: this.getScrollableContainer()
        };

        return Object.assign(this.getDefaultOptions(), propOptions);
    }

    public get froalaLicenseKey(): string {
        return this.$license.getLicense<string>(RICH_TEXT_LICENSE_KEY) || '';
    }

    public getDefaultOptions(): MRichTextEditorDefaultOptions {
        if (this.mode === MRichTextEditorMode.STANDARD) {
            return new MRichTextEditorStandardOptions(this.froalaLicenseKey, this.$i18n.currentLang());
        } else if (this.mode === MRichTextEditorMode.MEDIA) {
            return new MRichTextEditorMediaOptions(this.froalaLicenseKey, this.$i18n.currentLang());
        }

        throw new Error(`rich-text-edit: mode ${this.mode} is not a valid mode.  See MRichTextEditMode Enum for a list of compatible modes.`);
    }

    public getSelectorErrorMsg(prop: string): string {
        return `${RICH_TEXT_EDITOR_NAME}: No element has been found with the selector given in the ${prop} prop.`;
    }

    protected refreshModel(newValue: string): void {
        this.$emit('input', newValue);
    }

    protected calculateToolbarStickyOffset(): number | undefined {
        if (this.toolbarStickyOffset) {
            if (/^\d+$/.test(this.toolbarStickyOffset)) {
                return Number(this.toolbarStickyOffset);
            } else {
                const element: HTMLElement | null = document.querySelector(this.toolbarStickyOffset);
                return element!.offsetHeight;
            }
        }
    }

    protected getScrollableContainer(): string | undefined {
        if (this.scrollableContainer) {
            return this.scrollableContainer;
        }
    }

    protected testSelectorProps(): void {
        let propInError: string | undefined;
        if (this.scrollableContainer) {
            if (!document.querySelector(this.scrollableContainer)) {
                propInError = 'scrollable-container';
            }
        }

        if (this.toolbarStickyOffset && !/^\d+$/.test(this.toolbarStickyOffset)) {
            if (!document.querySelector(this.toolbarStickyOffset)) {
                propInError = 'toolbar-sticky-offset';
            }
        }

        if (propInError) {
            console.error(this.getSelectorErrorMsg(propInError));
            throw new Error(this.getSelectorErrorMsg(propInError));
        }
    }

    @Emit('imageReady')
    protected imageReady(file: MFile, storeName: string): void {
    }

    @Emit('imageAdded')
    protected imageAdded(file: MFile, insertImage: (file: MFile, id: string) => void): void {
    }

    @Emit('imageRemoved')
    protected imageRemoved(id: string, storeName: string): void {
    }
}

const RichTextEditorPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(FileUploadPlugin);
        v.use(InputStylePlugin);
        v.use(ValidationMessagePlugin);
        v.component(RICH_TEXT_EDITOR_NAME, MRichTextEditor);
    }
};

export default RichTextEditorPlugin;
