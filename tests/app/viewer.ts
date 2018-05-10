import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

import WithRender from './viewer.html';

@WithRender
@Component
export class Viewer extends Vue {
    public tag: string = '';

    public mounted(): void {
        this.buildTag();
    }

    @Watch('$route')
    private buildTag(): void {
        if (this.$options && this.$options.components && !this.$options.components[`${this.$route.meta}-sandbox`]) {
            this.tag = '<div>No sandbox yet for this component.  Come back later.</div>';
        } else {
            this.tag = `<${this.$route.meta}-sandbox></${this.$route.meta}-sandbox>`;
        }
    }
}
