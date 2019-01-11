import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import ButtonPlugin from '../button/button';
import { ACCORDION_NAME } from '../component-names';
import AccordionPlugin from './accordion';
import WithRender from './accordion.sandbox.html';


@WithRender
@Component
export class MAccordionSandbox extends ModulVue {

    accordionOpen: boolean = true;

    doSomething(text): void {
        window.alert('Something ' + text + '!');
    }

    onAccordionOpen(status): void {
        window.alert(`isAccordionOpen = ${status}`);
    }

    onClick(event, astring): void {
        window.alert(`onClick event = ${event} astring=${astring}`);
    }

    toggleAccordion(): void {
        this.accordionOpen = !this.accordionOpen;
    }
}

const AccordionSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(ButtonPlugin);
        v.use(AccordionPlugin);
        v.component(`${ACCORDION_NAME}-sandbox`, MAccordionSandbox);
    }
};

export default AccordionSandboxPlugin;
