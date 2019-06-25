import Component from 'vue-class-component';
import { ModulVue } from '../../../src/utils/vue/vue';
import WithRender from './welcome.html?style=./welcome.scss';

@WithRender
@Component
export class Welcome extends ModulVue {

}
