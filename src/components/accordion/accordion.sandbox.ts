import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import WithRender from './accordion.sandbox.html';
import { ACCORDION_NAME } from '../component-names';
import { ModulVue } from '../../utils/vue/vue';

@WithRender
@Component
export class MAccordionSandbox extends ModulVue {

    doSomething(text): void {
        window.alert('Something ' + text + '!');
    }
}

const AccordionSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${ACCORDION_NAME}-sandbox`, MAccordionSandbox);
    }
};

export default AccordionSandboxPlugin;
