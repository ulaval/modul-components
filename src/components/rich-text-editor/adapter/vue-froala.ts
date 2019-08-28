// This code is largery borrowed from https://github.com/froala/vue-froala-wysiwyg.
// However some changes have been made to "inputify" the froala editor and render is compatible with modUL input-style.
import FroalaEditor from 'froala-editor';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import $ from 'jquery';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import boldIcon from '../../../assets/icons/svg/Froala-bold.svg';
import imageAlignCenterIcon from '../../../assets/icons/svg/Froala-image-align-center.svg';
import imageAlignLeftIcon from '../../../assets/icons/svg/Froala-image-align-left.svg';
import imageAlignRightIcon from '../../../assets/icons/svg/Froala-image-align-right.svg';
import listsIcon from '../../../assets/icons/svg/Froala-lists.svg';
import replaceIcon from '../../../assets/icons/svg/Froala-replace.svg';
import stylesIcon from '../../../assets/icons/svg/Froala-styles.svg';
import titleIcon from '../../../assets/icons/svg/Froala-title.svg';
import { ElementQueries } from '../../../mixins/element-queries/element-queries';
import { replaceTags } from '../../../utils/clean/htmlClean';
import { MFile } from '../../../utils/file/file';
import { ScrollToDuration } from '../../../utils/scroll-to/scroll-to';
import uuid from '../../../utils/uuid/uuid';
import { ModulVue } from '../../../utils/vue/vue';
import WithRender from './vue-froala.html?style=./vue-froala.scss';
require('froala-editor/js/languages/fr.js');
// Bug placeholder in the version 3.0.5.
// Bug watch The button "Special Characters" isn't work in mobile  https://github.com/froala/angular-froala-wysiwyg/issues/317
// Bug watch "JQuery dependence isn't fully removed from Froala" https://github.com/froala/angular-froala-wysiwyg/issues/324

enum froalaEvents {
    Blur = 'blur',
    Click = 'click',
    CommandAfter = 'commands.after',
    CommandBefore = 'commands.before',
    ContentChanged = 'contentChanged',
    Focus = 'focus',
    ImageInserted = 'image.inserted',
    ImageRemoved = 'image.removed',
    Initialized = 'initialized',
    InitializationDelayed = 'initializationDelayed',
    KeyDown = 'keydown',
    KeyUp = 'keyup',
    PasteAfter = 'paste.after',
    PasteAfterCleanup = 'paste.afterCleanup',
    ShowLinkInsert = 'popups.show.link.insert'
}

enum FroalaElements {
    TOOLBAR = '.fr-toolbar'
}

enum FroalaBreakingPoint {
    minDefault = 545,
    minOneMode = 565
}

export enum FroalaStatus {
    Blurring = 'blurring',
    Blurred = 'blurred',
    Focused = 'focused'
}

export enum FroalaToolbarButtons {
    moreTextVisible = 6,
    moreTextVisibleXS = 0,
    moreParagraphVisible = 4,
    moreParagraphVisibleXS = 0,
    moreRichVisible = 3,
    moreRichVisibleXS = 3,
    moreMiscVisible = 1,
    moreMiscVisibleXS = 1
}

const ENTER_KEYCODE: number = 13;

@WithRender
@Component({
    mixins: [
        ElementQueries
    ],
    components: {
        FroalaEditor
    }
}) export class VueFroala extends ModulVue {
    @Prop({
        default: 'div'
    })
    public tag: 'div' | 'textarea';

    @Prop({ default: '' })
    public value: string;

    @Prop({ default: false })
    public disabled: boolean;

    @Prop({ default: false })
    public readonly: boolean;

    @Prop()
    public config: any;

    @Prop()
    public customTranslations: { [key: string]: string };

    @Emit('fullscreen')
    onFullscreen(fullscreenWasActived: boolean): void { }

    protected internalValue: string = '';
    protected currentTag: string = 'div';
    protected listeningEvents: Event[] = [];
    protected froalaEditor: any = undefined;
    protected currentConfig: any = undefined;
    protected defaultConfig: any = {
        immediateVueModelUpdate: false,
        vueIgnoreAttrs: undefined
    };
    protected initEvents: any[] = [];

    protected isFocused: boolean = false;
    protected isInitialized: boolean = false;
    protected isLoaded: boolean = false;
    protected froalaClientWidth: number = 0;

    protected isDirty: boolean = false;
    protected status: FroalaStatus = FroalaStatus.Blurred;

    protected isFileUploadOpen: boolean = false;
    protected fileUploadStoreName: string = uuid.generate();
    protected selectedImage: HTMLElement | undefined;
    protected allowedExtensions: string[] = [];

    private imageExtensions: string[] = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'bmp'];
    private mousedownTriggered: boolean = false;
    private mousedownInsideEditor: boolean = false;

    @Watch('value')
    public refreshValue(): void {
        this.htmlSet();
    }

    protected setClientWidth(): void {
        this.froalaClientWidth = (this.$el as HTMLElement).clientWidth;
    }

    public get isEmpty(): boolean {
        return this.value.length === 0;
    }

    protected addCustomIcons(): void {
        FroalaEditor.DefineIconTemplate('custom-icons', '[SVG]');

        if (this.$i18n.currentLang() === 'fr') {
            FroalaEditor.DefineIcon('bold', { SVG: (boldIcon as string), template: 'custom-icons' });
        }

        if (this.config && this.config.pluginsEnabled.includes('image')) {
            this.addImageButton();
        }

        FroalaEditor.DefineIcon('paragraphStyle', { SVG: (titleIcon as string), template: 'custom-icons' });
        FroalaEditor.DefineIcon('moreText', { SVG: (stylesIcon as string), template: 'custom-icons' });
        FroalaEditor.DefineIcon('moreParagraph', { SVG: (listsIcon as string), template: 'custom-icons' });
    }

    protected addImageButton(): void {
        FroalaEditor.RegisterCommand('insertImage', {
            title: this.$i18n.translate('m-rich-text-editor:insert-image'),
            undo: true,
            focus: true,
            showOnMobile: true,
            refreshAfterCallback: false,
            callback: function(): void {
                let vueFroala: VueFroala = this.$oel[0].parentNode.__vue__;
                vueFroala.allowedExtensions = this.imageExtensions;
                vueFroala.isFileUploadOpen = true;
                vueFroala.selectedImage = undefined;
            }
        });

        FroalaEditor.DefineIcon('imageReplace', { SVG: (replaceIcon as string), template: 'custom-icons' });
        FroalaEditor.RegisterCommand('imageReplace', {
            title: this.$i18n.translate('m-rich-text-editor:replace-image'),
            undo: true,
            focus: true,
            showOnMobile: true,
            callback: function(): void {
                let vueFroala: VueFroala = this.$oel[0].parentNode.__vue__;
                vueFroala.allowedExtensions = this.imageExtensions;
                vueFroala.isFileUploadOpen = true;
            },
            refresh: function(): void {
                let vueFroala: VueFroala = this.$oel[0].parentNode.__vue__;
                let selectedElement: HTMLElement = vueFroala.froalaEditor.selection.element();
                if (selectedElement.tagName === 'IMG') {
                    vueFroala.selectedImage = selectedElement;
                }
            }
        });

        FroalaEditor.DefineIcon('image-align-center', { SVG: (imageAlignCenterIcon as string), template: 'custom-icons' });
        FroalaEditor.DefineIcon('image-align-left', { SVG: (imageAlignLeftIcon as string), template: 'custom-icons' });
        FroalaEditor.DefineIcon('image-align-right', { SVG: (imageAlignRightIcon as string), template: 'custom-icons' });
    }

    protected filesReady(files: MFile[]): void {
        this.$emit('image-ready', files[0], this.fileUploadStoreName);
    }

    protected onCloseFileUpload(): void {
        this.froalaEditor.events.focus();
    }

    protected filesAdded(files: MFile[]): void {
        this.froalaEditor.opts.modulImageUploaded = true;
        this.$emit('image-added', files[0], (file: MFile, id: string) => {
            if (this.selectedImage) {
                // Bug watch "JQuery dependence isn't fully removed from Froala" https://github.com/froala/angular-froala-wysiwyg/issues/324
                this.froalaEditor.image.insert(file.url, false, { id }, $(this.selectedImage)); // We need jquery for that function
            } else {
                this.froalaEditor.image.insert(file.url, false, { id });
            }
        });
    }

    protected created(): void {
        document.addEventListener('mousedown', this.mousedownListener);
        document.addEventListener('mouseup', this.mouseupListener, true);
        this.currentTag = this.tag || this.currentTag;
    }

    protected mousedownListener(event: MouseEvent): void {
        this.mousedownTriggered = true;
        if (this.$el.contains(event.target as HTMLElement) || document.body.querySelector('.fr-modal.fr-active')) {
            this.mousedownInsideEditor = true;
        } else {
            this.mousedownInsideEditor = false;
        }
    }

    protected mouseupListener(event: MouseEvent): void {
        if (!this.mousedownInsideEditor && !this.$el.contains(event.target as HTMLElement) && this.isFocused
            && !this.isFileUploadOpen && !document.body.querySelector('.fr-image-resizer.fr-active')) {
            this.mousedownTriggered = false;
            this.closeEditor();
        }
    }

    protected mounted(): void {
        if (FroalaEditor !== undefined && this.config !== undefined) {
            if (FroalaEditor.LANGUAGE[this.config.language] !== undefined && this.customTranslations !== undefined) {
                Object.assign(FroalaEditor.LANGUAGE[this.config.language].translation, this.customTranslations);
            }

            this.createEditor();
        }
    }

    protected destroyed(): void {
        window.removeEventListener('resize', this.onResize);
        document.removeEventListener('mousedown', this.mousedownListener);
        document.removeEventListener('mouseup', this.mouseupListener);
    }

    protected beforeDestroy(): void {
        this.destroyEditor();
    }

    protected get collapsed(): boolean {
        return !this.isFocused && this.isEmpty;
    }

    protected onResize(): void {
        this.setClientWidth();
        if (!this.isFocused) {
            this.adjusteToolbarPosition();
        }
    }


    private createEditor(): void {
        if (this.isInitialized) {
            return;
        }

        this.setClientWidth();
        this.setFroalaToolbarDesktop();
        this.addCustomIcons();

        this.currentConfig = Object.assign(this.config || this.defaultConfig, {
            // we reemit each valid input events so froala can work in input-style component.
            events: {
                [froalaEvents.InitializationDelayed]: () => {
                    this.isLoaded = true;
                    this.setReadOnly();
                    this.htmlSet();
                    window.addEventListener('resize', this.onResize);
                },
                [froalaEvents.ContentChanged]: () => {
                    this.updateModel();
                },
                [froalaEvents.Focus]: () => {
                    this.activateRichText();
                },
                [froalaEvents.Blur]: () => {
                    if (!this.mousedownTriggered && !this.isFileUploadOpen) {
                        this.closeEditor();
                    }
                },
                [froalaEvents.KeyUp]: (key: any) => {
                    if (this.currentConfig.immediateVueModelUpdate) {
                        this.updateModel();
                    }
                    this.$emit('keyup');
                },
                [froalaEvents.KeyDown]: (key: any) => {
                    this.$emit('keydown');
                    this.isDirty = true;
                    if (key.keyCode === ENTER_KEYCODE) {
                        this.froalaEditor.paragraphStyle.apply('');
                    }
                },
                [froalaEvents.PasteAfter]: () => {
                    this.$emit('paste');
                },
                // if we use pasteBeforeCleanup, there's an error in froala's code
                [froalaEvents.PasteAfterCleanup]: (data: string) => {
                    if (data.replace) {
                        data = replaceTags(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'], 'p', data);
                        return this.froalaEditor.clean.html(data, ['table', 'video', 'u', 's', 'blockquote', 'button', 'input', 'img']);
                    }
                },
                [froalaEvents.CommandBefore]: (cmd: any, param1: any, param2: any) => {
                    if (cmd === 'fullscreen') {
                        let fullscreenWasActivated: boolean = !this.froalaEditor.fullscreen.isActive();
                        if (fullscreenWasActivated) {
                            this.froalaEditor.toolbar.hide();
                        } else {
                            this.$scrollTo.goTo(this.$el as HTMLElement, -50, ScrollToDuration.Instant); // Hot fix for bug
                        }
                        this.onFullscreen(fullscreenWasActivated);
                    }
                },
                [froalaEvents.CommandAfter]: (cmd: any, param1: any, param2: any) => {
                    if (cmd === 'fullscreen') {
                        if (this.froalaEditor.fullscreen.isActive()) {
                            this.froalaEditor.toolbar.show();
                        } else {
                            this.$scrollTo.goTo(this.$el as HTMLElement, -50, ScrollToDuration.Instant);
                            this.froalaEditor.events.focus();
                        }
                    }
                },
                [froalaEvents.ShowLinkInsert]: () => {
                    this.manageLinkInsert();
                },
                [froalaEvents.ImageRemoved]: ($img) => {
                    this.$emit('image-removed', $img[0].dataset.id, this.fileUploadStoreName);
                    this.updateModel();
                },
                [froalaEvents.ImageInserted]: ($img) => {
                    if (this.froalaEditor.opts.modulImageUploaded) {
                        $img[0].alt = '';
                        this.updateModel();
                    } else {
                        setTimeout(() => {
                            this.froalaEditor.image.remove($img);
                        });
                    }

                    this.froalaEditor.opts.modulImageUploaded = false;
                }
            }
        });

        this.froalaEditor = new FroalaEditor(this.$refs.editor, this.currentConfig, () => {
            this.isInitialized = true;

            this.setDisabled();
            this.manageInitialFocus();
        });
    }

    private setFroalaToolbarDesktop(): void {
        if (this.froalaClientWidth < 550) {
            // toolbar for desktop devices with RTE Width with less then 550 px
            this.config.toolbarButtons.moreText.buttonsVisible = FroalaToolbarButtons.moreTextVisibleXS;
            this.config.toolbarButtons.moreParagraph.buttonsVisible = FroalaToolbarButtons.moreParagraphVisibleXS;
            this.config.toolbarButtons.moreRich.buttonsVisible = FroalaToolbarButtons.moreRichVisibleXS;
            this.config.toolbarButtons.moreMisc.buttonsVisible = FroalaToolbarButtons.moreMiscVisibleXS;
        } else {
            // toolbar for desktop devices with RTE Width with or more then 550 px
            this.config.toolbarButtons.moreText.buttonsVisible = FroalaToolbarButtons.moreTextVisible;
            this.config.toolbarButtons.moreParagraph.buttonsVisible = FroalaToolbarButtons.moreParagraphVisible;
            this.config.toolbarButtons.moreRich.buttonsVisible = FroalaToolbarButtons.moreRichVisible;
            this.config.toolbarButtons.moreMisc.buttonsVisible = FroalaToolbarButtons.moreMiscVisible;
        }
    }

    private closeEditor(): void {
        this.status = FroalaStatus.Blurring;
        window.addEventListener('resize', this.onResize);
        this.$emit('blur');
        this.hideToolbar();

        this.isFocused = false;
        this.status = FroalaStatus.Blurred;

        this.isDirty = false;
        this.internalReadonly = false;
        this.isDisabled = this.disabled;
    }

    @Watch('disabled')
    private setDisabled(): void {
        // We have to delay the initialization of disabled until the rich text is initialized.
        // It will remain glitchy otherwise when combined with init on click.
        // See comment https://github.com/froala/angular-froala-wysiwyg/issues/75#issuecomment-310709095
        if (this.isInitialized) {
            this.isDisabled = this.disabled;
        }
    }

    private get isDisabled(): boolean {
        return this.disabled;
    }

    private set isDisabled(value: boolean) {
        if (value) {
            this.froalaEditor.edit.off();
        } else {
            this.froalaEditor.edit.on();
        }
    }

    @Watch('readonly')
    private setReadOnly(): void {
        this.internalReadonly = this.readonly;
    }

    private simulateReadonlyBlur(event: Event): void {
        if (!this.$el.contains(event.target as Node)) {
            if (this.isFocused) {
                this.froalaEditor.edit.on();
                this.froalaEditor.events.trigger('blur');
            }
            document.removeEventListener('mousedown', this.simulateReadonlyBlur, true);
        }
    }

    private get internalReadonly(): boolean {
        return this.readonly;
    }

    private set internalReadonly(value: boolean) {
        if (!this.froalaEditor) { return; }

        document.removeEventListener('mousedown', this.simulateReadonlyBlur, true);
        if (value) {
            if (this.isFocused) {
                this.hideToolbar();
                document.addEventListener('mousedown', this.simulateReadonlyBlur, true);
                this.froalaEditor.edit.off();
            }
        } else {
            this.froalaEditor.edit.on();
        }
    }

    private editorIsAvailable(): boolean {
        return this.froalaEditor !== undefined && this.froalaEditor !== null && this.isInitialized;
    }

    private manageInitialFocus(): void {
        // the editor might or might not be focused when initializing.  If it is focused, we have to emit the focus event.  Otherwise, we have to hide the toolbar.
        if (!this.froalaEditor.core.hasFocus()) {
            this.hideToolbar();
        } else {
            this.$emit('focus');
        }
    }

    private manageLinkInsert(): void {
        const popup: HTMLElement = this.froalaEditor.popups.get('link.insert')[0];
        const urlField: HTMLInputElement = popup.querySelector(`[name="href"]`) as HTMLInputElement;

        if (!urlField.value) {
            (popup.querySelector(`[name="target"]`) as HTMLInputElement).checked = true;
        }
    }

    private hideToolbar(): void {
        if (this.editorIsAvailable()) {
            this.froalaEditor.toolbar.hide();
            this.adjusteToolbarPosition();
        }
    }

    private showToolbar(): void {
        const toolBar: HTMLElement = this.$el.querySelector(FroalaElements.TOOLBAR) as HTMLElement;
        if (this.editorIsAvailable() && !this.internalReadonly && toolBar) {
            this.froalaEditor.toolbar.show();
            toolBar.style.removeProperty('margin-top');
        }
    }

    private adjusteToolbarPosition(): void {
        const toolBar: HTMLElement = this.$el.querySelector(FroalaElements.TOOLBAR) as HTMLElement;
        if (toolBar) {
            toolBar.style.marginTop = `-${toolBar.offsetHeight}px`;
        }
    }

    private destroyEditor(): void {
        this.isLoaded = false;
        this.isInitialized = false;
        this.isFocused = false;
        if (this.froalaEditor) {
            this.froalaEditor.destroy();
        }
        this.listeningEvents.length = 0;
        this.froalaEditor = undefined;
        this.internalReadonly = false;
    }

    private activateRichText(): void {
        if (!this.disabled) {
            window.removeEventListener('resize', this.onResize);

            if (this.isInitialized) { this.$emit('focus'); }
            this.showToolbar();
            this.isFocused = true;
            this.status = FroalaStatus.Focused;
            this.internalReadonly = this.readonly;
        }
    }

    private updateModel(): void {
        const returnedHtml: any = this.froalaEditor.html.get();
        if (this.internalValue === returnedHtml) { return; }

        const modelContent: string = this.removeEmptyHTML(returnedHtml);
        this.internalValue = returnedHtml;
        this.$emit('input', modelContent);
    }

    private removeEmptyHTML(value: string): string {
        const div: HTMLElement = document.createElement('div');
        div.innerHTML = value;
        if ((div.textContent || div.innerText || '').trim().length > 0) {
            return value;
        } else if (value.includes('<img')) {
            return value;
        }
        return '';
    }

    private htmlSet(): void {
        if (this.internalValue === this.value || !this.isLoaded) { return; }

        if (this.froalaEditor) {
            this.internalValue = this.value;
            this.froalaEditor.html.set(this.value || '', true);
            if (this.froalaEditor.undo) {
                // This will reset the undo stack everytime the model changes externally. Can we fix this?
                this.froalaEditor.undo.reset();
                this.froalaEditor.undo.saveStep();
            }
        }
    }
}

export default VueFroala;
