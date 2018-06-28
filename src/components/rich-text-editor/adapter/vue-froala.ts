// Thus code is ugly but it is an adaptation of https://github.com/froala/vue-froala-wysiwyg to get rid of the global $ (jquery) dependency.
// We should get rid of this code when https://github.com/froala/vue-froala-wysiwyg/issues/50 is resolved.
import $ from 'jquery';

export default (Vue, Options = {}) => {

    const froalaEditorFunctionality: any = {

        props: ['tag', 'value', 'config', 'onManualControllerReady'],

        watch: {
            value: function(): void {
                this.model = this.value;
                this.updateValue();
            }
        },

        render: function(createElement: any): void {
            return createElement(
                this.currentTag,
                [this.$slots.default]);
        },

        created: function(): void {
            this.currentTag = this.tag || this.currentTag;
            this.model = this.value;
        },

      // After first time render.
        mounted: function(): void {
            if (this.SPECIAL_TAGS.indexOf(this.currentTag) !== -1) {
                this.hasSpecialTag = true;
            }

            if (this.onManualControllerReady) {
                this.generateManualController();
            } else {
                this.createEditor();
            }
        },

        beforeDestroy: function(): void {
            this.destroyEditor();
        },

        data: function(): any {
            return {
                // Tag on which the editor is initialized.
                currentTag: 'div',
                listeningEvents: [],

                // Jquery wrapped element.
                _$element: undefined,

                // Editor element.
                _$editor: undefined,

                // Current config.
                currentConfig: undefined,

                // Editor options config
                defaultConfig: {
                    immediateVueModelUpdate: false,
                    vueIgnoreAttrs: undefined
                },

                editorInitialized: false,

                SPECIAL_TAGS: ['img', 'button', 'input', 'a'],
                INNER_HTML_ATTR: 'innerHTML',
                hasSpecialTag: false,

                model: undefined,
                oldModel: undefined
            };
        },
        methods: {
            updateValue: function(): void {
                if (JSON.stringify(this.oldModel) === JSON.stringify(this.model)) {
                    return;
                }

                this.setContent();
            },

            createEditor: function(): void {

                if (this.editorInitialized) {
                    return;
                }

                this.currentConfig = this.config || this.defaultConfig;

                this._$element = $(this.$el);

                this.setContent(true);

                this.registerEvents();
                this._$editor = this._$element.froalaEditor(this.currentConfig).data('froala.editor').$el;
                this.initListeners();

                this.editorInitialized = true;
            },

            setContent: function(firstTime: any): void {
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
            },

            setNormalTagContent: function(firstTime: any): void {
                const self: any = this;

                function htmlSet(): void {

                    self._$element.froalaEditor('html.set', self.model || '', true);
                    // This will reset the undo stack everytime the model changes externally. Can we fix this?
                    self._$element.froalaEditor('undo.reset');
                    self._$element.froalaEditor('undo.saveStep');
                }

                if (firstTime) {
                    this.registerEvent(this._$element, 'froalaEditor.initialized', function(): void {
                        htmlSet();
                    });
                } else {
                    htmlSet();
                }
            },

            setSpecialTagContent: function(): void {

                const tags: any = this.model;

                // add tags on element
                if (tags) {
                    for (let attr in tags) {
                        if (tags.hasOwnProperty(attr) && attr !== this.INNER_HTML_ATTR) {
                            this._$element.attr(attr, tags[attr]);
                        }
                    }

                    if (tags.hasOwnProperty(this.INNER_HTML_ATTR)) {
                        this._$element[0].innerHTML = tags[this.INNER_HTML_ATTR];
                    }
                }
            },

            destroyEditor: function(): void {

                if (this._$element) {

                    this.listeningEvents && this._$element.off(this.listeningEvents.join(' '));
                    this._$editor.off('keyup');
                    this._$element.froalaEditor('destroy');
                    this.listeningEvents.length = 0;
                    this._$element = undefined;
                    this.editorInitialized = false;
                }
            },

            getEditor: function(): any {

                if (this._$element) {
                    return this._$element.froalaEditor.bind(this._$element);
                }
                return undefined;
            },

            generateManualController: function(): void {

                const self: any = this;
                const controls: any = {
                    initialize: this.createEditor,
                    destroy: this.destroyEditor,
                    getEditor: this.getEditor
                };

                this.onManualControllerReady(controls);
            },

            updateModel: function(): void {

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
                        attrs[this.INNER_HTML_ATTR] = this._$element[0].innerHTML;
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
            },

            initListeners: function(): void {
                const self: any = this;

          // bind contentChange and keyup event to froalaModel
                this.registerEvent(this._$element, 'froalaEditor.contentChanged',function(): void {
                    self.updateModel();
                });
                if (this.currentConfig.immediateVueModelUpdate) {
                    this.registerEvent(this._$editor, 'keyup', function(): void {
                        self.updateModel();
                    });
                }
            },

        // register event on jquery editor element
            registerEvent: function(element: any, eventName: any, callback: any): void {

                if (!element || !eventName || !callback) {
                    return;
                }

                this.listeningEvents.push(eventName);
                element.on(eventName, callback);
            },

            registerEvents: function(): void {

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
        }
    };

    Vue.component('froala', froalaEditorFunctionality);
    const froalaViewFunctionality: any = {

        props: ['tag', 'value'],

        watch: {
            value: function(newValue): void {
                this._element.innerHTML = newValue;
            }
        },

        created: function(): void {
            this.currentTag = this.tag || this.currentTag;
        },

        render: function(createElement: any): void {
            return createElement(
                this.currentTag,
                {
                    class: 'fr-view'
                }
            );
        },

      // After first time render.
        mounted: function(): void {
            this._element = this.$el;

            if (this.value) {
                this._element.innerHTML = this.value;
            }
        },

        data: function(): any {
            return {
                currentTag: 'div',
                _element: undefined
            };
        }
    };

    Vue.component('froalaView', froalaViewFunctionality);
};
