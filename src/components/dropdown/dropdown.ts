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

const UNDEFINED: string = 'undefined';
const PAGE_STEP: number = 4;

export interface SelectedValue {
    key: string | undefined;
    value: any;
}

export interface MDropDownInterface extends Vue {
    selected: Array<SelectedValue>;
    currentElement: SelectedValue;
    addAction: boolean;
}

@WithRender
@Component
export class MDropdown extends ModulVue implements MDropDownInterface {

    @Prop()
    public label: string;
    @Prop()
    public defaultText: string;
    @Prop({ default: false })
    public open: boolean;
    @Prop({ default: false })
    public disabled: boolean;
    @Prop({ default: false })
    public editable: boolean;
    @Prop({ default: false })
    public multiple: boolean;
    @Prop({ default: false })
    public widthFromCss: boolean;
    @Prop({ default: false })
    public defaultFirstElement: boolean;

    public componentName: string = DROPDOWN_NAME;

    public selected: Array<SelectedValue> = [];
    public currentElement: SelectedValue = {'key': undefined, 'value': undefined};
    public addAction: true;

    // Copy of prop
    public propOpen: boolean = false;

    private created() {
        // Run in created() to run before computed data
        // this.prepareElements();
    }

    private mounted() {
        // this.adjustWidth();
    }

    @Watch('selected')
    private selectedChanged(value): void {
        this.$emit('change', this.selected, this.addAction);
    }

    @Watch('currentElement')
    private currentElementChanged(value): void {
        this.$emit('elementSelected', this.currentElement, this.addAction);
    }

    @Watch('open')
    private openChanged(value): void {
        this.propOpen = value;
    }

    @Watch('isScreenMaxS')
    private isScreenMaxSChanged(value: boolean): void {
        if (!value) {
            this.$nextTick(() => {
                // this.adjustWidth();
            });
        }
    }

    // private adjustWidth(): void {
    //     if (!this.widthFromCss) {
    //         // Hidden element to calculate width
    //         let hiddenField: HTMLElement = this.$refs.mDropdownCalculate as HTMLElement;
    //         // Input or a
    //         let valueField: Vue = this.$refs.mDropdownValue as Vue;
    //         // List of elements
    //         let elements: HTMLElement = this.$refs.mDropdownElements as HTMLElement;

    //         let width: number = 0;

    //         if (elements && elements.children.length > 0) {
    //             for (let i = 0; i < elements.children.length; i++) {

    //                 if ((elements.children[i].children.length > 0) &&
    //                     (elements.children[i].children.item(0).classList.contains('m-dropdown-group'))) {

    //                     let elementsChild: HTMLElement = elements.children[i] as HTMLElement;
    //                     for (let j = 0; j < elementsChild.children.length; j++) {
    //                         width = Math.max(width, this.getElementWidth(hiddenField, elementsChild.children[j] as HTMLElement));
    //                     }
    //                 } else {
    //                     width = Math.max(width, this.getElementWidth(hiddenField, elements.children[i] as HTMLElement));
    //                 }
    //             }
    //         } else {
    //             // width = this.getElementWidth(hiddenField, this.getSelectedElementText());
    //         }

    //         // Add 25px for scrollbar
    //         width = Math.ceil(width) + 25;
    //         // Set width to Input and List
    //         valueField.$el.style.width = width + 'px';
    //         this.$el.style.width = width + 'px';
    //         elements.style.width = width + 'px';

    //     } else {
    //         let parentElement: HTMLElement = this.$refs.mDropdown as HTMLElement;
    //         let childElement: HTMLElement = this.$refs.mDropdownElements as HTMLElement;
    //         childElement.style.width = parentElement.offsetWidth + 'px';
    //     }
    // }

    // private getElementWidth(elementContainer: HTMLElement, elementText: HTMLElement): number {
    //     // console.log(elementContainer);
    //     // console.log(elementText);
    //     elementContainer.innerHTML = elementText.innerText;
    //     let width: number = elementContainer.offsetWidth;
    //     // elementContainer.removeChild(elementText);
    //     // if (element.$el.)
    //     // elementContainer.innerHTML = element;
    //     return width;
    // }

    private filterDropdown(text: string): void {
        for (let child of this.$children) {
            if (child.$options.name == 'MPopper') {
                this.propagateTextFilter(normalizeString(text.trim()), child);
            }
        }
    }

    private propagateTextFilter(text: string, node: Vue): void {
        for (let child of node.$children) {
            if (child.$options.name == 'MDropdownGroup') {
                this.propagateTextFilter(text, child);
            }

            if (child.$options.name == 'MDropdownItem') {
                (child as MDropDownItemInterface).filter = text;
            }
        }
    }

    // private get elementsCount(): number {
    //     return this.elementsSortedFiltered.length;
    // }

    // private get elementsSortedFiltered(): Array<any> {
    //     if ((this.textElement == '') || (this.textElement == this.getSelectedElementText())) {
    //         return this.elementsSorted;
    //     }

    //     let filteredElements: Array<any> = this.elementsSorted.filter((element) => {
    //         return normalizeString(this.getElementListText(element)).match(normalizeString(this.textElement));
    //     });

    //     return filteredElements;
    // }

    // private onSelectElement($event, element: any): void {
    //     this.selectElement(element);
    // }

    // private getSelectedElementText(): string {
    //     let text: string = '';

    //     if (typeof this.propSelectedElement != UNDEFINED) {
    //         text = this.getElementListText(this.propSelectedElement);
    //     }

    //     return text;
    // }

    // private getElementListText(element: any): string {
    //     let text: string = '';

    //     if (typeof element == UNDEFINED) {
    //         text = '';
    //     } else if (this.getTextElement) {
    //         text = this.getTextElement(element);
    //     } else {
    //         text = String(element);
    //     }

    //     return text;
    // }

    private toggleDropdown(value: boolean): void {
        Vue.nextTick(() => {
            this.propOpen = value;
            if (value) {
                this.$el.style.zIndex = '10';
                this.setDropdownElementFocus();
            } else {
                this.$el.style.removeProperty('z-index');
            }
            this.$emit('open', value);
        });
    }

    private setDropdownElementFocus(): void {
        // if (!this.as<DropdownTemplateMixin>().editable) {
        //     let element: HTMLElement = this.$el.querySelector(`.is-selected a`) as HTMLElement;
        //     if (element) {
        //         element.focus();
        //     }
        // }
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

    private keyupItem($event: KeyboardEvent, index: number): void {
        let selector: string = '';
        switch ($event.keyCode) {
            case KeyCode.M_UP:
                if (index == 0) {
                    selector = `[data-index='0']`;
                } else {
                    selector = `[data-index='${index - 1}']`;
                }
                break;
            case KeyCode.M_HOME:
                selector = `[data-index='0']`;
                break;
            case KeyCode.M_PAGE_UP:
                index -= PAGE_STEP;
                if (index < 0) {
                    index = 0;
                }
                selector = `[data-index='${index}']`;
                break;
            // case KeyCode.M_DOWN:
            //     if (index == this.elementsSortedFiltered.length - 1) {
            //         selector = `[data-index='${this.elementsSortedFiltered.length - 1}']`;
            //     } else {
            //         selector = `[data-index='${index + 1}']`;
            //     }
            //     break;
            // case KeyCode.M_END:
            //     selector = `[data-index='${this.elementsSortedFiltered.length - 1}']`;
            //     break;
            // case KeyCode.M_PAGE_DOWN:
            //     index += PAGE_STEP;
            //     if (index >= this.elementsSortedFiltered.length) {
            //         index = this.elementsSortedFiltered.length - 1;
            //     }
            //     selector = `[data-index='${index}']`;
            //     break;
            case KeyCode.M_ENTER:
            case KeyCode.M_RETURN:
                let element: HTMLElement = this.$el.querySelector(`[data-index='${index}']`) as HTMLElement;
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

    // private selectElement(element: any): void {
    //     this.propSelectedElement = element;
    //     this.textElement = this.getSelectedElementText();
    //     this.$emit('elementSelected', this.propSelectedElement);
    // }

    // private prepareElements(): void {
    //     let elementsSorted: any[] = new Array();

    //     if (this.elements) {
    //         // Create a separe copy of the array, to prevent triggering infinite loop on watcher of elements
    //         elementsSorted = this.elements.slice(0);

    //         // Sorting options
    //         if (this.sort) {
    //             if (typeof this.sortMethod == UNDEFINED) {
    //                 // Default sort: Alphabetically
    //                 if (typeof this.getTextElement == UNDEFINED) {
    //                     elementsSorted = elementsSorted.sort((a, b) => a.localeCompare(b));
    //                 } else {
    //                     elementsSorted = elementsSorted.sort((a, b) => this.getElementListText(a).localeCompare(this.getElementListText(b)));
    //                 }
    //             } else {
    //                 elementsSorted = this.sortMethod(elementsSorted);
    //             }
    //         }

    //         // Default element
    //         if (this.as<DropdownTemplateMixin>().defaultFirstElement && elementsSorted[0]) {
    //             this.selectElement(elementsSorted[0]);
    //         }
    //         this.textElement = this.getSelectedElementText();
    //     }

    //     this.elementsSorted = elementsSorted;
    // }

}

const DropdownPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DROPDOWN_NAME, MDropdown);
    }
};

export default DropdownPlugin;
