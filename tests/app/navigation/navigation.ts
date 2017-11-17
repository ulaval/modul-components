import { ModulVue } from '../../../src/utils/vue/vue';
import Component from 'vue-class-component';
import WithRender from './navigation.html';
import Meta from '../../../src/meta/meta';

@WithRender
@Component
export class Navigation extends ModulVue {
    public routes: string[] = [];

    private s: string = 'primary';
    private w: boolean = true;
    private m: boolean = false;

    public mounted(): void {
        let meta: string[] = [];
        Meta.getTags().forEach(tag => {
            meta.push(tag);
        });
        this.routes = meta;

        setInterval(() => this.m = false, 5000);
    }
}
