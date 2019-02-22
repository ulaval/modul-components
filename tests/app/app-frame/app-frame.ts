import Component from 'vue-class-component';
import { ModulVue } from '../../../src/utils/vue/vue';
import WithRender from './app-frame.html?style=./app-frame.scss';


@WithRender
@Component
export class AppFrame extends ModulVue {

}
