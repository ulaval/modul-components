import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { ACCORDION_NAME } from '../component-names';
import { MAccordionSkin } from './accordion';
import WithRender from './accordion.sandbox.html';

@WithRender
@Component
export class MAccordionSandbox extends ModulVue {
    accordionOpen: boolean = true;
    accordionSkin: MAccordionSkin = MAccordionSkin.Default;

    get accordionSkinAsArray(): any {
        return MAccordionSkin;
    }

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
        v.component(`${ACCORDION_NAME}-sandbox`, MAccordionSandbox);
    }
};

export default AccordionSandboxPlugin;
