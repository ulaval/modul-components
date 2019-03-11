import Component from 'vue-class-component';
import { ModulVue } from '../../../src/utils/vue/vue';
import { getSandboxesNames } from '../sandbox-loader';
import WithRender from './navigation.html?style=./navigation.scss';


@WithRender
@Component
export class Navigation extends ModulVue {
    public sandboxesNames: string[] = [];

    scrollToTop(): void {
        window.scrollTo(0, 0);
    }

    protected mounted(): void {

        this.sandboxesNames = getSandboxesNames();
    }

}
