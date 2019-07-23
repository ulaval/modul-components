// This code is largery borrowed from https://github.com/froala/vue-froala-wysiwyg.
// However some changes have been made to "inputify" the froala editor and render is compatible with modUL input-style.
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
import uuid from '../../../utils/uuid/uuid';
import { ModulVue } from '../../../utils/vue/vue';
import { PopupPlugin } from './popup-plugin';
import SubMenuPlugin from './submenu-plugin';
import WithRender from './vue-froala.html?style=./vue-froala.scss';

require('froala-editor/js/froala_editor.pkgd.min');
require('froala-editor/css/froala_editor.pkgd.min.css');
require('froala-editor/js/languages/fr.js');

enum froalaEvents {
    Blur = 'froalaEditor.blur',
    Click = 'froalaEditor.click',
    CommandAfter = 'froalaEditor.commands.after',
    CommandBefore = 'froalaEditor.commands.before',
    ContentChanged = 'froalaEditor.contentChanged',
    Focus = 'froalaEditor.focus',
    ImageRemoved = 'froalaEditor.image.removed',
    ImageInserted = 'froalaEditor.image.inserted',
    Initialized = 'froalaEditor.initialized',
    InitializationDelayed = 'froalaEditor.initializationDelayed',
    KeyUp = 'froalaEditor.keyup',
    KeyDown = 'froalaEditor.keydown',
    PasteAfter = 'froalaEditor.paste.after',
    PasteAfterCleanup = 'froalaEditor.paste.afterCleanup',
    ShowLinkInsert = 'froalaEditor.popups.show.link.insert'
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
    ]
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
    protected _$element: any = undefined;
    protected _$editor: any = undefined;
    protected currentConfig: any = undefined;
    protected defaultConfig: any = {
        immediateVueModelUpdate: false,
        vueIgnoreAttrs: undefined
    };

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

    protected addPopup(name: string, icon: string, buttonList: string[]): void {
        const buttonName: string = `${name}Popup`;
        const pluginName: string = `${name}Plugin`;

        $.FroalaEditor.POPUP_TEMPLATES[`${pluginName}.popup`] = '[_BUTTONS_]';

        // The custom popup is defined inside a plugin (new or existing).
        $.FroalaEditor.PLUGINS[pluginName] = (editor) => { return new PopupPlugin(name, editor, buttonList); };

        // Create the button that'll open the popup
        $.FroalaEditor.RegisterCommand(buttonName, {
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

    protected addSubMenu(name: string, icon: string, buttonList: string[]): void {
        const buttonName: string = `${name}-sub-menu`;
        const pluginName: string = `${name}SubMenu`;

        // The custom popup is defined inside a plugin (new or existing).
        $.FroalaEditor.PLUGINS[pluginName] = (editor) => { return new SubMenuPlugin(editor, buttonList); };

        // Create the button that'll open the popup
        $.FroalaEditor.RegisterCommand(buttonName, {
            title: name,
            icon: icon,
            undo: false,
            focus: false,
            plugin: pluginName,
            callback: function(): void {
                this[pluginName].showSubMenu();
            }
        });
    }

    protected addCustomIcons(): void {
        $.FroalaEditor.DefineIconTemplate('custom-icons', '[SVG]');

        if (this.$i18n.currentLang() === 'fr') {
            $.FroalaEditor.DefineIcon('bold', { SVG: (boldIcon as string), template: 'custom-icons' });
        }
        $.FroalaEditor.DefineIcon('styles', { SVG: (stylesIcon as string), template: 'custom-icons' });
        $.FroalaEditor.DefineIcon('lists', { SVG: (listsIcon as string), template: 'custom-icons' });
        $.FroalaEditor.DefineIcon('paragraphStyle', { SVG: (titleIcon as string), template: 'custom-icons' });
    }

    protected addPopups(): void {
        // add mobile mode popups
        $.FroalaEditor.DefineIcon('plus', { NAME: 'plus' });
        this.addPopup(this.$i18n.translate('m-rich-text-editor:styles'), 'styles', ['paragraphStyle', 'bold', 'italic', 'subscript', 'superscript']);
        this.addPopup(this.$i18n.translate('m-rich-text-editor:lists'), 'lists', ['formatUL', 'formatOL', 'outdent', 'indent']);
        this.addPopup(this.$i18n.translate('m-rich-text-editor:insert'), 'plus', ['insertLink', 'specialCharacters', 'insertImage']);
    }

    protected addSubMenus(): void {
        // add mobile mode submenus
        this.addSubMenu(this.$i18n.translate('m-rich-text-editor:styles'), 'styles', ['paragraphStyle', 'bold', 'italic', 'subscript', 'superscript']);
        this.addSubMenu(this.$i18n.translate('m-rich-text-editor:lists'), 'lists', ['formatUL', 'formatOL', 'outdent', 'indent']);

        // we'll use this submodule when we'll support images,tables,...
        //  $.FroalaEditor.DefineIcon('plus', { NAME: 'plus' });
        // this.addSubMenu(this.$i18n.translate('m-rich-text-editor:insert'), 'plus', ['insertLink', 'specialCharacters']);

        // add "hide sub-menu" button
        $.FroalaEditor.DefineIcon('angle-left', { NAME: 'angle-left' });
        $.FroalaEditor.RegisterCommand('hide', {
            title: this.$i18n.translate('m-rich-text-editor:hide-submenu'),
            icon: 'angle-left',
            undo: false,
            focus: false,
            callback: function(): void {
                // Important not to use an arrow function here with this.froalaEditor since the editor is corrupted for some reason.
                this.stylesSubMenu.hideSubMenu();
                this.listesSubMenu.hideSubMenu();
                // we'll use this submenu when we'll support images,tables,...
                // this.froalaEditor.insertionsSubMenu.hideSubMenu();
            }
        });
    }

    protected addImageButton(): void {
        $.FroalaEditor.RegisterCommand('insertImage', {
            title: this.$i18n.translate('m-rich-text-editor:insert-image'),
            undo: true,
            focus: true,
            showOnMobile: true,
            callback: function(): void {
                let currentInstance: VueFroala = this.$oel[0].parentNode.__vue__;
                currentInstance.allowedExtensions = currentInstance.imageExtensions;
                currentInstance.isFileUploadOpen = true;
                currentInstance.selectedImage = undefined;
            }
        });

        $.FroalaEditor.DefineIcon('imageReplace', { SVG: (replaceIcon as string), template: 'custom-icons' });
        $.FroalaEditor.RegisterCommand('imageReplace', {
            title: this.$i18n.translate('m-rich-text-editor:replace-image'),
            undo: true,
            focus: true,
            showOnMobile: true,
            callback: function(): void {
                let currentInstance: VueFroala = this.$oel[0].parentNode.__vue__;
                currentInstance.allowedExtensions = currentInstance.imageExtensions;
                currentInstance.isFileUploadOpen = true;
            },
            refresh: function(): void {
                const selectedElement: HTMLElement = this.selection.element();
                if (selectedElement.tagName === 'IMG') {
                    let currentInstance: VueFroala = this.$oel[0].parentNode.__vue__;
                    currentInstance.selectedImage = selectedElement;
                }
            }
        });

        $.FroalaEditor.DefineIcon('image-align-center', { SVG: (imageAlignCenterIcon as string), template: 'custom-icons' });
        $.FroalaEditor.DefineIcon('image-align-left', { SVG: (imageAlignLeftIcon as string), template: 'custom-icons' });
        $.FroalaEditor.DefineIcon('image-align-right', { SVG: (imageAlignRightIcon as string), template: 'custom-icons' });
    }

    protected filesReady(files: MFile[]): void {
        this.$emit('image-ready', files[0], this.fileUploadStoreName);
    }

    protected onClose(): void {
        this.froalaEditor.events.focus();
    }

    protected filesAdded(files: MFile[]): void {
        this.froalaEditor.opts.modulImageUploaded = true;
        this.$emit('image-added', files[0], (file: MFile, id: string) => {
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
        if (this.$el.contains(event.target as HTMLElement) || $('.fr-modal.fr-active').length > 0) {
            this.mousedownInsideEditor = true;
        } else {
            this.mousedownInsideEditor = false;
        }
    }

    protected mouseupListener(event: MouseEvent): void {
        this.mousedownTriggered = false;
        if (!this.mousedownInsideEditor && !this.$el.contains(event.target as HTMLElement) && this.isFocused
            && !this.isFileUploadOpen && $('.fr-image-resizer.fr-active').length === 0) {
            this.closeEditor();
        }
    }

    protected mounted(): void {
        if ($.FE !== undefined
            && $.FE.LANGUAGE[this.config.language] !== undefined
            && this.customTranslations !== undefined
        ) {
            Object.assign($.FE.LANGUAGE[this.config.language].translation, this.customTranslations);
        }

        this.createEditor();

        // add a dropdown arrow to popups buttons
        $(`button[id*='Popup']`).addClass('popup-button');
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

    protected desktopMode(): void {
        if (this.froalaEditor && this.froalaEditor.$tb) {
            this.froalaEditor.$tb.find(`.fr-command`).show();
            this.froalaEditor.$tb.find(`.fr-command[data-cmd*="-sub-menu"]`).hide();
            this.froalaEditor.$tb.find(`.fr-command[data-cmd="hide"]`).hide();
        }
    }

    protected mobileMode(): void {
        if (this.froalaEditor && this.froalaEditor.$tb) {
            this.froalaEditor.$tb.find(`.fr-command`).hide();
            this.froalaEditor.$tb.find(`.fr-command[data-cmd*="-sub-menu"]`).show();
            this.froalaEditor.$tb.find(`.fr-command[data-cmd="fullscreen"]`).show();
            this.froalaEditor.$tb.find(`.fr-command[data-cmd="insertLink"]`).show();
            this.froalaEditor.$tb.find(`.fr-command[data-cmd="specialCharacters"]`).show();
            this.froalaEditor.$tb.find(`.fr-command[data-cmd="insertImage"]`).show();
            // show submit buttons (ex: link insertion submit button)
            this.froalaEditor.$tb.find(`.fr-submit`).show();
        }
    }

    @Watch('isDesktop')
    private changeMode(): void {
        // mode desktop
        if (this.isDesktop) {
            this.desktopMode();
            // hide hide button
            if (this.froalaEditor && this.froalaEditor.$tb) {
                this.froalaEditor.$tb.find(`.fr-command[data-cmd="hide"]`).hide();
            }
        } else {
            this.mobileMode();
        }
    }

    private createEditor(): void {
        if (this.isInitialized) {
            return;
        }

        this.setClientWidth();
        this.addCustomIcons();
        this.addSubMenus();

        if (this.config && this.config.pluginsEnabled.includes('image')) {
            this.addImageButton();
        }

        this.currentConfig = Object.assign(this.config || this.defaultConfig, {
            // we reemit each valid input events so froala can work in input-style component.
            events: {
                [froalaEvents.InitializationDelayed]: (_e, editor) => {
                    this.froalaEditor = editor;
                    this.isLoaded = true;
                    this.setReadOnly();
                    this.htmlSet();
                    window.addEventListener('resize', this.onResize);
                },
                [froalaEvents.Initialized]: (_e, editor) => {
                    this.froalaEditor = editor;
                    this.isInitialized = true;

                    // We have to delay the initialization of disabled until the rich text is initialized.
                    // It will remain glitchy otherwise when combined with init on click.
                    // See comment https://github.com/froala/angular-froala-wysiwyg/issues/75#issuecomment-310709095
                    this.isDisabled = this.disabled;

                    this.manageInitialFocus(editor);
                },
                [froalaEvents.ContentChanged]: (_e, _editor) => {
                    this.updateModel();
                },
                [froalaEvents.Focus]: (_e) => {
                    this.activateRichText();
                },
                [froalaEvents.Blur]: () => {
                    if (!this.mousedownTriggered && !this.isFileUploadOpen) {
                        this.closeEditor();
                    }
                },
                [froalaEvents.KeyUp]: (_e, _editor) => {
                    if (this.currentConfig.immediateVueModelUpdate) {
                        this.updateModel();
                    }
                    this.$emit('keyup');
                },
                [froalaEvents.KeyDown]: (_e, editor, key) => {
                    this.$emit('keydown');
                    this.isDirty = true;
                    if (key.keyCode === ENTER_KEYCODE) {
                        editor.paragraphStyle.apply('');
                    }
                },
                [froalaEvents.PasteAfter]: (_e, _editor) => {
                    this.$emit('paste');
                },
                // if we use pasteBeforeCleanup, there's an error in froala's code
                [froalaEvents.PasteAfterCleanup]: (_e, _editor, data: string) => {
                    if (data.replace) {
                        data = replaceTags(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'], 'p', data);
                        return _editor.clean.html(data, ['table', 'video', 'u', 's', 'blockquote', 'button', 'input', 'img']);
                    }
                },
                [froalaEvents.CommandBefore]: (_e, _editor, cmd) => {
                    if (cmd === 'fullscreen') {

                        let fullscreenWasActivated: boolean = !_editor.fullscreen.isActive();
                        this.onFullscreen(fullscreenWasActivated);

                        if (fullscreenWasActivated) {
                            this.hideToolbar();
                        }
                    }
                },
                [froalaEvents.CommandAfter]: (_e, _editor, cmd) => {
                    if (cmd === 'fullscreen') {
                        if (_editor.fullscreen.isActive()) {
                            this.showToolbar();
                        }
                    }
                },
                [froalaEvents.ShowLinkInsert]: (_e, editor) => {
                    this.manageLinkInsert(editor);
                },
                [froalaEvents.ImageRemoved]: (_e, _editor, img) => {
                    this.$emit('image-removed', img[0].dataset.id, this.fileUploadStoreName);
                    this.updateModel();
                },
                [froalaEvents.ImageInserted]: (_e, _editor, img) => {
                    if (_editor.opts.modulImageUploaded) {
                        img[0].alt = '';
                        this.updateModel();
                    } else {
                        setTimeout(() => {
                            _editor.image.remove(img);
                        });
                    }

                    _editor.opts.modulImageUploaded = false;
                }
            }
        });

        this._$element = $(this.$refs.editor);

        this.registerEvents();
        if (this._$element.froalaEditor) {
            this._$editor = this._$element.froalaEditor(this.currentConfig).data('froala.editor').$el;
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

    private manageInitialFocus(editor: any): void {
        // the editor might or might not be focused when initializing.  If it is focused, we have to emit the focus event.  Otherwise, we have to hide the toolbar.
        if (!editor.core.hasFocus()) {
            this.hideToolbar();
        } else {
            this.$emit('focus');
        }
    }

    private manageLinkInsert(editor: any): void {
        const popup: HTMLElement = editor.popups.get('link.insert')[0];
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
        if (this.editorIsAvailable() && !this.internalReadonly) {
            this.froalaEditor.toolbar.show();
            const toolBar: HTMLElement = this.$el.querySelector(FroalaElements.TOOLBAR) as HTMLElement;
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
        if (this._$element) {
            this.isLoaded = false;
            this.isInitialized = false;
            this.isFocused = false;
            this.listeningEvents && this._$element.off(this.listeningEvents.join(' '));
            if (this.froalaEditor) {
                this.froalaEditor.destroy();
            }
            this.listeningEvents.length = 0;
            this._$element = undefined;
            this.froalaEditor = undefined;
            this.internalReadonly = false;
        }
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
        const returnedHtml: any = this._$element.froalaEditor('html.get');
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

    private registerEvent(element: any, eventName: any, callback: any): void {
        if (!element || !eventName || !callback) {
            return;
        }

        this.listeningEvents.push(eventName);
        element.on(eventName, callback);
    }

    private registerEvents(): void {
        const events: any = this.currentConfig.events;
        if (!events) {
            return;
        }

        for (let event in events) {
            if (events.hasOwnProperty(event)) {
                this.registerEvent(this._$element, event, events[event]);
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
