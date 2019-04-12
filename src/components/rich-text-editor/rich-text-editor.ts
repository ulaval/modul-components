// tslint:disable:deprecation

import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { ElementQueries } from '../../mixins/element-queries/element-queries';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputManagement, InputManagementData } from '../../mixins/input-management/input-management';
import { InputState, InputStateInputSelector } from '../../mixins/input-state/input-state';
import { InputWidth } from '../../mixins/input-width/input-width';
import { MFile } from '../../utils/file/file';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { RICH_TEXT_EDITOR_NAME } from '../component-names';
import FileUploadPlugin from '../file-upload/file-upload';
import InputStylePlugin from '../input-style/input-style';
import ValidationMessagePlugin from '../validation-message/validation-message';
import VueFroala from './adapter/vue-froala';
import { MRichTextEditorDefaultOptions } from './rich-text-editor-options';
import WithRender from './rich-text-editor.html?style=./rich-text-editor.scss';


const RICH_TEXT_LICENSE_KEY: string = 'm-rich-text-license-key';

/**
 * @deprecated use MRichTextEditorOption instead
 */
export enum MRichTextEditorMode {
    STANDARD,
    MEDIA
}

export enum MRichTextEditorOption {
    IMAGE
}

export type MRichTextEditorOptions = MRichTextEditorOption[];

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

    /**
     * @deprecated use options instead
     */
    @Prop({
        default: MRichTextEditorMode.STANDARD,
        validator: value => {
            return value === MRichTextEditorMode.STANDARD
                || value === MRichTextEditorMode.MEDIA;
        }
    })
    public mode: MRichTextEditorMode;

    @Prop({
        default: () => [],
        validator: (options: MRichTextEditorOptions) => {
            return options.filter(option => !MRichTextEditorOption[option]).length === 0;
        }
    })
    public options: MRichTextEditorOptions;

    @Prop({ default: '0' })
    public toolbarStickyOffset: string;

    @Prop()
    public scrollableContainer: string | undefined;

    @Emit('fullscreen')
    onFullscreen(fullscreenWasActived: boolean): void { }

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

        return Object.assign(this.getOptions(), propOptions);
    }

    public get froalaLicenseKey(): string {
        return this.$license.getLicense<string>(RICH_TEXT_LICENSE_KEY) || '';
    }

    public getOptions(): MRichTextEditorDefaultOptions {
        const options: MRichTextEditorDefaultOptions = new MRichTextEditorDefaultOptions(this.froalaLicenseKey, this.$i18n.currentLang());

        if (this.options.includes(MRichTextEditorOption.IMAGE) || this.mode === MRichTextEditorMode.MEDIA) {
            options.pluginsEnabled.push('image');
            options.toolbarButtons.push('insertImage');
        }

        return options;
    }

    public getSelectorErrorMsg(prop: string): string {
        return `${RICH_TEXT_EDITOR_NAME}: No element has been found with the selector given in the ${prop} prop.`;
    }

    protected refreshModel(newValue: string): void {
        this.$emit('input', newValue);
    }

    protected calculateToolbarStickyOffset(): number | undefined {
        if (this.toolbarStickyOffset) {
            if (this.isNumber(this.toolbarStickyOffset)) {
                return Number(this.toolbarStickyOffset);
            } else {
                const element: HTMLElement | null = document.querySelector(this.toolbarStickyOffset);
                return element!.offsetHeight;
            }
        }
    }

    private isNumber(value: string): boolean {
        return /^-*\d+$/.test(this.toolbarStickyOffset);
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

        if (this.toolbarStickyOffset && !this.isNumber(this.toolbarStickyOffset)) {
            if (!document.querySelector(this.toolbarStickyOffset)) {
                propInError = 'toolbar-sticky-offset';
            }
        }

        if (propInError) {
            throw new Error(this.getSelectorErrorMsg(propInError));
        }
    }

    @Emit('image-ready')
    protected imageReady(file: MFile, storeName: string): void {
    }

    @Emit('image-added')
    protected imageAdded(file: MFile, insertImage: (file: MFile, id: string) => void): void {
    }

    @Emit('image-removed')
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
