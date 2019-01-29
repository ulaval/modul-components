import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import ButtonPlugin from '../button/button';
import { OPTION_NAME } from '../component-names';
import OverlayPlugin from '../overlay/overlay';
import OptionPlugin from './option';
import WithRender from './option.sandbox.html';


@WithRender
@Component
export class MOptionSandbox extends ModulVue {
    private doAdd(): void {
        alert('Add clicked');
    }
}

const OptionSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(OverlayPlugin);
        v.use(ButtonPlugin);
        v.use(OptionPlugin);

        v.component(`${OPTION_NAME}-sandbox`, MOptionSandbox);
    }
};

export default OptionSandboxPlugin;
