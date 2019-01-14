import Vue, { PluginObject } from 'vue';
import { Component, Emit } from 'vue-property-decorator';
import { toArray } from '../../utils/enum/enum';
import { BUTTON_NAME } from '../component-names';
import { MButtonIconPosition, MButtonSkin, MButtonType } from './button';
import WithRender from './button.sandbox.html';

@WithRender
@Component
export class MButtonSandbox extends Vue {
    afficherbouton1: boolean = false;
    messageInialValue: string = 'Mon message';
    message: string = this.messageInialValue;

    private buttonType: MButtonType = MButtonType.Button;
    private buttonSkin: MButtonSkin = MButtonSkin.Primary;
    private buttonIconPosition: MButtonIconPosition = MButtonIconPosition.Left;

    toogleAfficher(): void {
        this.afficherbouton1 = !this.afficherbouton1;
    }

    get libelle(): string {
        return 'texte 1';
    }

    get buttonTypeToArray(): { key: string | number, value: string }[] {
        return toArray(MButtonType);
    }

    get buttonSkinToArray(): { key: string | number, value: string }[] {
        return toArray(MButtonSkin);
    }

    get buttonIconPositionToArray(): { key: string | number, value: string }[] {
        return toArray(MButtonIconPosition);
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
        v.component(`${BUTTON_NAME}-sandbox`, MButtonSandbox);
    }
};

export default ButtonSandboxPlugin;
