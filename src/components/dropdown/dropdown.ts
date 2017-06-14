import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './dropdown.html?style=./dropdown.scss';
import { DROPDOWN_NAME } from '../component-names';

@WithRender
@Component
export class MDropdown extends Vue {

    @Prop({ default: [] })
    public elements: string[];
    // @Prop({ default: false })
    // public elementSelectionne: boolean;
    // @Prop({ default: false })
    // public getTexteElement: boolean;
    @Prop()
    public invite: string;
    // @Prop({ default: false })
    // public inactif: boolean;
    // @Prop({ default: false })
    // public valeurNulle: boolean;
    // @Prop({ default: false })
    // public tri: boolean;
    // @Prop({ default: false })
    // public name: boolean;
    // @Prop({ default: false })
    // public formName: boolean;
    // @Prop({ default: false })
    // public saisieActive: boolean;

    public data: string;

    get computedElementsCount(): number {
        return this.elements.length;
    }

}

const ButtonPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DROPDOWN_NAME, MDropdown);
    }
};

export default ButtonPlugin;
