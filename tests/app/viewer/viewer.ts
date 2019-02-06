import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import WithRender from './viewer.html';


@WithRender
@Component
export class Viewer extends Vue {
    public tag: string = '';
    public menuOpen: boolean = false;

    public mounted(): void {
        this.buildTag();
    }

    @Watch('$route')
    private buildTag(): void {

        this.tag = `<m-${this.$route.meta}-sandbox></m-${this.$route.meta}-sandbox>`;
    }
}
