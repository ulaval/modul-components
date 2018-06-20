import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { PAGE_NOT_FOUND_NAME } from '../component-names';
import WithRender from './page-not-found.sandbox.html';

@WithRender
@Component
export class MPageNotFoundSandbox extends Vue {
}

const PageNotFoundSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${PAGE_NOT_FOUND_NAME}-sandbox`, MPageNotFoundSandbox);
    }
};

export default PageNotFoundSandboxPlugin;
