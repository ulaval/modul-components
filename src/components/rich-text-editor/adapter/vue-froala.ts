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

const SPECIAL_TAGS: string[] = ['img', 'button', 'input', 'a'];

const INNER_HTML_ATTR: string = 'innerHTML';

enum froalaEvents {
    Initialized = 'froalaEditor.initialized',
    ContentChanged= 'froalaEditor.contentChanged',
    Focus = 'froalaEditor.focus',
    Blur = 'froalaEditor.blur',
    KeyUp = 'froalaEditor.keyup',
    KeyDown = 'froalaEditor.keydown',
    PasteAfter = 'froalaEditor.paste.after',
    PasteBeforeCleanup = 'froalaEditor.paste.beforeCleanup',
    PasteAfterCleanup = 'froalaEditor.paste.afterCleanup',
    WordPasteBefore = 'froalaEditor.paste.wordPaste.before',
    CommandAfter = 'froalaEditor.commands.after'
}

enum FroalaElements {
    MODAL = '.fr-modal',
    MODAL_OVERLAY = '.fr-overlay',
    MODAL_WORD_PASTE_CLEAN_BUTTON = '.fr-remove-word',
    TOOLBAR = '.fr-toolbar',
    TOOLBAR_ACTIVE_BUTTON = '.fr-active'
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

    @Prop()
    public config: any;

    protected currentTag: string = 'div';
    protected listeningEvents: any[] = [];
    protected froalaEditor: any = undefined;
    protected _$element: any = undefined;
    protected _$editor: any = undefined;
    protected currentConfig: any = undefined;
    protected defaultConfig: any = {
        immediateVueModelUpdate: false,
        vueIgnoreAttrs: undefined
    };
    protected hasSpecialTag: boolean = false;
    protected model: string | undefined = undefined;
    protected oldModel: string | undefined = undefined;

    protected isFocused: boolean = false;

    protected isDirty: boolean = false;
    protected wordObserver: MutationObserver;

    @Watch('value')
    public refreshValue(): void {
        this.model = this.value;
        this.updateValue();
    }

    public get isEmpty(): boolean {
        return this.value.length === 0;
    }

    public isInitialized(): boolean {
        return !!this.froalaEditor;
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
            callback: () => {
                this.froalaEditor.stylesSubMenu.hideSubMenu();
                this.froalaEditor.listesSubMenu.hideSubMenu();
                // we'll use this submenu when we'll support images,tables,...
                // this.froalaEditor.insertionsSubMenu.hideSubMenu();
            }
        });
    }

    protected created(): void {
        this.currentTag = this.tag || this.currentTag;
        this.model = this.value;
        this.initWordObserver();
    }

    protected mounted(): void {
        if (SPECIAL_TAGS.indexOf(this.currentTag) !== -1) {
            this.hasSpecialTag = true;
        }

        this.createEditor();

        // add a dropdown arrow to popups buttons
        $(`button[id*='Popup']`).addClass('popup-button');
    }

    protected destroyed(): void {
        window.removeEventListener('resize', this.onResize);
    }

    protected beforeDestroy(): void {
        this.destroyEditor();
    }

    protected get collapsed(): boolean {
        return this.isInitialized() && !this.isFocused && (this.isEmpty || this.disabled);
    }

    protected onResize(): void {
        if (!this.isFocused) {
            this.adjusteToolbarPosition();
        }
    }

    protected desktopMode(): void {
        this.froalaEditor.$tb.find(`.fr-command`).show();
        this.froalaEditor.$tb.find(`.fr-command[data-cmd*="-sub-menu"]`).hide();
        this.froalaEditor.$tb.find(`.fr-command[data-cmd="hide"]`).hide();
    }

    protected mobileMode(): void {
        this.froalaEditor.$tb.find(`.fr-command`).hide();
        this.froalaEditor.$tb.find(`.fr-command[data-cmd*="-sub-menu"]`).show();
        this.froalaEditor.$tb.find(`.fr-command[data-cmd="fullscreen"]`).show();
        this.froalaEditor.$tb.find(`.fr-command[data-cmd="insertLink"]`).show();
        this.froalaEditor.$tb.find(`.fr-command[data-cmd="specialCharacters"]`).show();
        // show submit buttons (ex: link insertion submit button)
        this.froalaEditor.$tb.find(`.fr-submit`).show();
    }

    private initWordObserver(): void {
        this.wordObserver = new MutationObserver(() => {
            this.dismissWordPasteModal();
        });
    }

    @Watch('isEqMinXS')
    private changeMode(): void {
        // mode desktop
        if (this.as<ElementQueries>().isEqMinXS) {
            this.desktopMode();
            // hide hide button
            this.froalaEditor.$tb.find(`.fr-command[data-cmd="hide"]`).hide();
        } else {
            this.mobileMode();
        }
    }

    private createEditor(): void {
        if (this.isInitialized()) {
            return;
        }

        this.addCustomIcons();
        this.addSubMenus();

        this.currentConfig = Object.assign(this.config || this.defaultConfig, {
            // we reemit each valid input events so froala can work in input-style component.
            events: {
                [froalaEvents.Initialized]: (_e, editor) => {
                    this.froalaEditor = editor;
                    this.hideToolbar();
                    window.addEventListener('resize', this.onResize);
                    this.htmlSet();

                    // auto fullscreen on mobiles - uncomment when https://github.com/froala/wysiwyg-editor/issues/2988 is resolved
                    // if (editor.helpers.isMobile()) {
                    //     editor.fullscreen.toggle();
                    // }
                },
                [froalaEvents.ContentChanged]: (_e, _editor) => {
                    this.updateModel();
                },
                [froalaEvents.Focus]: (_e, editor) => {
                    if (!this.disabled) {
                        window.removeEventListener('resize', this.onResize);
                        this.isDirty = false;

                        this.$emit('focus');
                        this.showToolbar();
                        this.isFocused = true;
                    }
                },
                [froalaEvents.Blur]: (_e, editor) => {
                    if (!editor.fullscreen.isActive()) {
                        // this timeout is used to avoid the "undetected click" bug
                        // that happens sometimes due to the hideToolbar animation
                        setTimeout(() => {
                            window.addEventListener('resize', this.onResize);
                            this.$emit('blur');
                            this.hideToolbar();

                            this.isFocused = false;
                            this.isDirty = false;
                        }, 100);
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
                [froalaEvents.CommandAfter]: (_e, _editor, cmd) => {
                    // write code to be called after a command is called (button clicked, image modified, ...)
                },
                [froalaEvents.WordPasteBefore]: (_e, editor) => {
                    // Scrap this and all associated private methods when https://github.com/froala/wysiwyg-editor/issues/2964 get fixed.
                    if (editor.wordPaste && this.currentConfig.wordPasteModal) {
                        this.wordObserver.observe(document.body, { childList: true, attributes: true });
                    }
                }
            }
        });

        this._$element = $(this.$refs.editor);

        this.setContent(true);

        this.registerEvents();
        this._$editor = this._$element.froalaEditor(this.currentConfig).data('froala.editor').$el;
    }

    private dismissWordPasteModal(): void {
        const wordPasteModal: HTMLElement | null = document.querySelector(FroalaElements.MODAL);
        const modalOverlay: HTMLElement | null = document.querySelector(FroalaElements.MODAL_OVERLAY);
        const cleanWordButton: HTMLElement | null = this.getWordPasteCleanButton();

        if (wordPasteModal && wordPasteModal.style.display !== 'none') {
            this.wordObserver.disconnect();
            wordPasteModal.style.display = 'none';

            if (modalOverlay) {
                modalOverlay.style.display = 'none';
            }

            if (cleanWordButton) {
                cleanWordButton!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
                cleanWordButton!.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            }
        }
    }

    private getWordPasteCleanButton(): HTMLElement | null {
        return document.querySelector(FroalaElements.MODAL_WORD_PASTE_CLEAN_BUTTON);
    }

    private hideToolbar(): void {
        if (this.froalaEditor) {
            this.froalaEditor.toolbar.hide();
            this.adjusteToolbarPosition();
        }
    }

    private showToolbar(): void {
        if (this.froalaEditor) {
            this.froalaEditor.toolbar.show();
            const toolBar: HTMLElement = this.$el.querySelector(FroalaElements.TOOLBAR) as HTMLElement;
            toolBar.style.removeProperty('margin-top');
        }
    }

    private adjusteToolbarPosition(): void {
        const toolBar: HTMLElement = this.$el.querySelector(FroalaElements.TOOLBAR) as HTMLElement;
        toolBar.style.marginTop = `-${toolBar.offsetHeight}px`;
    }

    private updateValue(): void {
        if (JSON.stringify(this.oldModel) === JSON.stringify(this.model)) {
            return;
        }

        this.setContent();
    }

    private setContent(firstTime: boolean = false): void {
        if (!this.isInitialized() && !firstTime) {
            return;
        }

        if (this.model || this.model === '') {
            this.oldModel = this.model;

            if (this.hasSpecialTag) {
                this.setSpecialTagContent();
            } else if (!firstTime) {
                this.htmlSet();
            }
        }
    }

    private setSpecialTagContent(): void {
        const tags: any = this.model;

        // add tags on element
        if (tags) {
            for (let attr in tags) {
                if (tags.hasOwnProperty(attr) && attr !== INNER_HTML_ATTR) {
                    this._$element.attr(attr, tags[attr]);
                }
            }

            if (tags.hasOwnProperty(INNER_HTML_ATTR)) {
                this._$element[0].innerHTML = tags[INNER_HTML_ATTR];
            }
        }
    }

    private destroyEditor(): void {
        if (this._$element) {
            this.listeningEvents && this._$element.off(this.listeningEvents.join(' '));
            this.froalaEditor.destroy();
            this.listeningEvents.length = 0;
            this._$element = undefined;
            this.froalaEditor = undefined;
        }
    }

    private updateModel(): void {
        let modelContent: string = '';

        if (this.hasSpecialTag) {

            const attributeNodes: any = this._$element[0].attributes;
            const attrs: any = {};

            for (let i: number = 0; i < attributeNodes.length; i++) {

                const attrName: any = attributeNodes[i].name;
                if (this.currentConfig.vueIgnoreAttrs && this.currentConfig.vueIgnoreAttrs.indexOf(attrName) !== -1) {
                    continue;
                }
                attrs[attrName] = attributeNodes[i].value;
            }

            if (this._$element[0].innerHTML) {
                attrs[INNER_HTML_ATTR] = this._$element[0].innerHTML;
            }

            modelContent = attrs;
        } else {

            const returnedHtml: any = this._$element.froalaEditor('html.get');
            if (typeof returnedHtml === 'string') {
                modelContent = returnedHtml;
            }
        }

        this.oldModel = modelContent;
        this.$emit('input', modelContent);
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
        this.froalaEditor.html.set(this.model || '', true);
        // This will reset the undo stack everytime the model changes externally. Can we fix this?
        this.froalaEditor.undo.reset();
        this.froalaEditor.undo.saveStep();
    }
}

export default VueFroala;
