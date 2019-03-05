/* tslint:disable:no-console */
import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { SCROLL_SPY_NAME } from '../directive-names';
import ScrollSpyPlugin from './scroll-spy';
import WithRender from './scroll-spy.sandbox.html?style=./scroll-spy.sandbox.scss';


@WithRender
@Component
export class MScrollSpySandbox extends ModulVue {

    idSection1: string = 'section1';
    idSection2: string = 'section2';
    idSection3: string = 'section3';
    idSection4: string = 'section4';

}

const ScrollSpySandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(ScrollSpyPlugin);
        v.component(`${SCROLL_SPY_NAME}-sandbox`, MScrollSpySandbox);
    }
};

export default ScrollSpySandboxPlugin;
