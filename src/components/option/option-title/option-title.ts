import Component from 'vue-class-component';
import { ModulVue } from '../../../utils/vue/vue';
import { BaseOption } from '../option';
import WithRender from './option-title.html?style=./option-title.scss';


@WithRender
@Component
export class MOptionTitle extends ModulVue {

    protected mounted(): void {
        let rootNode: BaseOption | undefined = this.getParent<BaseOption>(p => p instanceof BaseOption);

        if (rootNode === undefined) {
            console.error('m-option-item need to be inside m-option');
        }
    }
}
