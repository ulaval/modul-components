import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './dropdown.html?style=./dropdown.scss';
import { DROPDOWN_NAME } from '../component-names';
import { normalizeString } from '../../utils/str';

const UNDEFINED: string = 'undefined';
const NO_SORT: string = 'none';
const SORT_ALPHABETICALLY: string = 'alphabetically';

@WithRender
@Component
export class MDropdown extends Vue {

    @Prop({ default: [] })
    public elements: string[];
    @Prop()
    public selectedElement: string;
    @Prop()
    public getTexteElement: Function;
    @Prop()
    public invite: string;
    @Prop({ default: '' })
    public state: string;
    @Prop()
    public nullValue: string;
    @Prop({ default: SORT_ALPHABETICALLY })
    public sort: string;
    @Prop({ default: false })
    public widthFromCss: boolean;
    // @Prop({ default: false })
    // public name: boolean;
    // @Prop({ default: false })
    // public formName: boolean;
    @Prop({ default: false })
    public isEditabled: boolean;

    // Copy of props
    public propsSelectedElement: string;
    public propsInvite: string;

    // Initialize data for v-model to work
    public textElement: string = '';

    private elementsSorted: Array<string>;

    private stateDisabled: boolean;

    private nullValueText: string;
    private nullValueAvailable: boolean;

    // private updateEnCours: number;

    @Watch('textElement')
    public textElementChanged(value): void {
        // console.log(value);
    }

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
        // let filteredElements: Array<string> = this.elementsSorted;

        // if (this.updateEnCours) {
        //     clearTimeout(this.updateEnCours);
        // }

        // this.updateEnCours = window.setTimeout(
        //     () => filteredElements = this.filterElements()
        // , 300);

        // return filteredElements;

        if ((this.textElement == '') || (this.textElement == this.propsInvite) || (this.textElement == this.propsSelectedElement)) {
            return this.elementsSorted;
        }

        let filteredElements: Array<string> = this.elementsSorted.filter((element) => {
            return normalizeString(element).match(normalizeString(this.textElement));
        });

        return filteredElements;
    }

    public created() {
        // Copy of props to avoid override on re-render
        this.propsSelectedElement = this.$props.selectedElement;
        this.propsInvite = this.$props.invite;

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

        // Gestion si la liste deroulante est dans un form. Pour les flags touched / valid.
        // if (MpoObjectUtils.isDefini(this.name)) {
        //     if (this.ngModel && typeof this.ngModel == "object") {
        //         this.ngModel.$setTouched();
        //         this.ngModel.$setViewValue(this.elementSelectionne);
        //         this.ngModel.$validate();
        //         this.ngModel.$render();
        //     };
        // }

        this.$emit('elementSelected', this.propsSelectedElement);
    }

    public getSelectedElementText(): string {
        let text: string = '';

        if ((typeof this.propsSelectedElement == UNDEFINED) && !(typeof this.invite == UNDEFINED)) {
            text = this.invite;
            // } else if (typeof this.propsSelectedElement == UNDEFINED || this.propsSelectedElement == this.nullValueText) {
            //     text = this.nullValueText;
        } else {
            text = this.getElementListText(this.propsSelectedElement);
        }

        return text;
    }

    public getElementListText(element: string): string {
        let text: string = '';

        if (!element) {
            // text = this.nullValueText;
        } else if (this.getTexteElement) {
            text = this.getTexteElement({ element: element });
        }

        if (text.trim().length == 0) {
            text = String(element);
        }

        return text;
    }

    public adjustWidth(): void {
        // Hidden element to calculate width
        let hiddenField: HTMLElement = this.$refs.mDropdownCalculate as HTMLElement;
        // Input or span
        let valueField: HTMLElement = this.$refs.mDropdownValue as HTMLElement;
        // List
        let elements: HTMLElement = this.$refs.mDropdownElements as HTMLElement;

        let width: number = 0;

        if (this.elements && this.elements.length > 0) {
            for (let element of this.elements) {
                width = Math.max(width, this.getTextWidth(hiddenField, this.getElementListText(element)));
            }
        } else {
            width = this.getTextWidth(hiddenField, this.getSelectedElementText());
        }

        // hiddenField.remove();

        width = Math.ceil(width);
        valueField.style.width = width + 'px';
        elements.style.width = width + 'px';
    }

    private getTextWidth(element: HTMLElement, text: string): number {
        element.innerHTML = text;
        return element.offsetWidth;
    }

    private prepareElements(): void {
        let elementsSorted: string[] = new Array();

        if (this.elements) {
            if (this.sort != NO_SORT) {
                // let parameters = this.sort.split(':');
                // elementsSort = this.$filter<Function>(parametres[0])(this.elements, parametres[1], parametres[2]);

                // TODO: Faire le tri
                elementsSorted = this.elements.slice(0);
            } else {
                // Copy the list without sorting
                elementsSorted = this.elements.slice(0);
            }
            // if (this.valeurNullePresente) {
            //     elementsTries.splice(0, 0, this.valeurNulleTexte);
            // }

            // Default element.
            if (typeof this.propsSelectedElement == UNDEFINED) {
                // Invite is priority if present, selectedElement will stay undefined for the invite
                if (typeof this.propsInvite == UNDEFINED) {
                    if (this.nullValueAvailable) {
                        this.propsSelectedElement = this.nullValueText;
                    } else {
                        // No nullValue, no invite => 1st element is selected by default
                        this.propsSelectedElement = this.elements[0];
                    }
                    this.textElement = this.getSelectedElementText();
                } else {
                    this.textElement = this.propsInvite;
                }
            }
        }

        this.elementsSorted = elementsSorted;

        // if (!this.elements || this.elements.length === 0) {
        //     if(elements !== old) {
        //         //Changer seulement si la valeur de elements a changé. Sinon on peut écraser une valeur
        //         //Selectionnée dans des cas ou on a l'element sélectionné avant la liste. (Dans une préférence par exemple)
        //         this.elementSelectionne = null;
        //     }
        //     this.inactif = true;
        // } else {
        //     this.inactif = false;
        // }
    }

    // private filterElements(): Array<string> {
    //     if ((this.textElement == '') || (this.textElement == this.propsInvite) || (this.textElement == this.propsSelectedElement)) {
    //         return this.elementsSorted;
    //     }

    //     let filteredElements: Array<string> = this.elementsSorted.filter((element) => {
    //         return normalizeString(element).match(normalizeString(this.textElement));
    //     });

    //     return filteredElements;
    // }
}

const DropdownPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DROPDOWN_NAME, MDropdown);
    }
};

export default DropdownPlugin;
