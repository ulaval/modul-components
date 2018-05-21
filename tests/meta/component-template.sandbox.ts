import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { {{constant}} } from '../component-names';
import WithRender from './{{file}}.sandbox.html';

@WithRender
@Component
export class {{class}}Sandbox extends Vue {
}

const {{plugin}}SandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${{{constant}}}-sandbox`, {{class}}Sandbox);
    }
};

export default {{plugin}}SandboxPlugin;
