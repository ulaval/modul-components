// This code is largery borrowed from https://github.com/froala/vue-froala-wysiwyg.
// However some changes have been made to "inputify" the froala editor and render is compatible with modUL input-style.
import $ from 'jquery';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import { PopupPlugin } from './popup-plugin';
import WithRender from './vue-froala.html?style=./vue-froala.scss';

require('froala-editor/js/froala_editor.pkgd.min');
require('froala-editor/css/froala_editor.pkgd.min.css');
require('froala-editor/js/languages/fr.js');

const SPECIAL_TAGS: string[] = ['img', 'button', 'input', 'a'];

const INNER_HTML_ATTR: string = 'innerHTML';

enum froalaEvents {
    Initialized = 'froalaEditor.initialized',
    Focus = 'froalaEditor.focus',
    Blur = 'froalaEditor.blur',
    KeyUp = 'froalaEditor.keyup',
    KeyDown = 'froalaEditor.keydown',
    PasteAfter = 'froalaEditor.paste.after',
    PasteBeforeCleanup = 'froalaEditor.paste.beforeCleanup',
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
@Component
export class VueFroala extends Vue {
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
    protected _$element: any = undefined;
    protected _$editor: any = undefined;
    protected currentConfig: any = undefined;
    protected defaultConfig: any = {
        immediateVueModelUpdate: false,
        vueIgnoreAttrs: undefined
    };
    protected editorInitialized: boolean = false;
    protected hasSpecialTag: boolean = false;
    protected model: string | undefined = undefined;
    protected oldModel: string | undefined = undefined;

    protected isFocused: boolean = false;
    protected isInitialized: boolean = false;

    protected isDirty: boolean = false;

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
        $.FroalaEditor.PLUGINS[pluginName] = (editor) => { return new PopupPlugin(editor, name, buttonList); };

        // Define an icon and command for the button that opens the custom popup.
        // $.FroalaEditor.DefineIcon('stylePopup', { NAME: 'bold' });
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

    protected addPopups(): void {
        // add mobile mode popups
        $.FroalaEditor.DefineIcon('plus', { NAME: 'plus' });
        this.addPopup('styles', 'bold', ['bold', 'italic', 'subscript', 'superscript']);
        this.addPopup('listes', 'formatUL', ['formatUL', 'formatOL', 'outdent', 'indent']);
        this.addPopup('insertions', 'plus', ['insertLink', 'specialCharacters']);
    }

    protected created(): void {
        this.currentTag = this.tag || this.currentTag;
        this.model = this.value;
    }

    protected mounted(): void {
        if (SPECIAL_TAGS.indexOf(this.currentTag) !== -1) {
            this.hasSpecialTag = true;
        }

        this.createEditor();

        // add a dropdown arrow to popups buttons
        $(`button[id*='Popup']`).addClass('popup-button');
    }

    protected beforeDestroy(): void {
        this.destroyEditor();
    }

    protected get collapsed(): boolean {
        return this.isInitialized && !this.isFocused && (this.isEmpty || this.disabled);
    }

    private createEditor(): void {
        if (this.editorInitialized) {
            return;
        }

        this.addPopups();

        this.currentConfig = Object.assign(this.config || this.defaultConfig, {
            // we reemit each valid input events so froala can work in input-style component.
            events: {
                [froalaEvents.Initialized]: (_e, editor) => {
                    this.hideToolbar(editor);
                    this.isInitialized = true;
                },
                [froalaEvents.Focus]: (_e, editor) => {
                    this.isDirty = false;

                    this.$emit('focus');
                    this.showToolbar(editor);
                    this.isFocused = true;

                    if (editor.helpers.isMobile()) {
                        editor.fullscreen.toggle();
                    }
                },
                [froalaEvents.Blur]: (_e, editor) => {
                    if (!editor.fullscreen.isActive()) {
                        this.$emit('blur');
                        this.hideToolbar(editor);

                        this.isFocused = false;
                        this.isDirty = false;
                    }
                },
                [froalaEvents.KeyUp]: (_e, _editor) => {
                    this.$emit('keyup');
                },
                [froalaEvents.KeyDown]: (_e, _editor) => {
                    this.$emit('keydown');
                    this.isDirty = true;
                },
                [froalaEvents.PasteAfter]: (_e, _editor) => {
                    this.$emit('paste');
                },
                [froalaEvents.PasteBeforeCleanup]: (_e, _editor, data: string) => {
                    return _editor.clean.html(data, ['table', 'img', 'video', 'u', 's','h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote']);
                },
                [froalaEvents.CommandAfter]: (_e, _editor, cmd) => {
                    // write code to be called after a command is called (button clicked, image modified, ...)
                },
                [froalaEvents.WordPasteBefore]: (_e, editor) => {
                    // Scrap this and all associated private methods when https://github.com/froala/wysiwyg-editor/issues/2964 get fixed.
                    if (editor.wordPaste && this.currentConfig.wordPasteModal) {
                        if (this.getWordPasteCleanButton()) {
                            requestAnimationFrame(() => { this.dismissWordPasteModal(); });
                        } else {
                            const observer: MutationObserver = new MutationObserver(() => {
                                this.dismissWordPasteModal();
                                observer.disconnect();
                            });

                            observer.observe(document.body, { childList: true });
                        }
                    }
                }
            }
        });

        this._$element = $(this.$refs.editor);

        this.setContent(true);

        this.registerEvents();
        this._$editor = this._$element.froalaEditor(this.currentConfig).data('froala.editor').$el;
        this.initListeners();

        this.editorInitialized = true;
    }

    private dismissWordPasteModal(): void {
        const wordPasteModal: HTMLElement | null = document.querySelector(FroalaElements.MODAL);
        wordPasteModal!.style.display = 'none';

        const modalOverlay: HTMLElement | null = document.querySelector(FroalaElements.MODAL_OVERLAY);
        modalOverlay!.style.display = 'none';

        const cleanWordButton: HTMLElement | null = this.getWordPasteCleanButton();
        cleanWordButton!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
        cleanWordButton!.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
    }

    private getWordPasteCleanButton(): HTMLElement | null {
        return document.querySelector(FroalaElements.MODAL_WORD_PASTE_CLEAN_BUTTON);
    }

    private hideToolbar(editor: any): void {
        editor.toolbar.hide();
        const toolBar: HTMLElement = this.$el.querySelector(FroalaElements.TOOLBAR) as HTMLElement;
        toolBar.style.marginTop = `-${toolBar.offsetHeight}px`;
    }

    private showToolbar(editor: any): void {
        editor.toolbar.show();
        const toolBar: HTMLElement = this.$el.querySelector(FroalaElements.TOOLBAR) as HTMLElement;
        toolBar.style.removeProperty('margin-top');
    }

    private updateValue(): void {
        if (JSON.stringify(this.oldModel) === JSON.stringify(this.model)) {
            return;
        }

        this.setContent();
    }

    private setContent(firstTime: boolean = false): void {
        if (!this.editorInitialized && !firstTime) {
            return;
        }

        if (this.model || this.model === '') {
            this.oldModel = this.model;

            if (this.hasSpecialTag) {
                this.setSpecialTagContent();
            } else {
                this.setNormalTagContent(firstTime);
            }
        }
    }

    private setNormalTagContent(firstTime: boolean = false): void {
        if (firstTime) {
            this.registerEvent(this._$element, 'froalaEditor.initialized', () => {
                this.htmlSet();
            });
        } else {
            this.htmlSet();
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
            this._$editor.off('keyup');
            this._$element.froalaEditor('destroy');
            this.listeningEvents.length = 0;
            this._$element = undefined;
            this.editorInitialized = false;
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

    private initListeners(): void {
        // bind contentChange and keyup event to froalaModel
        this.registerEvent(this._$element, 'froalaEditor.contentChanged', () => {
            this.updateModel();
        });
        if (this.currentConfig.immediateVueModelUpdate) {
            this.registerEvent(this._$editor, 'keyup', () => {
                this.updateModel();
            });
        }
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
        this._$element.froalaEditor('html.set', this.model || '', true);
        // This will reset the undo stack everytime the model changes externally. Can we fix this?
        this._$element.froalaEditor('undo.reset');
        this._$element.froalaEditor('undo.saveStep');
    }
}

export default VueFroala;
