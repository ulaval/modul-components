import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { DYNAMIC_TEMPLATE_NAME } from '../component-names';
import WithRender from './dynamic-template.sandbox.html';

@WithRender
@Component
export class MDynamicTemplateSandbox extends Vue {
}

const DynamicTemplateSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${DYNAMIC_TEMPLATE_NAME}-sandbox`, MDynamicTemplateSandbox);
    }
};

export default DynamicTemplateSandboxPlugin;
