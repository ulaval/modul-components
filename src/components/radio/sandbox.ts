import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import WithRender from './sandbox.html';

@WithRender
@Component
export class RadioSandbox extends Vue {
    public someData: number = 1;
}

const RadioSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        // tslint:disable-next-line:no-console
        console.log('The name of my sandbox', RadioSandbox.name);
        v.component(RadioSandbox.name, RadioSandbox);
    }
};

export default RadioSandboxPlugin;
