import Vue from 'vue';
import { ModulVue } from '../../utils/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './dropdown.html?style=./dropdown.scss';
import { DROPDOWN_NAME } from '../component-names';
import { normalizeString } from '../../utils/str';

const UNDEFINED: string = 'undefined';

@WithRender
@Component
export class MDropdown extends ModulVue {

    @Prop({ default: [] })
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
    public isEditabled: boolean;
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
