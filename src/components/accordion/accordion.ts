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
    @Prop()
    private isOpen: boolean;
    @Prop()
    private iconPosition: string;
    @Prop()
    private iconStyle: string;
    @Prop()
    private iconSize: string;

    private accordionIsOpen: boolean = false;
    private aIconPosition: string = 'right';
    private aIconSize: string = 'large';
    private aIconStyle: string = 'default';
    private componentName: string = ACCORDION_NAME;

    private mounted() {
        this.accordionIsOpen = this.$props.isOpen;
        this.aIconPosition = this.$props.iconPosition;
        this.aIconSize = this.$props.iconSize;
        this.aIconStyle = this.$props.iconStyle;

        switch (this.$props.type) {
        case 'light':
            if (this.aIconPosition == undefined) {
                this.aIconPosition = 'left';
            }
            if (this.aIconSize == undefined) {
                this.aIconSize = 'small';
            }
            if (this.aIconStyle == undefined) {
                this.aIconStyle = 'border';
            }
            break;
        case 'noStyle':
            if (this.aIconPosition == undefined) {
                this.aIconPosition = 'right';
            }
            if (this.aIconSize == undefined) {
                this.aIconSize = 'large';
            }
            if (this.aIconStyle== undefined) {
                this.aIconStyle= 'default';
            }
            break;
        default:
            if (this.aIconPosition == undefined) {
                this.aIconPosition = 'right';
            }
            if (this.aIconSize == undefined) {
                this.aIconSize = 'large';
            }
            if (this.aIconStyle == undefined) {
                this.aIconStyle = 'default';
            }
        }
    }

    private toggleAccordion(event) {
        this.accordionIsOpen = !this.accordionIsOpen;
        if (this.$parent.$options._componentTag == 'm-accordion-group') {
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

    private animEnter(el, done) {
        let height: number = el.clientHeight;
        el.style.maxHeight = '0';
        setTimeout (() => {
            el.style.maxHeight = height + 'px';
            done();
        }, 2);

    }

    private animAfterEnter(el) {
        setTimeout (() => {
            el.style.maxHeight = 'none';
        }, 300);
    }

    private animLeave(el, done) {
        let height: number = el.clientHeight;
        el.style.maxHeight = height + 'px';
        setTimeout (() => {
            el.style.maxHeight = '0';
        }, 0);
        setTimeout (() => {
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
