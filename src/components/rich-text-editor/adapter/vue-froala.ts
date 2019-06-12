// This code is largery borrowed from https://github.com/froala/vue-froala-wysiwyg.
// However some changes have been made to "inputify" the froala editor and render is compatible with modUL input-style.
// require('froala-editor/js/froala_editor.min');
// require('froala-editor/css/froala_editor.pkgd.min.css');
import FroalaEditor from 'froala-editor';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/js/languages/fr.js';
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
import { PopupPlugin } from './popup-plugin';
import WithRender from './vue-froala.html?style=./vue-froala.scss';


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

    protected get isDesktop(): boolean {
        if (this.config && this.config.pluginsEnabled.includes('image')) {
            return this.froalaClientWidth >= FroalaBreakingPoint.minOneMode;
        }
        return this.froalaClientWidth >= FroalaBreakingPoint.minDefault;
    }

    public get isEmpty(): boolean {
        return this.value.length === 0;
    }

    // watch "Clicking on full screen throws exception if toolbar is customized" in https://github.com/froala/wysiwyg-editor/issues/3483
    // watch "Links should not be disabled when editor is disabled" https://github.com/froala/wysiwyg-editor/issues/3457

    protected addPopup(name: string, icon: string, buttonList: string[]): void {
        const buttonName: string = `${name}Popup`;
        const pluginName: string = `${name}Plugin`;

        FroalaEditor.POPUP_TEMPLATES[`${pluginName}.popup`] = '[_BUTTONS_]';

        // The custom popup is defined inside a plugin (new or existing).
        FroalaEditor.PLUGINS[pluginName] = (editor: any) => { return new PopupPlugin(name, editor, buttonList); };

        // Create the button that'll open the popup
        FroalaEditor.RegisterCommand(buttonName, {
            title: name,
            icon: icon,
            undo: false,
            focus: false,
            plugin: pluginName,
            callback: function(): void {
                this[pluginName].showPopup();
            }
        });
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
        // fix me
        global.console.log('RTE IMAGE addImageButton!');
        FroalaEditor.RegisterCommand('insertImage', {
            title: this.$i18n.translate('m-rich-text-editor:insert-image'),
            undo: true,
            focus: true,
            showOnMobile: true,
            refreshAfterCallback: false,
            callback: function(): void {
                global.console.log('RTE CALLBACK insertImage!');
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
                global.console.log('RTE CALLBACK imageReplace!');
                let vueFroala: VueFroala = this.$oel[0].parentNode.__vue__;
                vueFroala.allowedExtensions = this.imageExtensions;
                vueFroala.isFileUploadOpen = true;
            },
            refresh: function(): void {
                global.console.log('RTE REFRESH imageReplace !');
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
        global.console.log('RTE IMAGE filesReady!');
        this.$emit('image-ready', files[0], this.fileUploadStoreName);
    }

    protected onCloseFileUpload(): void {
        this.froalaEditor.events.focus();
    }

    protected filesAdded(files: MFile[]): void {
        this.froalaEditor.opts.modulImageUploaded = true;
        this.$emit('image-added', files[0], (file: MFile, id: string) => {
            global.console.log('RTE IMAGE filesAdded !');
            global.console.log(this.selectedImage);

            if (this.selectedImage) {
                this.froalaEditor.image.insert(file.url, false, { id }, $(this.selectedImage));
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
        // TODO fix me
        if (this.$el.contains(event.target as HTMLElement) || $('.fr-modal.fr-active').length > 0) {
            this.mousedownInsideEditor = true;
        } else {
            this.mousedownInsideEditor = false;
        }
    }

    protected mouseupListener(event: MouseEvent): void {
        this.mousedownTriggered = false;
        if (!this.mousedownInsideEditor && !this.$el.contains(event.target as HTMLElement) && this.isFocused
            // TODO fix me
            && !this.isFileUploadOpen && $('.fr-image-resizer.fr-active').length === 0) {
            this.closeEditor();
        }
    }

    protected mounted(): void {
        if (FroalaEditor !== undefined
            && FroalaEditor.LANGUAGE[this.config.language] !== undefined
            && this.customTranslations !== undefined
        ) {
            Object.assign(FroalaEditor.LANGUAGE[this.config.language].translation, this.customTranslations);
        }

        this.createEditor();
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
        this.addCustomIcons();

        this.currentConfig = Object.assign(this.config || this.defaultConfig, {
            // we reemit each valid input events so froala can work in input-style component.
            events: {
                [froalaEvents.InitializationDelayed]: () => {
                    this.isLoaded = true;
                    this.setReadOnly();
                    this.htmlSet();
                    window.addEventListener('resize', this.onResize);
                    global.console.log('RTE EVENT InitializationDelayed!');
                },
                [froalaEvents.ContentChanged]: () => {
                    this.updateModel();
                    global.console.log('RTE EVENT ContentChanged!');
                },
                [froalaEvents.Focus]: () => {
                    this.activateRichText();
                    global.console.log('RTE EVENT Focus!');
                },
                [froalaEvents.Blur]: () => {
                    global.console.log('RTE EVENT Blur!');
                    if (!this.mousedownTriggered && !this.isFileUploadOpen) {
                        this.closeEditor();
                    }
                },
                [froalaEvents.KeyUp]: () => {
                    global.console.log('RTE EVENT KeyUp!');
                    if (this.currentConfig.immediateVueModelUpdate) {
                        this.updateModel();
                    }
                    this.$emit('keyup');
                },
                [froalaEvents.KeyDown]: (key) => {
                    global.console.log('RTE EVENT KeyDown!');
                    this.$emit('keydown');
                    this.isDirty = true;
                    // fix me
                    if (key.keyCode === ENTER_KEYCODE) {
                        this.froalaEditor.paragraphStyle.apply('');
                    }
                },
                [froalaEvents.PasteAfter]: () => {
                    global.console.log('RTE EVENT PasteAfter!');
                    this.$emit('paste');
                },
                // if we use pasteBeforeCleanup, there's an error in froala's code
                [froalaEvents.PasteAfterCleanup]: (data: string) => {
                    global.console.log('RTE EVENT PasteAfterCleanup!');
                    if (data.replace) {
                        data = replaceTags(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'], 'p', data);
                        return this.froalaEditor.clean.html(data, ['table', 'video', 'u', 's', 'blockquote', 'button', 'input', 'img']);
                    }
                },
                [froalaEvents.CommandBefore]: (cmd: any, param1: any, param2: any) => {
                    global.console.log('RTE EVENT CommandBefore!');
                    global.console.log('cmd -> ' + cmd);
                    global.console.log('param1 -> ' + param1);
                    global.console.log('param2 -> ' + param2);
                    if (cmd === 'fullscreen') {
                        let fullscreenWasActivated: boolean = !this.froalaEditor.fullscreen.isActive();
                        if (!this.froalaEditor.fullscreen.isActive()) {
                            // fix me
                            // this.froalaEditor.toolbar.hide();
                        } else {
                            this.$scrollTo.goTo(this.$el as HTMLElement, -50, ScrollToDuration.Instant);
                        }
                        this.onFullscreen(fullscreenWasActivated);
                    }
                },
                [froalaEvents.CommandAfter]: (cmd: any, param1: any, param2: any) => {
                    // fix me, il y a un bug, l'event n'est pas appelé correctement
                    // plain écren n'est pas completament affiché =(
                    global.console.log('RTE EVENT CommandAfter! ');
                    global.console.log('cmd -> ' + cmd);
                    global.console.log('param1 -> ' + param1);
                    global.console.log('param2 -> ' + param2);

                    if (cmd === 'fullscreen') {
                        if (this.froalaEditor.fullscreen.isActive()) {
                            this.froalaEditor.toolbar.show();
                        }
                    }
                },
                [froalaEvents.ShowLinkInsert]: () => {
                    global.console.log('RTE EVENT ShowLinkInsert!');
                    this.manageLinkInsert();
                },
                [froalaEvents.ImageRemoved]: ($img) => {
                    global.console.log('RTE EVENT ImageRemoved! ');
                    this.$emit('image-removed', $img[0].dataset.id, this.fileUploadStoreName);
                    this.updateModel();
                },
                [froalaEvents.ImageInserted]: ($img) => {
                    global.console.log('RTE EVENT ImageInserted! ');
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

        // this.registerEvents();

        global.console.log('RTE CREATE EDITOR!');

        this.froalaEditor = new FroalaEditor(this.$refs.editor, this.currentConfig, () => {
            global.console.log('RTE EVENT INITIALIZED! -> ' + this.isInitialized);
            this.isInitialized = true;

            // We have to delay the initialization of disabled until the rich text is initialized.
            // It will remain glitchy otherwise when combined with init on click.
            // See comment https://github.com/froala/angular-froala-wysiwyg/issues/75#issuecomment-310709095
            this.isDisabled = this.disabled;

            this.manageInitialFocus();
        });
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

    // fix me
    private set isDisabled(value: boolean) {
        if (value) {
            this.froalaEditor.edit.off();
        } else {
            this.froalaEditor.edit.on();
        }
    }

    // fix me
    @Watch('readonly')
    private setReadOnly(): void {
        this.internalReadonly = this.readonly;
    }

    private simulateReadonlyBlur(event: Event): void {
        // fix me
        if (!this.$el.contains(event.target as Node)) {
            if (this.isFocused) {
                this.froalaEditor.edit.on();
                global.console.log('RTE BLUR!!!');
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
        global.console.log('----------------------------------------');
        global.console.log('RTE manageLinkInsert!!!');
        global.console.log('----------------------------------------');
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
        // this.listeningEvents && this._$element.off(this.listeningEvents.join(' '));
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

    // fix me?
    private registerEvent(eventName: any, callback: any): void {
        if (!eventName || !callback) {
            return;
        }

        if (this.currentConfig.events === undefined) {
            this.currentConfig.events = {};
        }

        this.currentConfig.events[eventName] = callback;
    }

    private registerEvents(): void {
        const events: any = this.currentConfig.events;
        if (!events) {
            return;
        }

        for (let event in events) {
            if (events.hasOwnProperty(event)) {
                this.registerEvent(event, events[event]);
            }
        }
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
