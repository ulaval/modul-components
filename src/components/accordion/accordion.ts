import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './accordion.html?style=./accordion.scss';
import { ACCORDION_NAME } from '../component-names';

@WithRender
@Component
export class MAccordion extends Vue {

    @Prop({ default: 'regular' })
    public type: string;

    @Prop({ default: false })
    public isOpen: boolean;

    public accordionIsOpen: boolean = false;

    private componentName: string = ACCORDION_NAME;

    public mounted() {
        this.accordionIsOpen = this.isOpen;
    }

    public toggleAccordion() {
        this.accordionIsOpen = !this.accordionIsOpen;
    }

}

const AccordionPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(ACCORDION_NAME, MAccordion);
    }
};

export default AccordionPlugin;
