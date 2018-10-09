import Component from 'vue-class-component';

import { ModulVue } from '../../../src/utils/vue/vue';
import { getComponentsNames, getDirectiveNames, getFiltersNames } from '../names-loader';
import WithRender from './navigation.html?style=./navigation.scss';

@WithRender
@Component
export class Navigation extends ModulVue {
    public componentsTag: string[] = [];
    public directivesName: string[] = [];
    public filtersName: string[] = [];

    scrollToTop(): void {
        window.scrollTo(0, 0);
    }

    protected mounted(): void {

        this.componentsTag = getComponentsNames();
        this.directivesName = getDirectiveNames();
        this.filtersName = getFiltersNames();
    }

}
