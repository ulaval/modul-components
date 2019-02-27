import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { PAGING_NAME } from '../component-names';
import IconButtonPlugin from '../icon-button/icon-button';
import PagingPlugin from './paging';
import WithRender from './paging.sandbox.html';


@WithRender
@Component
export class MPagingSandbox extends Vue {
    public currentPage: number = 1;
    public currentSinglePage: number = 1;
    public loading: boolean = false;

    public simulateBackEndCall(): void {
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
        }, 2000);
    }
}

const PagingSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(PagingPlugin);
        v.use(IconButtonPlugin);

        v.component(`${PAGING_NAME}-sandbox`, MPagingSandbox);
    }
};

export default PagingSandboxPlugin;
