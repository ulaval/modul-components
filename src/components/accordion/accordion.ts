import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './accordion.html?style=./accordion.scss';
import { ACCORDION_NAME } from '../component-names';
import { ACCORDION_GROUP_NAME } from '../component-names';

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

    private aIsOpen: boolean = false;
    private aIconPosition: string = 'right';
    private aIconSize: string = 'large';
    private aIconStyle: string = 'default';
    private componentName: string = ACCORDION_NAME;
    private animIsActive: boolean = false;
    private accordionID: number;

    private mounted() {
        this.aIsOpen = this.$props.isOpen == undefined ? false : true;
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
                if (this.aIconStyle == undefined) {
                    this.aIconStyle = 'default';
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
        this.animIsActive = true;
        this.aIsOpen = !this.aIsOpen;
        if (this.$parent['componentName'] == ACCORDION_GROUP_NAME) {
            this.$parent['checkToggleAccordion'](this.accordionID, this.aIsOpen);
        }
        event.preventDefault();
    }

    private openAccordion() {
        this.aIsOpen = true;
    }

    private closeAccordion() {
        this.aIsOpen = false;
    }

    private animEnter(el, done) {
        if (this.animIsActive) {
            let height: number = el.clientHeight;
            el.style.maxHeight = '0';
            setTimeout(() => {
                el.style.maxHeight = height + 'px';
                done();
            }, 2);
        } else {
            done();
        }
    }

    private animAfterEnter(el) {
        if (this.animIsActive) {
            setTimeout(() => {
                el.style.maxHeight = 'none';
            }, 300);
        }
    }

    private animLeave(el, done) {
        if (this.animIsActive) {
            let height: number = el.clientHeight;
            el.style.maxHeight = height + 'px';
            setTimeout(() => {
                el.style.maxHeight = '0';
            }, 0);
            setTimeout(() => {
                done();
            }, 300);
        } else {
            done();
        }
    }
}

const AccordionPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(ACCORDION_NAME, MAccordion);
    }
};

export default AccordionPlugin;
