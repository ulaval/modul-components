// This code is largery borrowed from https://github.com/froala/vue-froala-wysiwyg.
// However some changes have been made to "inputify" the froala editor and render is compatible with modUL input-style.
import $ from 'jquery';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import boldIcon from '../../../assets/icons/svg/Froala-bold.svg';
import listsIcon from '../../../assets/icons/svg/Froala-lists.svg';
import stylesIcon from '../../../assets/icons/svg/Froala-styles.svg';
import { ElementQueries } from '../../../mixins/element-queries/element-queries';
import { replaceTags } from '../../../utils/clean/htmlClean';
import { ModulVue } from '../../../utils/vue/vue';
import { PopupPlugin } from './popup-plugin';
import SubMenuPlugin from './submenu-plugin';
import WithRender from './vue-froala.html?style=./vue-froala.scss';

require('froala-editor/js/froala_editor.pkgd.min');
require('froala-editor/css/froala_editor.pkgd.min.css');
require('froala-editor/js/languages/fr.js');

const INNER_HTML_ATTR: string = 'innerHTML';

enum froalaEvents {
    Initialized = 'froalaEditor.initialized',
    InitializationDelayed = 'froalaEditor.initializationDelayed',
    ContentChanged= 'froalaEditor.contentChanged',
    Focus = 'froalaEditor.focus',
    Blur = 'froalaEditor.blur',
    KeyUp = 'froalaEditor.keyup',
    KeyDown = 'froalaEditor.keydown',
    PasteAfter = 'froalaEditor.paste.after',
    PasteBeforeCleanup = 'froalaEditor.paste.beforeCleanup',
    PasteAfterCleanup = 'froalaEditor.paste.afterCleanup',
    CommandAfter = 'froalaEditor.commands.after',
    CommandBefore = 'froalaEditor.commands.before',
    ShowLinkInsert = 'froalaEditor.popups.show.link.insert'
}

enum FroalaElements {
    TOOLBAR = '.fr-toolbar',
    TOOLBAR_ACTIVE_BUTTON = '.fr-active',
    EDITABLE_ELEMENT = '.fr-element'
}

export enum FroalaStatus {
    Blurring = 'blurring',
    Blurred = 'blurred',
    Focused = 'focused'
}

@WithRender
@Component({
    mixins: [
        ElementQueries
    ]
})export class VueFroala extends ModulVue {
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
    public customTranslations: {[key: string]: string};

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
    protected model: string | undefined = undefined;
    protected oldModel: string | undefined = undefined;
    protected rawHtmlInput: string | undefined = undefined;

    protected isFocused: boolean = false;
    protected isInitialized: boolean = false;

    protected isDirty: boolean = false;
    protected status: FroalaStatus = FroalaStatus.Blurred;

    private clickedInsideEditor: boolean = false;

    @Watch('value')
    public refreshValue(): void {
        this.model = this.value;
        this.updateValue();
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
    }

    protected addPopups(): void {
        // add mobile mode popups
        $.FroalaEditor.DefineIcon('plus', { NAME: 'plus' });
        this.addPopup(this.$i18n.translate('m-rich-text-editor:styles'), 'styles', ['bold', 'italic', 'subscript', 'superscript']);
        this.addPopup(this.$i18n.translate('m-rich-text-editor:lists'), 'lists', ['formatUL', 'formatOL', 'outdent', 'indent']);
        this.addPopup(this.$i18n.translate('m-rich-text-editor:insert'), 'plus', ['insertLink', 'specialCharacters']);
    }

    protected addSubMenus(): void {
         // add mobile mode submenus
        this.addSubMenu(this.$i18n.translate('m-rich-text-editor:styles'), 'styles', ['bold', 'italic', 'subscript', 'superscript']);
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

    protected created(): void {
        this.currentTag = this.tag || this.currentTag;
        this.model = this.value;
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
        this.unblockMobileBlur();
    }

    protected beforeDestroy(): void {
        this.destroyEditor();
    }

    protected get collapsed(): boolean {
        return this.isInitialized && !this.isFocused && (this.isEmpty || this.disabled);
    }

    protected onResize(): void {
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
            // show submit buttons (ex: link insertion submit button)
            this.froalaEditor.$tb.find(`.fr-submit`).show();
        }
    }

    @Watch('isEqMinXS')
    private changeMode(): void {
        // mode desktop
        if (this.as<ElementQueries>().isEqMinXS) {
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

        this.addCustomIcons();
        this.addSubMenus();

        this.currentConfig = Object.assign(this.config || this.defaultConfig, {
            // we reemit each valid input events so froala can work in input-style component.
            events: {
                [froalaEvents.InitializationDelayed]: (_e, editor) => {
                    this.froalaEditor = editor;
                    this.htmlSet();
                    window.addEventListener('resize', this.onResize);
                },
                [froalaEvents.Initialized]: (_e, editor) => {
                    this.froalaEditor = editor;
                    this.isInitialized = true;
                    this.manageInitialFocus(editor);
                },
                [froalaEvents.ContentChanged]: (_e, _editor) => {
                    this.updateModel();
                },
                [froalaEvents.Focus]: (_e) => {
                    if (!this.disabled) {
                        window.removeEventListener('resize', this.onResize);
                        this.unblockMobileBlur();

                        this.refreshDirtyModel();

                        if (this.isInitialized) { this.$emit('focus'); }
                        this.showToolbar();
                        this.isFocused = true;
                        this.status = FroalaStatus.Focused;
                        this.internalReadonly = this.readonly;
                    }
                },
                [froalaEvents.Blur]: (_e, editor) => {
                    if (!editor.fullscreen.isActive() && !this.clickedInsideEditor) {
                        // this timeout is used to avoid the "undetected click" bug
                        // that happens sometimes due to the hideToolbar animation
                        this.status = FroalaStatus.Blurring;
                        setTimeout(() => {
                            if (this.status === FroalaStatus.Blurring) {
                                window.addEventListener('resize', this.onResize);
                                this.$emit('blur');
                                this.hideToolbar();

                                this.isFocused = false;
                                this.status = FroalaStatus.Blurred;

                                this.refreshDirtyModel();

                                this.unblockMobileBlur();
                                this.internalReadonly = false;
                            }
                        }, 150);
                    }
                },
                [froalaEvents.KeyUp]: (_e, _editor) => {
                    if (this.currentConfig.immediateVueModelUpdate) {
                        this.updateModel();
                    }
                    this.$emit('keyup');
                },
                [froalaEvents.KeyDown]: (_e, _editor) => {
                    this.$emit('keydown');
                    this.isDirty = true;
                },
                [froalaEvents.PasteAfter]: (_e, _editor) => {
                    this.$emit('paste');
                },
                // if we use pasteBeforeCleanup, there's an error in froala's code
                [froalaEvents.PasteAfterCleanup]: (_e, _editor, data: string) => {
                    if (data.replace) {
                        data = replaceTags(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'], 'p', data);
                        return _editor.clean.html(data, ['table', 'img', 'video', 'u', 's', 'blockquote', 'button', 'input']);
                    }
                },
                [froalaEvents.CommandBefore]: (_e, _editor, cmd) => {
                    if (cmd === 'fullscreen') {
                        this.blockMobileBlur(); // On iphone the input blur when going full screen and become invisible.
                    }
                },
                [froalaEvents.CommandAfter]: (_e, _editor, cmd) => {
                    if (cmd === 'fullscreen') {
                        this.unblockMobileBlur();
                    }
                },
                [froalaEvents.ShowLinkInsert]: (_e, editor) => {
                    this.manageLinkInsert(editor);
                }
            }
        });

        this._$element = $(this.$refs.editor);

        this.setContent();

        this.registerEvents();
        if (this._$element.froalaEditor) {
            this._$editor = this._$element.froalaEditor(this.currentConfig).data('froala.editor').$el;
        }
    }

    private refreshDirtyModel(): void {
        if (this.isDirty) {
            this.isDirty = false;
            this.updateModel();
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

    private blockMobileBlur(): void {
        this.clickedInsideEditor = true;
    }

    private unblockMobileBlur(): void {
        this.clickedInsideEditor = false;
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

    private updateValue(): void {
        if (JSON.stringify(this.oldModel) === JSON.stringify(this.model)) {
            return;
        }

        this.setContent();
    }

    private setContent(): void {
        if (this.model || this.model === '') {
            this.oldModel = this.model;

            this.htmlSet();
        }
    }

    private destroyEditor(): void {
        if (this._$element) {
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

    private updateModel(): void {
        let modelContent: string = '';

        const returnedHtml: any = this._$element.froalaEditor('html.get');
        if (typeof returnedHtml === 'string' && returnedHtml !== this.rawHtmlInput) {
            this.rawHtmlInput = returnedHtml;
            modelContent = this.removeEmptyHTML(returnedHtml);
        } else {
            modelContent = (this.oldModel) ? this.oldModel : '';
        }

        this.oldModel = modelContent;
        this.$emit('input', modelContent);
    }

    private removeEmptyHTML(value: string): string {
        const div: HTMLElement = document.createElement('div');
        div.innerHTML = value;
        return ((div.textContent || div.innerText || '').trim().length > 0) ? value : '';
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
        if (this.froalaEditor) {
            this.froalaEditor.html.set(this.model || '', true);
            if (this.froalaEditor.undo) {
                // This will reset the undo stack everytime the model changes externally. Can we fix this?
                this.froalaEditor.undo.reset();
                this.froalaEditor.undo.saveStep();
            }
        }
    }
}

export default VueFroala;
