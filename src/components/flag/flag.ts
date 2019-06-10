import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { ModulVue } from '../../utils/vue/vue';
import { FLAG_NAME } from '../component-names';
import WithRender from './flag.html?style=./flag.scss';


@WithRender
@Component
export class MFlag extends ModulVue {

}

const FlagPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(FLAG_NAME, MFlag);
    }
};

export default FlagPlugin;
