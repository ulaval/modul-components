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
    @Prop({ default: false })
    public disabled: boolean;
    // @Prop()
    // public nullValue: string;
    // @Prop({ default: false })
    // public tri: boolean;
    // @Prop({ default: false })
    // public name: boolean;
    // @Prop({ default: false })
    // public formName: boolean;
    @Prop({ default: false })
    public editEnabled: boolean;

    public activeElement: string;

    // Initialize data for v-model to work
    public textElement: string = '';

    public nullValueText: string;
    public nullValueAvailable: boolean;

    @Watch('textElement')
    public textElementChanged(value) {
        console.log(value);
    }

//     @Watch('elements', {immediate: true})
//     private updateList(filtreTexte: string, init: boolean): void {
//         this.updateEnCours = null;

//         var filtreTexteNormalise: string;
//         var elementsTexte: string;
//         var elementsTexteNormalise: string;
//         var elementsFiltre: any = [];

//         // Normalise la chaine de recherche
//         var filtreTexteNormalise = DiacriticUtils.normaliserChaine(filtreTexte);

//         for (let i = 0; i < this.elementsTries.length; i++) {
//             elementsTexte = this.getTexteElementListe(this.elementsTries[i]);
//             elementsTexteNormalise = DiacriticUtils.normaliserChaine(elementsTexte);

//             //if (this.comparerElements(elementsTexte, filtreTexte)) {
//             if (this.comparerElements(elementsTexteNormalise, filtreTexteNormalise)) {
//                 elementsFiltre.push(this.elementsTries[i]);
//             }
//         }

//         this.elementsTriesFiltres = elementsFiltre;
//         if (!init) {
//             this.$scope.$apply();
//         }
//    }

    public get computedElementsCount(): number {
        return this.elements.length;
    }

    public created() {
        console.log(this.elements);
    }

    public mounted() {
        // Copy of the prop to avoid override on re-render
        this.activeElement = this.selectedElement;

        // valeur nulle (choix d'un element facultatif)
        // if (typeof this.nullValue == NON_DEFINI) {
        //     this.nullValueAvailable = false;
        // } else {
            // this.nullValueAvailable = true;
            // if ((this.nullValue.trim().length == 0)) {
            //     this.nullValueText = '(Aucun)';
            // } else {
            //     this.nullValueText = this.nullValue;
            // }
        // }

        // Set width of Popper with the same as Reference

        this.adjustWidth();
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

    public adjustWidth(): void {

        let valueField: Element = this.$refs.mDropdownValue as Element;
        // var div = this.elementHtml.find(ControleurListeDeroulante.CLASSE_CALCUL);
        // var largeur: number = 0;
        // var font = this.creerPolice(div);

        // if (this.elementsTries && this.elementsTries.length > 0) {
        //     for (var index = 0; index < this.elementsTries.length; index++) {
        //         largeur = Math.max(largeur, this.getLargeurTexte(this.getTexteElementListe(this.elementsTries[index]), font));
        //     }
        // } else {
        //     largeur = this.getLargeurTexte(this.getTexteElementSelectionne(), font);
        // }

        // var bouton = this.elementHtml.find(ControleurListeDeroulante.CLASSE_BOUTON);

        // // corps de la liste
        // var corps = this.elementHtml.find(ControleurListeDeroulante.CLASSE_MENU);

        // // var cssMaxWidth = element.parent().css('max-width');
        // //regarder si on a un max-width
        // // if (cssMaxWidth && cssMaxWidth.length > 2) {
        // //     var maxWidth = Number(cssMaxWidth.substring(0, cssMaxWidth.length - 2));
        // // } else {
        // //     this.largeur = largeur;
        // // }
        // // this.largeur = Math.min(maxWidth, largeur);

        // largeur = Math.ceil(largeur);
        // corps.css('width', largeur + 'px');
        // bouton.css('width', largeur + 'px');

        // // if (MpoObjectUtils.isNonDefini(appliquerFondu) || appliquerFondu) {
        // //     this.appliquerFonduTexteSelectionne();
        // // }
    }

    // public preparerListe(elements, old): void {

    //     var elementsTries: any[] = new Array();

    //     if (this.elements) {
    //         if (MpoStringUtils.isVide(this.tri)) {
    //             elementsTries = this.$filter<Function>(NOM_FILTRE_TRIER_PAR)(this.elements);
    //         } else if (this.tri != TRI_AUCUN) {
    //             var parametres = this.tri.split(':');
    //             elementsTries = this.$filter<Function>(parametres[0])(this.elements, parametres[1], parametres[2]);
    //         } else {
    //             //Copie la liste
    //             elementsTries = this.elements.slice(0);
    //         }
    //         if (this.valeurNullePresente) {
    //             elementsTries.splice(0, 0, this.valeurNulleTexte);
    //         }

    //         // element par defaut.

    //         if (MpoObjectUtils.isNonDefini(this.elementSelectionne)) {
    //             //L'invite est prioritaire si presente, elementSelectionne restera undefined pour l'invite
    //             if (MpoObjectUtils.isNonDefiniOuNull(this.invite)) {
    //                 if (this.valeurNullePresente) {
    //                     this.elementSelectionne = this.valeurNulleTexte;
    //                 } else {
    //                     //Pas de valeur nulle, pas d'invite (1er element par defaut)
    //                     this.elementSelectionne = this.elements[0];
    //                 }
    //             }
    //         }
    //     }

    //     this.elementsTries = elementsTries;
    //     this.elementsTriesFiltres = elementsTries;
    //     this.ajusterDimension();

    //     if (!this.elements || this.elements.length === 0) {
    //         if(elements !== old) {
    //             //Changer seulement si la valeur de elements a changé. Sinon on peut écraser une valeur
    //             //Selectionnée dans des cas ou on a l'element sélectionné avant la liste. (Dans une préférence par exemple)
    //             this.elementSelectionne = null;
    //         }
    //         this.inactif = true;
    //     } else {
    //         this.inactif = false;
    //     }
    // }
}

const DropdownPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DROPDOWN_NAME, MDropdown);
    }
};

export default DropdownPlugin;
