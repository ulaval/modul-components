import Vue from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './dropdown.html?style=./dropdown.scss';
import { DROPDOWN_NAME } from '../component-names';
import { normalizeString } from '../../utils/str/str';
import { KeyCode } from '../../utils/keycode/keycode';
import { MDropDownItemInterface } from '../dropdown-item/dropdown-item';
import { InputState, InputStateMixin } from '../../mixins/input-state/input-state';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';

const PAGE_STEP: number = 3;
const DROPDOWN_MAX_HEIGHT: number = 198;
const DROPDOWN_STYLE_TRANSITION: string = 'max-height 0.3s ease';

export interface SelectedValue {
    key: string | undefined;
    value: any;
    label: string;
}

export interface MDropdownInterface extends Vue {
    items: Vue[];
    selected: Array<SelectedValue>;
    currentElement: SelectedValue;
    addAction: boolean;
    nbItemsVisible: number;
    multiple: boolean;
    propOpen: boolean;
    getElement(key: string): Vue | undefined;
    itemDestroy(item: Vue): void;
    setFocus(item: Vue): void;
}

@WithRender
@Component({
    mixins: [
        InputState,
        MediaQueries
    ]
})
export class MDropdown extends ModulVue implements MDropdownInterface {

    @Prop()
    public label: string;
    @Prop()
    public defaultText: string;
    @Prop()
    public defaultValue: any;
    @Prop({ default: false })
    public open: boolean;
    @Prop({ default: false })
    public disabled: boolean;
    @Prop({ default: false })
    public editable: boolean;
    @Prop({ default: false })
    public multiple: boolean;
    @Prop({ default: '200px' })
    public width: string;
    @Prop({ default: false })
    public defaultFirstElement: boolean;
    @Prop()
    public textNoData: string;
    @Prop()
    public textNoMatch: string;

    public componentName: string = DROPDOWN_NAME;

    public items: Vue[] = [];
    public selected: Array<SelectedValue> = [];
    public currentElement: SelectedValue = { 'key': undefined, 'value': undefined, 'label': '' };
    public addAction: true;
    public nbItemsVisible: number = 0;
    public selectedText: string = '';
    private internalOpen: boolean = false;
    private noItemsLabel: string;

    public getElement(key: string): Vue | undefined {
        let element: Vue | undefined;

        for (let child of this.$children) {
            if (child.$options.name == 'MPopup' &&
                child.$el.nodeName != '#comment' &&
                child.$children[0].$options.name == 'MPopper') {
                element = this.recursiveGetElement(key, child.$children[0]);
                break;
            }
        }
        return element;
    }

    public itemDestroy(item: Vue): void {
        let index: number = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
            if ((this.items[index] as MDropDownItemInterface).visible) {
                this.nbItemsVisible--;
            }
        }
    }

    public setFocus(elementFocus: Vue): void {
        for (let item of this.items) {
            if (item === elementFocus) {
                (item as MDropDownItemInterface).hasFocus = true;
            } else {
                (item as MDropDownItemInterface).hasFocus = false;
            }
        }
    }

    public getFocus(): MDropDownItemInterface | undefined {
        let elementFocus: MDropDownItemInterface | undefined = undefined;

        for (let item of this.items) {
            if ((item as MDropDownItemInterface).hasFocus) {
                elementFocus = (item as MDropDownItemInterface);
                break;
            }
        }

        return elementFocus;
    }

    protected mounted(): void {
        this.propOpen = this.open;
        // Obtenir le premier dropdown-item
        if (this.defaultFirstElement && !this.multiple && !this.disabled) {
            let firstElement: Vue = this.items[0];
            if (firstElement) {
                (firstElement as MDropDownItemInterface).onSelectElement();
            }
        }
    }

    @Watch('selected')
    private selectedChanged(value): void {
        let values: any[] = [];

        for (let selectedValue of this.selected) {
            values.push(selectedValue.value);
        }

        if (value.length == 0 && this.defaultValue) {
            values.push(this.defaultValue);
        }

        this.$emit('change', values, this.addAction);
    }

    @Watch('currentElement')
    private currentElementChanged(value): void {
        this.selectedText = '';
        for (let item of this.selected) {
            if (this.selectedText != '') {
                this.selectedText += ', ';
            }
            this.selectedText += item.label;
        }
        this.$emit('elementSelected', this.currentElement.value, this.addAction);
    }

    @Watch('open')
    private openChanged(open: boolean): void {
        this.propOpen = open;
    }

    public get propOpen(): boolean {
        return this.internalOpen;
    }

    public set propOpen(open: boolean) {
        this.internalOpen = open != undefined ? open : false;
        this.$nextTick(() => {
            if (open) {
                this.$el.style.zIndex = '10';
                this.$emit('open');
            } else {
                this.$el.style.removeProperty('z-index');
                this.$emit('close');
            }
        });
    }

    private get propEditable(): boolean {
        return this.editable && this.selected.length == 0;
    }

    private get propTextNoData(): string {
        if (this.textNoData) {
            return this.textNoData;
        } else {
            return this.$i18n.translate('m-dropdown:no-data');
        }
    }

    private get propTextNoMatch(): string {
        if (this.textNoMatch) {
            return this.textNoMatch;
        } else {
            return this.$i18n.translate('m-dropdown:no-result');
        }
    }

    private get showNoItemsLabel(): boolean {
        let show: boolean = false;

        if (this.nbItemsVisible == 0) {
            this.noItemsLabel = this.items.length == 0 ? this.propTextNoData : this.propTextNoMatch;
            show = true;
        }

        return show;
    }

    private get propWidth(): string {
        if (this.as<MediaQueriesMixin>().isMqMaxS) {
            return '100%';
        } else {
            return this.width;
        }
    }

    private recursiveGetElement(key: string, node: Vue): Vue | undefined {
        let element: Vue | undefined;

        for (let child of node.$children) {
            if (child.$options.name == 'MDropdownGroup') {
                element = this.recursiveGetElement(key, child);
                if (element) {
                    return element;
                }
            } else if (child.$options.name == 'MDropdownItem' && child.$el.nodeName != '#comment' && child.$el.attributes['data-key'].value == key) {
                return child;
            }
        }
        return element;
    }

    private filterDropdown(text: string): void {
        if (this.selected.length == 0) {
            for (let item of this.items) {
                if (!(item as MDropDownItemInterface).propInactif) {
                    (item as MDropDownItemInterface).filter = normalizeString(text.trim());
                }
            }
        }
    }

    private keyupReference($event): void {
        if (!this.propOpen && ($event.keyCode == KeyCode.M_DOWN || $event.keyCode == KeyCode.M_SPACE)) {
            $event.preventDefault();
            (this.$refs.mDropdownValue as Vue).$el.click();
        }

        if (this.propOpen && ($event.keyCode == KeyCode.M_DOWN || $event.keyCode == KeyCode.M_END || $event.keyCode == KeyCode.M_PAGE_DOWN)) {
            $event.preventDefault();
            let htmlElement: HTMLElement = this.$el.querySelector(`[data-index='0']`) as HTMLElement;
            if (htmlElement) {
                htmlElement.focus();
            }
        }
    }

    private keyupItem($event: KeyboardEvent): void {
        let element: Vue | undefined = undefined;
        let focusElement: MDropDownItemInterface | undefined = this.getFocus();
        let itemsEnabled: MDropDownItemInterface[] = (this.items as MDropDownItemInterface[]).filter(item => (item.disabled === false && item.visible === true));

        switch ($event.keyCode) {
            case KeyCode.M_UP:
                if (focusElement) {
                    let index: number = itemsEnabled.indexOf(focusElement);
                    if (index == 0) {
                        element = itemsEnabled[0];
                    } else {
                        element = itemsEnabled[index - 1];
                    }
                } else {
                    element = itemsEnabled[0];
                }
                break;
            case KeyCode.M_HOME:
                element = itemsEnabled[0];
                break;
            case KeyCode.M_PAGE_UP:
                if (focusElement) {
                    let index: number = itemsEnabled.indexOf(focusElement);
                    index -= PAGE_STEP;

                    if (index < 0) {
                        element = itemsEnabled[0];
                    } else {
                        element = itemsEnabled[index];
                    }
                } else {
                    element = itemsEnabled[0];
                }
                break;
            case KeyCode.M_DOWN:
                if (focusElement) {
                    let index: number = itemsEnabled.indexOf(focusElement);
                    if (index == itemsEnabled.length - 1) {
                        element = itemsEnabled[itemsEnabled.length - 1];
                    } else {
                        element = itemsEnabled[index + 1];
                    }
                } else {
                    element = itemsEnabled[0];
                }
                break;

            case KeyCode.M_END:
                element = itemsEnabled[itemsEnabled.length - 1];
                break;
            case KeyCode.M_PAGE_DOWN:
                if (focusElement) {
                    let index: number = itemsEnabled.indexOf(focusElement);
                    index += PAGE_STEP;

                    if (index > itemsEnabled.length - 1) {
                        element = itemsEnabled[itemsEnabled.length - 1];
                    } else {
                        element = itemsEnabled[index];
                    }
                } else {
                    let index: number = (PAGE_STEP < itemsEnabled.length ? PAGE_STEP - 1 : itemsEnabled.length - 1);
                    element = itemsEnabled[index];
                }
                break;
            case KeyCode.M_ENTER:
            case KeyCode.M_RETURN:
                if (focusElement) {
                    (focusElement as MDropDownItemInterface).onSelectElement();
                }
                return;
        }

        if (element) {
            element.$el.focus();
        }
    }

    private transitionEnter(el: HTMLElement, done: any): void {
        this.$nextTick(() => {
            let height: number = el.clientHeight > DROPDOWN_MAX_HEIGHT ? DROPDOWN_MAX_HEIGHT : el.clientHeight;
            el.style.webkitTransition = DROPDOWN_STYLE_TRANSITION;
            el.style.transition = DROPDOWN_STYLE_TRANSITION;
            el.style.overflowY = 'hidden';
            el.style.maxHeight = '0';
            el.style.width = this.width;
            setTimeout(() => {
                el.style.maxHeight = height + 'px';
                done();
            }, 0);
        });

    }

    private transitionAfterEnter(el: HTMLElement): void {
        setTimeout(() => {
            el.style.maxHeight = DROPDOWN_MAX_HEIGHT + 'px';
            el.style.overflowY = 'auto';
        }, 300);
    }

    private transitionLeave(el: HTMLElement, done: any): void {
        this.$nextTick(() => {
            let height: number = el.clientHeight;
            el.style.maxHeight = height + 'px';
            el.style.overflowY = 'hidden';
            el.style.maxHeight = '0';
            setTimeout(() => {
                el.style.maxHeight = 'none';
                done();
            }, 300);
        });
    }
}

const DropdownPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DROPDOWN_NAME, MDropdown);
    }
};

export default DropdownPlugin;
