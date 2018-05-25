import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { TEMPLATE_NAME } from '../component-names';
import WithRender from './template.sandbox.html';

@WithRender
@Component
export class MTemplateSandbox extends Vue {
}

const TemplateSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${TEMPLATE_NAME}-sandbox`, MTemplateSandbox);
    }
};

export default TemplateSandboxPlugin;
