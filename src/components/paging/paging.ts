import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Model, Prop } from 'vue-property-decorator';
import { PAGING_NAME } from '../component-names';
import WithRender from './paging.html';

@WithRender
@Component
export class MPaging extends Vue {
    @Model('change')
    @Prop()
    public value: number;

    @Prop({ required: true })
    public nbOfItems: number;

    @Prop({ default: 20 })
    public nbOfItemsPerPage: number;

    public get nbOfPage(): number {
        return Math.ceil(this.nbOfItems / this.nbOfItemsPerPage);
    }

    public get firstPageSelected(): boolean {
        return this.value === 1;
    }

    public get lastPageSelected(): boolean {
        return this.value === this.nbOfPage;
    }

    @Emit('change')
    goToPage(value: number): void { }
}

const PagingPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(PAGING_NAME, 'plugin.install');
        v.component(PAGING_NAME, MPaging);
    }
};

export default PagingPlugin;
