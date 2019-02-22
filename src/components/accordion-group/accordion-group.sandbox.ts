import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ACCORDION_GROUP_NAME } from '../component-names';
import AccordionGroupPlugin from './accordion-group';
import WithRender from './accordion-group.sandbox.html';



@WithRender
@Component
export class MAccordionGroupSandbox extends Vue {
}

const AccordionGroupSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(AccordionGroupPlugin);
        v.component(`${ACCORDION_GROUP_NAME}-sandbox`, MAccordionGroupSandbox);
    }
};

export default AccordionGroupSandboxPlugin;
