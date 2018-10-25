import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { BUTTON_NAME } from '../component-names';
import WithRender from './button.sandbox.html';

@WithRender
@Component
export class MButtonSandbox extends Vue {
    afficherbouton1: boolean = false;

    toogleAfficher(): void {
        this.afficherbouton1 = !this.afficherbouton1;
    }

    get libelle(): string {
        return 'patate';
    }
}

const ButtonSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${BUTTON_NAME}-sandbox`, MButtonSandbox);
    }
};

export default ButtonSandboxPlugin;
