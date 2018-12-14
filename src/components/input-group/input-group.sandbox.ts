import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { InputMaxWidth } from '../../mixins';
import { INPUT_GROUP_NAME } from '../component-names';
import { MRichTextEditor } from '../rich-text-editor/rich-text-editor';
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
    }
};

export default InputGroupSandboxPlugin;
