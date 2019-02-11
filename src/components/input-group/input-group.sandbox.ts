import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { InputMaxWidth } from '../../mixins/input-width/input-width';
import { INPUT_GROUP_NAME } from '../component-names';
import { MRichTextEditor } from '../rich-text-editor/rich-text-editor';
import TextfieldPlugin from '../textfield/textfield';
import InputGroupPlugin from './input-group';
import WithRender from './input-group.sandbox.html?style=./input-group.sandbox.scss';


@WithRender
@Component({
    components: { MRichTextEditor }
})
export class MInputGroupSandbox extends Vue {

    validMessage: string = '';
    errorMessage: string = '';
    helperMessage: string = '';

    isDisabled: boolean = false;
    isReadonly: boolean = false;
    isWaiting: boolean = false;
    isValid: boolean = false;
    hasError: boolean = false;
    visible: boolean = true;

    nom: string = '';
    prenom: string = '';
    initiale: string = '';

    texteRiche: string = '';
    legumes: string = '';

    get xSmallFormWidth(): string {
        return InputMaxWidth.XSmall;
    }

    get errorMessageNom(): string {
        if (!this.nom) {
            return 'Le nom est obligatoire';
        }
        return '';
    }

    get errorMessagePrenom(): string {
        if (!this.prenom) {
            return 'Le prénom est obligatoire';
        }
        return '';
    }

    valider(): void {
        this.errorMessage = '';
        this.validerNom();
        this.validerPrenom();
    }

    validerNom(): void {
        this.errorMessage = (this.errorMessageNom) ? this.errorMessageNom : this.errorMessage;
    }

    validerPrenom(): void {
        this.errorMessage = (this.errorMessagePrenom) ? this.errorMessagePrenom : this.errorMessage;
    }
}

const InputGroupSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${INPUT_GROUP_NAME}-sandbox`, MInputGroupSandbox);
        v.use(InputGroupPlugin);
        v.use(TextfieldPlugin);
    }
};

export default InputGroupSandboxPlugin;
