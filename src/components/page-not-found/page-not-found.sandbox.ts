import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { /* add const NAME to component-names */ } from '../component-names';
import WithRender from './page-not-found.sandbox.html';

const NAME_TO_DELETE: string = 'm-page-not-found'; // to delete

@WithRender
@Component
export class MPageNotFoundSandbox extends Vue {
}

const PageNotFoundSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${NAME_TO_DELETE}-sandbox`, MPageNotFoundSandbox);
    }
};

export default PageNotFoundSandboxPlugin;
