import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { TOOLTIP_NAME } from '../component-names';
import WithRender from './tooltip.sandbox.html';
import TooltipPlugin from './tooltip';

@WithRender
@Component
export class MTooltipSandbox extends Vue {
}

const TooltipSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(TooltipPlugin);
        v.component(`${TOOLTIP_NAME}-sandbox`, MTooltipSandbox);
    }
};

export default TooltipSandboxPlugin;
