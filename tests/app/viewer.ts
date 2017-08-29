import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import WithRender from './viewer.html';

@WithRender
@Component
export class Viewer extends Vue {
    public tag: string = '';
    public menuOpen: boolean = true;

    public mounted() {
        this.buildTag();
    }

    public toggleMenu(): void {
        this.menuOpen = !this.menuOpen;
    }

    @Watch('$route')
    private buildTag(): void {
        this.tag = `<${this.$route.meta}></${this.$route.meta}>`;
    }
}
