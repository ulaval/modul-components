import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import ButtonPlugin from '../button/button';
import { LINK_NAME } from '../component-names';
import LinkPlugin from './link';
import WithRender from './link.sandbox.html';

@WithRender
@Component
export class MLinkSandbox extends Vue {
    public routerLinkDisabled: boolean = false;
}

const LinkSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(LinkPlugin);
        v.use(ButtonPlugin);
        v.component(`${LINK_NAME}-sandbox`, MLinkSandbox);
    }
};

export default LinkSandboxPlugin;
