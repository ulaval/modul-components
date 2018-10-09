import Component from 'vue-class-component';

import Meta from '../../../src/meta/meta';
import { ModulVue } from '../../../src/utils/vue/vue';
import WithRender from './navigation.html?style=./navigation.scss';

@WithRender
@Component
export class Navigation extends ModulVue {
    public routes: string[] = [];
    scrollToTop(): void {
        window.scrollTo(0, 0);
    }

    protected mounted(): void {
        let meta: string[] = [];
        Meta.getTags().forEach(tag => {
            meta.push(tag);
        });
        this.routes = meta;
    }

}
