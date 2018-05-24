import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { FLEX_TEMPLATE_NAME } from '../component-names';
import WithRender from './flex-template.sandbox.html';

@WithRender
@Component
export class MFlexTemplateSandbox extends Vue {
}

const FlexTemplateSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${FLEX_TEMPLATE_NAME}-sandbox`, MFlexTemplateSandbox);
    }
};

export default FlexTemplateSandboxPlugin;
