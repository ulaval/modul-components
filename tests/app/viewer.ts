import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

import WithRender from './viewer.html';

@WithRender
@Component
export class Viewer extends Vue {
    public tag: string = '';
    private test: boolean = false;
    private test2: string | undefined = undefined;

    public mounted(): void {
        this.buildTag();
    }

    @Watch('$route')
    private buildTag(): void {
        this.tag = `<${this.$route.meta}></${this.$route.meta}>`;
    }
}
