import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { InputMaxWidth } from '../../mixins';
import { INPUT_GROUP_NAME } from '../component-names';
import WithRender from './input-group.sandbox.html?style=./input-group.sandbox.scss';


@WithRender
@Component
export class MInputGroupSandbox extends Vue {

    errors: string[] = [
        'First error',
        'Second error'
    ];

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

    get xSmallFormWidth(): string {
        return InputMaxWidth.XSmall;
    }
    valider(): void {
        this.errorMessage = '';
        this.validerNom();
        this.validerPrenom();
    }

    validerNom(): void {
        if (!this.nom) {
            this.errorMessage = 'Le nom est obligatoire';
        }
    }

    validerPrenom(): void {
        if (!this.prenom) {
            this.errorMessage = 'Le prénom est obligatoire';
        }
    }
}

const InputGroupSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${INPUT_GROUP_NAME}-sandbox`, MInputGroupSandbox);
    }
};

export default InputGroupSandboxPlugin;
