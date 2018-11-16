import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { TITLE_NAME } from '../component-names';
import WithRender from './title.sandbox.html';


@WithRender
@Component
export class MTitleSandbox extends Vue {
}

const TitleSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${TITLE_NAME}-sandbox`, MTitleSandbox);
    }
};

export default TitleSandboxPlugin;
