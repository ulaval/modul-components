import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import ButtonPlugin from '../button/button';
import { PLUS_NAME } from '../component-names';
import PlusPlugin from './plus';
import WithRender from './plus.sandbox.html';


@WithRender
@Component
export class MPlusSandbox extends Vue {
    private example1Open: boolean = false;
    private exemple1Disabled: boolean = false;
    private exemple1Large: boolean = false;
    private exemple1Border: boolean = false;
    private exemple1SkinLight: boolean = false;

    private exemple1ToggleOpen(): void {
        this.example1Open = !this.example1Open;
    }

    private exemple1ToggleDisabled(): void {
        this.exemple1Disabled = !this.exemple1Disabled;
    }

    private exemple1ToggleLarge(): void {
        this.exemple1Large = !this.exemple1Large;
    }

    private exemple1ToggleBorder(): void {
        this.exemple1Border = !this.exemple1Border;
    }

    private exemple1ToggleSkinLight(): void {
        this.exemple1SkinLight = !this.exemple1SkinLight;
    }
}

const PlusSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(PlusPlugin);
        v.use(ButtonPlugin);
        v.component(`${PLUS_NAME}-sandbox`, MPlusSandbox);
    }
};

export default PlusSandboxPlugin;
