import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { SHOW_MORE_NAME } from '../component-names';
import { MProgressSkin } from '../progress/progress';
import ShowMorePlugin from './show-more';
import WithRender from './show-more.sandbox.html';

@WithRender
@Component
export class MShowMoreSandbox extends Vue {
    data: number[] = [];
    total: number = 20;
    totalZero: number = 0;
    loading: boolean = false;
    skin: MProgressSkin = MProgressSkin.Monochrome;

    fetchData(): void {
        if (this.data.length < this.total) {
            setTimeout(() => {
                this.data.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
                this.loading = false;
            }, 1000);
        }
    }
}

const ShowMoreSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(ShowMorePlugin);
        v.component(`${SHOW_MORE_NAME}-sandbox`, MShowMoreSandbox);
    }
};

export default ShowMoreSandboxPlugin;
