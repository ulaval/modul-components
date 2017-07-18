import Vue from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from '../../mixins/dropdown-template/dropdown-template.html?style=../../mixins/dropdown-template/dropdown-template.scss';
import { SELECT_NAME } from '../component-names';
import { normalizeString } from '../../utils/str/str';
import { KeyCode } from '../../utils/keycode/keycode';
import { DropdownTemplate, DropdownTemplateMixin } from '../../mixins/dropdown-template/dropdown-template';

const UNDEFINED: string = 'undefined';
const PAGE_STEP: number = 4;

@WithRender
@Component({
    mixins: [DropdownTemplate]
})
export class MSelect extends ModulVue implements DropdownTemplateMixin {

    @Prop({ default: () => ['element 1', 'element 2', 'element 3', 'element 4', 'element 5', 'element 6'] })
    public elements: any[];
    @Prop()
    public selectedElement: any;
    @Prop()
    public getTextElement: Function;
    @Prop({ default: false })
    public open: boolean;
    @Prop({ default: true })
    public sort: boolean;
    @Prop()
    public sortMethod: Function;
    @Prop({ default: false })
    public widthFromCss: boolean;

    public componentName: string = SELECT_NAME;

    // var from DropdownTemplateMixin
    public mode: string = 'select';
    public label: string;
    public editable: boolean;
    public defaultText: string;
    public defaultFirstElement: boolean;

    // Copy of prop
    public propSelectedElement: any;
    public propOpen: boolean = false;

    // Initialize data for v-model to work
    public textElement: string = '';

    private elementsSorted: Array<any>;

    @Watch('elements')
    public elementChanged(value): void {
        this.prepareElements();
    }

    @Watch('selectedElement')
    public selectedElementChanged(value): void {
        this.propSelectedElement = value;
        this.textElement = this.getSelectedElementText();
    }

    @Watch('open')
    public openChanged(value): void {
        this.propOpen = value;
    }

    public get elementsCount(): number {
        return this.elementsSortedFiltered.length;
    }

    public get elementsSortedFiltered(): Array<any> {
        if ((this.textElement == '') || (this.textElement == this.getSelectedElementText())) {
            return this.elementsSorted;
        }

        let filteredElements: Array<any> = this.elementsSorted.filter((element) => {
            return normalizeString(this.getElementListText(element)).match(normalizeString(this.textElement));
        });

        return filteredElements;
    }

    public created() {
        // Copy of prop to avoid override on re-render
        this.propSelectedElement = this.selectedElement;

        // Run in created() to run before computed data
        this.prepareElements();
    }

    public mounted() {
        this.adjustWidth();
    }

    public onSelectElement($event, element: any): void {
        this.selectElement(element);
    }

    public getSelectedElementText(): string {
        let text: string = '';

        if (typeof this.propSelectedElement != UNDEFINED) {
            text = this.getElementListText(this.propSelectedElement);
        }

        return text;
    }

    public getElementListText(element: any): string {
        let text: string = '';

        if (typeof element == UNDEFINED) {
            text = '';
        } else if (this.getTextElement) {
            text = this.getTextElement(element);
        } else {
            text = String(element);
        }

        return text;
    }

    public adjustWidth(): void {
        if (!this.widthFromCss) {
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
            this.$el.style.width = width + 'px';
            elements.style.width = width + 'px';

        } else {
            let parentElement: HTMLElement = this.$refs.mDropdown as HTMLElement;
            let childElement: HTMLElement = this.$refs.mDropdownElements as HTMLElement;
            childElement.style.width = parentElement.offsetWidth + 'px';
        }
    }

    public toggleDropdown(value: boolean): void {
        this.propOpen = value;
        if (value) {
            this.$el.style.zIndex = '10';
        } else {
            this.$el.style.removeProperty('z-index');
        }
        Vue.nextTick(() => {
            if (value) {
                this.setDropdownElementFocus();
            }
        });
        this.$emit('open', value);
    }

    public setDropdownElementFocus(): void {
        if (!this.editable) {
            let element: HTMLElement = this.$el.querySelector(`.is-selected a`) as HTMLElement;
            if (element) {
                element.focus();
            }
        }
    }

    public keyupReference($event): void {
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

    public keyupItem($event: KeyboardEvent, index: number): void {
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
            case KeyCode.M_DOWN:
                if (index == this.elementsSortedFiltered.length - 1) {
                    selector = `[data-index='${this.elementsSortedFiltered.length - 1}']`;
                } else {
                    selector = `[data-index='${index + 1}']`;
                }
                break;
            case KeyCode.M_END:
                selector = `[data-index='${this.elementsSortedFiltered.length - 1}']`;
                break;
            case KeyCode.M_PAGE_DOWN:
                index += PAGE_STEP;
                if (index >= this.elementsSortedFiltered.length) {
                    index = this.elementsSortedFiltered.length - 1;
                }
                selector = `[data-index='${index}']`;
                break;
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

    private selectElement(element: any): void {
        this.propSelectedElement = element;
        this.textElement = this.getSelectedElementText();
        this.$emit('elementSelected', this.propSelectedElement);
    }

    private getTextWidth(element: HTMLElement, text: string): number {
        element.innerHTML = text;
        return element.offsetWidth;
    }

    private prepareElements(): void {
        let elementsSorted: any[] = new Array();

        if (this.elements) {
            // Create a separe copy of the array, to prevent triggering infinite loop on watcher of elements
            elementsSorted = this.elements.slice(0);

            // Sorting options
            if (this.sort) {
                if (typeof this.sortMethod == UNDEFINED) {
                    // Default sort: Alphabetically
                    if (typeof this.getTextElement == UNDEFINED) {
                        elementsSorted = elementsSorted.sort((a, b) => a.localeCompare(b));
                    } else {
                        elementsSorted = elementsSorted.sort((a, b) => this.getElementListText(a).localeCompare(this.getElementListText(b)));
                    }
                } else {
                    elementsSorted = this.sortMethod(elementsSorted);
                }
            }

            // Default element
            if (this.defaultFirstElement && elementsSorted[0]) {
                this.selectElement(elementsSorted[0]);
            }
            this.textElement = this.getSelectedElementText();
        }

        this.elementsSorted = elementsSorted;
    }

}

const SelectPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(SELECT_NAME, MSelect);
    }
};

export default SelectPlugin;
