import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import ButtonPlugin from '../button/button';
import { OVERLAY_NAME } from '../component-names';
import OptionPlugin from '../option/option';
import TextfieldPlugin from '../textfield/textfield';
import OverlayPlugin from './overlay';
import WithRender from './overlay.sandbox.html';


@WithRender
@Component
export class MOverlaySandbox extends Vue {
    waiting: boolean = false;

    private toggleWaiting(): void {
        this.waiting = !this.waiting;
    }
}

const OverlaySandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(TextfieldPlugin);
        v.use(ButtonPlugin);
        v.use(OptionPlugin);

        v.use(OverlayPlugin);
        v.component(`${OVERLAY_NAME}-sandbox`, MOverlaySandbox);
    }
};

export default OverlaySandboxPlugin;
