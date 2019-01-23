import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { TEMPLATE_NAME } from '../component-names';
import WithRender from './template.sandbox.html';
import TemplatePlugin from './template';

@WithRender
@Component
export class MTemplateSandbox extends Vue {
    private hasEntete: boolean = false;

    mounted(): void {
        setTimeout(() => {
            this.hasEntete = true;
        }, 2000);
    }
}

const TemplateSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(TemplatePlugin);
        v.component(`${TEMPLATE_NAME}-sandbox`, MTemplateSandbox);
    }
};

export default TemplateSandboxPlugin;
