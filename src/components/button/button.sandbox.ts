import Vue, { PluginObject } from 'vue';
import { Component, Emit } from 'vue-property-decorator';
import { BUTTON_NAME } from '../component-names';
import { MButtonIconPosition, MButtonSkin, MButtonType } from './button';
import WithRender from './button.sandbox.html';

@WithRender
@Component
export class MButtonSandbox extends Vue {
    displayButton1: boolean = false;
    messageInialValue: string = 'Your message';
    message: string = this.messageInialValue;
    buttonType: MButtonType = MButtonType.Button;
    buttonSkin: MButtonSkin = MButtonSkin.Primary;
    buttonIconPosition: MButtonIconPosition = MButtonIconPosition.Left;

    toggleDisplay(): void {
        this.displayButton1 = !this.displayButton1;
    }

    get libelle(): string {
        return 'text 1';
    }

    get buttonTypeToArray(): any {
        return MButtonType;
    }

    get buttonSkinToArray(): any {
        return MButtonSkin;
    }

    get buttonIconPositionToArray(): any {
        return MButtonIconPosition;
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
