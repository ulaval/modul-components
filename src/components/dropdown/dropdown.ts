import Vue from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './dropdown.html?style=./dropdown.scss';
import { DROPDOWN_NAME } from '../component-names';
import { normalizeString } from '../../utils/str/str';

const UNDEFINED: string = 'undefined';
const PAGE_STEP: number = 4;

export class KeyCode {
    public static DOM_VK_CANCEL: number = 3;
    public static DOM_VK_HELP: number = 6;
    public static DOM_VK_BACK_SPACE: number = 8;
    public static DOM_VK_TAB: number = 9;
    public static DOM_VK_CLEAR: number = 12;
    public static DOM_VK_RETURN: number = 13;
    public static DOM_VK_ENTER: number = 14;
    public static DOM_VK_SHIFT: number = 16;
    public static DOM_VK_CONTROL: number = 17;
    public static DOM_VK_ALT: number = 18;
    public static DOM_VK_PAUSE: number = 19;
    public static DOM_VK_CAPS_LOCK: number = 20;
    public static DOM_VK_ESCAPE: number = 27;
    public static DOM_VK_SPACE: number = 32;
    public static DOM_VK_PAGE_UP: number = 33;
    public static DOM_VK_PAGE_DOWN: number = 34;
    public static DOM_VK_END: number = 35;
    public static DOM_VK_HOME: number = 36;
    public static DOM_VK_LEFT: number = 37;
    public static DOM_VK_UP: number = 38;
    public static DOM_VK_RIGHT: number = 39;
    public static DOM_VK_DOWN: number = 40;
    public static DOM_VK_PRINTSCREEN: number = 44;
    public static DOM_VK_INSERT: number = 45;
    public static DOM_VK_DELETE: number = 46;
    public static DOM_VK_0: number = 48;
    public static DOM_VK_1: number = 49;
    public static DOM_VK_2: number = 50;
    public static DOM_VK_3: number = 51;
    public static DOM_VK_4: number = 52;
    public static DOM_VK_5: number = 53;
    public static DOM_VK_6: number = 54;
    public static DOM_VK_7: number = 55;
    public static DOM_VK_8: number = 56;
    public static DOM_VK_9: number = 57;
    public static DOM_VK_SEMICOLON: number = 59;
    public static DOM_VK_EQUALS: number = 61;
    public static DOM_VK_A: number = 65;
    public static DOM_VK_B: number = 66;
    public static DOM_VK_C: number = 67;
    public static DOM_VK_D: number = 68;
    public static DOM_VK_E: number = 69;
    public static DOM_VK_F: number = 70;
    public static DOM_VK_G: number = 71;
    public static DOM_VK_H: number = 72;
    public static DOM_VK_I: number = 73;
    public static DOM_VK_J: number = 74;
    public static DOM_VK_K: number = 75;
    public static DOM_VK_L: number = 76;
    public static DOM_VK_M: number = 77;
    public static DOM_VK_N: number = 78;
    public static DOM_VK_O: number = 79;
    public static DOM_VK_P: number = 80;
    public static DOM_VK_Q: number = 81;
    public static DOM_VK_R: number = 82;
    public static DOM_VK_S: number = 83;
    public static DOM_VK_T: number = 84;
    public static DOM_VK_U: number = 85;
    public static DOM_VK_V: number = 86;
    public static DOM_VK_W: number = 87;
    public static DOM_VK_X: number = 88;
    public static DOM_VK_Y: number = 89;
    public static DOM_VK_Z: number = 90;
    public static DOM_VK_CONTEXT_MENU: number = 93;
    public static DOM_VK_NUMPAD0: number = 96;
    public static DOM_VK_NUMPAD1: number = 97;
    public static DOM_VK_NUMPAD2: number = 98;
    public static DOM_VK_NUMPAD3: number = 99;
    public static DOM_VK_NUMPAD4: number = 100;
    public static DOM_VK_NUMPAD5: number = 101;
    public static DOM_VK_NUMPAD6: number = 102;
    public static DOM_VK_NUMPAD7: number = 103;
    public static DOM_VK_NUMPAD8: number = 104;
    public static DOM_VK_NUMPAD9: number = 105;
    public static DOM_VK_MULTIPLY: number = 106;
    public static DOM_VK_ADD: number = 107;
    public static DOM_VK_SEPARATOR: number = 108;
    public static DOM_VK_SUBTRACT: number = 109;
    public static DOM_VK_DECIMAL: number = 110;
    public static DOM_VK_DIVIDE: number = 111;
    public static DOM_VK_F1: number = 112;
    public static DOM_VK_F2: number = 113;
    public static DOM_VK_F3: number = 114;
    public static DOM_VK_F4: number = 115;
    public static DOM_VK_F5: number = 116;
    public static DOM_VK_F6: number = 117;
    public static DOM_VK_F7: number = 118;
    public static DOM_VK_F8: number = 119;
    public static DOM_VK_F9: number = 120;
    public static DOM_VK_F10: number = 121;
    public static DOM_VK_F11: number = 122;
    public static DOM_VK_F12: number = 123;
    public static DOM_VK_F13: number = 124;
    public static DOM_VK_F14: number = 125;
    public static DOM_VK_F15: number = 126;
    public static DOM_VK_F16: number = 127;
    public static DOM_VK_F17: number = 128;
    public static DOM_VK_F18: number = 129;
    public static DOM_VK_F19: number = 130;
    public static DOM_VK_F20: number = 131;
    public static DOM_VK_F21: number = 132;
    public static DOM_VK_F22: number = 133;
    public static DOM_VK_F23: number = 134;
    public static DOM_VK_F24: number = 135;
    public static DOM_VK_NUM_LOCK: number = 144;
    public static DOM_VK_SCROLL_LOCK: number = 145;
    public static DOM_VK_COMMA: number = 188;
    public static DOM_VK_PERIOD: number = 190;
    public static DOM_VK_SLASH: number = 191;
    public static DOM_VK_BACK_QUOTE: number = 192;
    public static DOM_VK_OPEN_BRACKET: number = 219;
    public static DOM_VK_BACK_SLASH: number = 220;
    public static DOM_VK_CLOSE_BRACKET: number = 221;
    public static DOM_VK_QUOTE: number = 222;
    public static DOM_VK_META: number = 224;
}

@WithRender
@Component
export class MDropdown extends ModulVue {

    @Prop({ default: () => [] })
    public elements: string[];
    @Prop()
    public selectedElement: string;
    @Prop()
    public getTextElement: Function;
    @Prop({ default: '' })
    public state: string;
    @Prop({ default: true })
    public isSort: boolean;
    @Prop()
    public sortMethod: Function;
    @Prop({ default: false })
    public widthFromCss: boolean;
    @Prop({ default: false })
    public isEditable: boolean;
    @Prop()
    public nullValue: string;
    // @Prop({ default: false })
    // public name: boolean;
    // @Prop({ default: false })
    // public formName: boolean;

    // Copy of props
    public propsSelectedElement: string;

    // Initialize data for v-model to work
    public textElement: string = '';

    private elementsSorted: Array<string>;
    private stateDisabled: boolean;
    private nullValueText: string;
    private nullValueAvailable: boolean;
    private listIsOpen: boolean;

    @Watch('elements')
    public elementChanged(value): void {
        this.prepareElements();
    }

    @Watch('state', { immediate: true })
    public stateChanged(value): void {
        if (value == 'disabled') {
            this.stateDisabled = true;
        } else {
            this.stateDisabled = false;
        }
    }

    public get elementsCount(): number {
        return this.elementsSortedFiltered.length;
    }

    public get elementsSortedFiltered(): Array<string> {
        if ((this.textElement == '') || (this.textElement == this.propsSelectedElement)) {
            return this.elementsSorted;
        }

        let filteredElements: Array<string> = this.elementsSorted.filter((element) => {
            return normalizeString(element).match(normalizeString(this.textElement));
        });

        return filteredElements;
    }

    public created() {
        // Copy of props to avoid override on re-render
        this.propsSelectedElement = this.selectedElement;

        this.listIsOpen = false;

        // Null value (element facultatif)
        if (typeof this.nullValue == UNDEFINED) {
            this.nullValueAvailable = false;
        } else {
            this.nullValueAvailable = true;
            if (this.nullValue.trim() == '') {
                this.nullValueText = this.$i18n.translate('m-dropdown:none');
            } else {
                this.nullValueText = this.nullValue;
            }
        }

        // Run in created() to run before computed data
        this.prepareElements();
    }

    public mounted() {
        if (!this.widthFromCss) {
            this.adjustWidth();
        } else {
            let parentElement: HTMLElement = this.$refs.mDropdown as HTMLElement;
            let childElement: HTMLElement = this.$refs.mDropdownElements as HTMLElement;
            childElement.style.width = parentElement.offsetWidth + 'px';
        }
    }

    public selectElement($event, element: string): void {
        this.propsSelectedElement = element;
        this.textElement = this.getSelectedElementText();
        this.$emit('elementSelected', this.propsSelectedElement);
    }

    public getSelectedElementText(): string {
        let text: string = '';

        if ((typeof this.propsSelectedElement == UNDEFINED) || (this.propsSelectedElement == this.nullValueText)) {
            text = this.nullValueText;
        } else {
            text = this.getElementListText(this.propsSelectedElement);
        }

        return text;
    }

    public getElementListText(element: string): string {
        let text: string = '';

        if (!element) {
            text = this.nullValueText;
        } else if (this.getTextElement) {
            text = this.getTextElement({ element: element });
        }

        if (text.trim().length == 0) {
            text = String(element);
        }

        return text;
    }

    public adjustWidth(): void {
        // Hidden element to calculate width
        let hiddenField: HTMLElement = this.$refs.mDropdownCalculate as HTMLElement;
        // Input or a
        let valueField: Vue = this.$refs.mDropdownValue as Vue;
        // List of elements
        let elements: HTMLElement = this.$refs.mDropdownElements as HTMLElement;

        let width: number = 0;

        if (this.elements && this.elements.length > 0) {
            for (let element of this.elements) {
                width = Math.max(width, this.getTextWidth(hiddenField, this.getElementListText(element)));
            }
        } else {
            width = this.getTextWidth(hiddenField, this.getSelectedElementText());
        }

        // Add 25px for scrollbar
        width = Math.ceil(width) + 25;
        // Set width to Input and List
        valueField.$el.style.width = width + 'px';
        elements.style.width = width + 'px';
    }

    public listOpen(value: boolean): void {
        this.listIsOpen = value;
    }

    public keyupList($event): void {
        if (!this.listIsOpen && ($event.keyCode == KeyCode.DOM_VK_DOWN || $event.keyCode == KeyCode.DOM_VK_SPACE)) {
            $event.preventDefault();
            (this.$refs.mDropdownValue as Vue).$el.click();
        }
    }

    public keyupItem($event: KeyboardEvent, index: number): void {
        console.log('keyupItem', $event, index);
        let selector: string = '';
        switch ($event.keyCode) {
            case KeyCode.DOM_VK_UP:
                if (index == 0) {
                    selector = '[data-index=\'' + (this.elementsSortedFiltered.length - 1) + '\']';
                } else {
                    selector = '[data-index=\'' + (index - 1) + '\']';
                }
                break;
            case KeyCode.DOM_VK_HOME:
                selector = '[data-index=\'0\']';
                break;
            case KeyCode.DOM_VK_PAGE_UP:
                index -= PAGE_STEP;
                if (index < 0) {
                    index = 0;
                }
                selector = '[data-index=\'' + index + '\']';
                break;
            case KeyCode.DOM_VK_DOWN:
                if (index == this.elementsSortedFiltered.length - 1) {
                    selector = '[data-index=\'0\']';
                } else {
                    selector = '[data-index=\'' + (index + 1) + '\']';
                }
                break;
            case KeyCode.DOM_VK_END:
                selector = '[data-index=\'' + (this.elementsSortedFiltered.length - 1) + '\']';
                break;
            case KeyCode.DOM_VK_PAGE_DOWN:
                index += PAGE_STEP;
                if (index >= this.elementsSortedFiltered.length) {
                    index = this.elementsSortedFiltered.length - 1;
                }
                selector = '[data-index=\'' + index + '\']';
                break;
            case KeyCode.DOM_VK_ENTER:
            case KeyCode.DOM_VK_RETURN:
                let element: HTMLElement = this.$el.querySelector('[data-index=\'' + index + '\']') as HTMLElement;
                if (element) {
                    element.click();
                }
                return;
        }

        if (selector.trim() != '') {
            let element: HTMLElement = this.$el.querySelector(selector) as HTMLElement;
            if (element) {
                element.focus();
            }
        }
    }

    private getTextWidth(element: HTMLElement, text: string): number {
        element.innerHTML = text;
        return element.offsetWidth;
    }

    private prepareElements(): void {
        let elementsSorted: string[] = new Array();

        if (this.elements) {
            // Create a separe copy of the array, to prevent triggering infinite loop on watcher of elements
            elementsSorted = this.elements.slice(0);

            // Sorting options
            if (this.isSort) {
                if (typeof this.sortMethod == UNDEFINED) {
                    // Default sort: Alphabetically
                    elementsSorted = elementsSorted.sort((a, b) => a.localeCompare(b));
                } else {
                    elementsSorted = this.sortMethod(elementsSorted);
                }
            }

            // Default element
            if (typeof this.propsSelectedElement == UNDEFINED) {
                if (this.nullValueAvailable) {
                    this.propsSelectedElement = this.nullValueText;
                } else {
                    // No nullValue => 1st element is selected by default
                    this.propsSelectedElement = elementsSorted[0];
                }
            }
            this.textElement = this.getSelectedElementText();
        }

        // Add nullValue to sorted elements
        if (this.nullValueAvailable) {
            elementsSorted.splice(0, 0, this.nullValueText);
        }

        this.elementsSorted = elementsSorted;
    }
}

const DropdownPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DROPDOWN_NAME, MDropdown);
    }
};

export default DropdownPlugin;
