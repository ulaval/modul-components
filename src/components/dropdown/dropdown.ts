import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './dropdown.html?style=./dropdown.scss';
import { DROPDOWN_NAME } from '../component-names';

const NON_DEFINI: string = 'undefined';

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
    // @Prop({ default: false })
    // public inactif: boolean;
    @Prop()
    public nullValue: string;
    // @Prop({ default: false })
    // public tri: boolean;
    // @Prop({ default: false })
    // public name: boolean;
    // @Prop({ default: false })
    // public formName: boolean;
    @Prop({ default: false })
    public saisieActive: boolean;

    public activeElement: string;

    // Initialize data for v-model to work
    public textElement: string = '';

    public nullValueText: string;
    public nullValueAvailable: boolean;

    public get computedElementsCount(): number {
        return this.elements.length;
    }

    public mounted() {
        // Copy of the prop to avoid override on re-render
        this.activeElement = this.selectedElement;

        // valeur nulle (choix d'un element facultatif)
        if (typeof this.nullValue == NON_DEFINI) {
            this.nullValueAvailable = false;
        } else {
            this.nullValueAvailable = true;
            if ((this.nullValue.trim().length == 0)) {
                this.nullValueText = '(Aucun)';
            } else {
                this.nullValueText = this.nullValue;
            }
        }
    }

    public selectElement($event, element: string): void {
        this.activeElement = element;

        console.log(this.activeElement);
        // this.$scope.$emit(EvenementListe.SELECTIONNER_ELEMENT, new EvenementListe.EvenementListeDeroulante(this.elementSelectionne, this.name));
        // this.ouverte = false;

        // Gestion si la liste deroulante est dans un form. Pour les flags touched / valid.
        // if (MpoObjectUtils.isDefini(this.name)) {
        //     if (this.ngModel && typeof this.ngModel == "object") {
        //         this.ngModel.$setTouched();
        //         this.ngModel.$setViewValue(this.elementSelectionne);
        //         this.ngModel.$validate();
        //         this.ngModel.$render();
        //     };
        // }
        this.textElement = this.getActiveElementText();
    }

    public getActiveElementText(): string {
        let text: string = '';

        if ((typeof this.activeElement == NON_DEFINI) && !(typeof this.invite == NON_DEFINI)) {
            text = this.invite;
        } else if (typeof this.activeElement == NON_DEFINI || this.activeElement == this.nullValueText) {
            text = this.nullValueText;
        } else {
            text = this.getElementListText(this.activeElement);
        }

        return text;
    }

    public getElementListText(element: string): string {
        let text: string = '';

        if (!element) {
            text = this.nullValueText;
        } else if (this.getTexteElement) {
            text = this.getTexteElement({ element: element });
        }

        if (text.trim().length == 0) {
            text = String(element);
        }

        return text;
    }
}

const ButtonPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DROPDOWN_NAME, MDropdown);
    }
};

export default ButtonPlugin;
