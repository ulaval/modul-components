import Component from 'vue-class-component';
import { ModulVue } from '../../../src/utils/vue/vue';
import { getDirectiveNames, getFiltersNames, getUtilsNames } from '../names-loader';
import { getSandboxesNames } from '../sandbox-loader';
import WithRender from './navigation.html?style=./navigation.scss';


@WithRender
@Component
export class Navigation extends ModulVue {
    public sandboxesNames: string[] = [];
    public directivesName: string[] = [];
    public filtersName: string[] = [];
    public utilsNames: string[] = [];

    scrollToTop(): void {
        window.scrollTo(0, 0);
    }

    protected mounted(): void {

        this.sandboxesNames = getSandboxesNames();
        this.directivesName = getDirectiveNames();
        this.filtersName = getFiltersNames();
        this.utilsNames = getUtilsNames();
    }

}
