// This code is largery borrowed from https://github.com/froala/vue-froala-wysiwyg.
// However some changes have been made to "inputify" the froala editor and render is compatible with modUL input-style.
import $ from 'jquery';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import { replaceTags } from '../../../utils/clean/htmlClean';
import { PopupPlugin } from './popup-plugin';
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

    @Watch('value')
    public refreshValue(): void {
        this.model = this.value;
        this.updateValue();
    }

    public get isEmpty(): boolean {
        return this.value.length === 0;
    }

    public get isInitialized(): boolean {
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

    protected destroyed(): void {
        window.removeEventListener('resize', this.onResize);
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

    private createEditor(): void {
        if (this.isInitialized) {
            return;
        }

        this.addPopups();

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
                    data = replaceTags(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], 'p', data);
                    return _editor.clean.html(data, ['table', 'img', 'video', 'u', 's', 'blockquote', 'button', 'input']);
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
    }

    private dismissWordPasteModal(): void {
        const wordPasteModal: HTMLElement | null = document.querySelector(FroalaElements.MODAL);
        const modalOverlay: HTMLElement | null = document.querySelector(FroalaElements.MODAL_OVERLAY);
        const cleanWordButton: HTMLElement | null = this.getWordPasteCleanButton();

        if (wordPasteModal) {
            wordPasteModal.style.display = 'none';
        }

        if (modalOverlay) {
            modalOverlay.style.display = 'none';
        }

        if (cleanWordButton) {
            cleanWordButton!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
            cleanWordButton!.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
        }

        wordPasteModal!.remove();
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
        if (!this.isInitialized && !firstTime) {
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
