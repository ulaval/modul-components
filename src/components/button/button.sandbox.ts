import Vue, { PluginObject } from 'vue';
import { Component, Emit } from 'vue-property-decorator';
import { BUTTON_NAME } from '../component-names';
import ButtonPlugin from './button';
import WithRender from './button.sandbox.html';


@WithRender
@Component
export class MButtonSandbox extends Vue {
    afficherbouton1: boolean = false;
    messageInialValue: string = 'Mon message';
    message: string = this.messageInialValue;

    toogleAfficher(): void {
        this.afficherbouton1 = !this.afficherbouton1;
    }

    get libelle(): string {
        return 'patate';
    }

    @Emit('submit')
    submit(event: Event): void {
        alert(this.message);
    }

    @Emit('reset')
    reset(event: Event): void {
        this.message = this.messageInialValue;
    }
}

const ButtonSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(ButtonPlugin);
        v.component(`${BUTTON_NAME}-sandbox`, MButtonSandbox);
    }
};

export default ButtonSandboxPlugin;
