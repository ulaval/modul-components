import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { PAGINATION_NAME } from '../component-names';
import IconButtonPlugin from '../icon-button/icon-button';
import PaginationPlugin from './pagination';
import WithRender from './pagination.sandbox.html';


@WithRender
@Component
export class MPaginationSandbox extends Vue {
    public currentPage: number = 1;
    public currentSinglePage: number = 1;
    public loading: boolean = false;

    public simulateBackEndCall(): void {
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
        }, 700);
    }
}

const PaginationSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(PaginationPlugin);
        v.use(IconButtonPlugin);

        v.component(`${PAGINATION_NAME}-sandbox`, MPaginationSandbox);
    }
};

export default PaginationSandboxPlugin;
