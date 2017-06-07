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
    private type: string;

    @Prop({ default: false })
    private isOpen: boolean;

    private accordionIsOpen: boolean = false;

    public componentName: string = ACCORDION_NAME;

    private mounted() {
        this.accordionIsOpen = this.isOpen;
    }

    private toggleAccordion(event) {
        this.accordionIsOpen = !this.accordionIsOpen;
        if(this.$parent.$options._componentTag == 'm-accordion-group') {
            this.$parent.toggleAccordion();
        }
        event.preventDefault();
    }

    private openAccordion() {
        this.accordionIsOpen = true;
    }

    private closeAccordion() {
        this.accordionIsOpen = false;
    }

    private animationEnter(el, done) {
        let height: number = el.clientHeight;
        el.style.maxHeight = '0';
        setTimeout(()=> {
            el.style.maxHeight = height + 'px';
            done();
        }, 2);

    }

    private animationAfterEnter(el) {
        setTimeout(()=> {
            el.style.maxHeight = 'none';
        }, 300);
    }

    private animationLeave(el, done) {
        let height: number = el.clientHeight;
        el.style.maxHeight = height + 'px';
        setTimeout(()=> {
            el.style.maxHeight = '0';
        }, 0);
        setTimeout(()=> {
            done();
        }, 300);
    }

}

const AccordionPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(ACCORDION_NAME, MAccordion);
    }
};

export default AccordionPlugin;
