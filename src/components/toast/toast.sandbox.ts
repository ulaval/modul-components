import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { TOAST } from '../component-names';
import WithRender from './toast.sandbox.html';

@WithRender
@Component
export class MToastSandbox extends Vue {
    private testOpen: boolean = false;
    private testOpenTimeout: boolean = false;
    private positionOpen: boolean = false;
    private offSetOpen: boolean = false;
    private actionOpen: boolean = false;
    private iconOpen: boolean = false;
    private allOpen: boolean = false;

    doSomething(text): void {
        window.alert('Something ' + text + '!');
    }
}

const MToastSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${TOAST}-sandbox`, MToastSandbox);
    }
};

export default MToastSandboxPlugin;
