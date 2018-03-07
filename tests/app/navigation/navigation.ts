import { ModulVue } from '../../../src/utils/vue/vue';
import Component from 'vue-class-component';
import WithRender from './navigation.html';
import Meta from '../../../src/meta/meta';

@WithRender
@Component
export class Navigation extends ModulVue {
    public routes: string[] = [];

    private a = 'item2';

    get testSelected() {
        return this.a;
    }

    protected mounted(): void {
        let meta: string[] = [];
        Meta.getTags().forEach(tag => {
            meta.push(tag);
        });
        this.routes = meta;
        setTimeout(() => {
            this.a = 'item3';
        }, 2000);
    }
}
