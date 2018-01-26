import Vue from 'vue';
// import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import WithRender from './viewer.html';
import { MFile } from '../../src/utils/file/file';
import { ModulVue } from '../../src/utils/vue/vue';

@WithRender
@Component
export class Viewer extends ModulVue {
    public tag: string = '';

    public mounted() {
        this.buildTag();
    }

    @Watch('$route')
    private buildTag(): void {
        this.tag = `<${this.$route.meta}></${this.$route.meta}>`;
    }
}
