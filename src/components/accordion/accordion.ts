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

    private propsType: string = 'regular';
    private propsIsOpen: boolean = false;
    private propsIconPosition: string = 'right';
    private propsIconSize: string = 'large';
    private propsIconStyle: string = 'default';
    private componentName: string = ACCORDION_NAME;
    private animIsActive: boolean = false;
    private accordionID: number;

    private mounted(): void {
        this.propsType = this.$props.type;
        this.propsIsOpen = this.$props.isOpen == undefined ? false : true;
        this.propsIconPosition = this.$props.iconPosition;
        this.propsIconSize = this.$props.iconSize;
        this.propsIconStyle = this.$props.iconStyle;
        this.setType();
    }

    private setType(): void {
        switch (this.propsType) {
            case 'light':
                if (this.propsIconPosition == undefined) {
                    this.propsIconPosition = 'left';
                }
                if (this.propsIconSize == undefined) {
                    this.propsIconSize = 'small';
                }
                if (this.propsIconStyle == undefined) {
                    this.propsIconStyle = 'border';
                }
                break;
            case 'noStyle':
                if (this.propsIconPosition == undefined) {
                    this.propsIconPosition = 'right';
                }
                if (this.propsIconSize == undefined) {
                    this.propsIconSize = 'large';
                }
                if (this.propsIconStyle == undefined) {
                    this.propsIconStyle = 'default';
                }
                break;
            default:
                if (this.propsIconPosition == undefined) {
                    this.propsIconPosition = 'right';
                }
                if (this.propsIconSize == undefined) {
                    this.propsIconSize = 'large';
                }
                if (this.propsIconStyle == undefined) {
                    this.propsIconStyle = 'default';
                }
        }
    }

    private resetType(type): void {
        switch (type) {
            case 'light':
                this.propsIconPosition = 'left';
                this.propsIconSize = 'small';
                this.propsIconStyle = 'border';
                break;
            case 'noStyle':
                if (this.propsIconPosition == undefined) {
                    this.propsIconPosition = 'right';
                }
                if (this.propsIconSize == undefined) {
                    this.propsIconSize = 'large';
                }
                if (this.propsIconStyle == undefined) {
                    this.propsIconStyle = 'default';
                }
                break;
            default:
                this.propsIconPosition = 'right';
                this.propsIconSize = 'large';
                this.propsIconStyle = 'default';
        }
    }

    private toggleAccordion(event): void {
        this.animIsActive = true;
        this.propsIsOpen = !this.propsIsOpen;
        if (this.$parent['componentName'] == ACCORDION_GROUP_NAME) {
            this.$parent['checkToggleAccordion'](this.accordionID, this.propsIsOpen);
        }
        event.preventDefault();
    }

    private openAccordion(): void {
        this.propsIsOpen = true;
    }

    private closeAccordion(): void {
        this.propsIsOpen = false;
    }

    private animEnter(el, done): void {
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

    private animAfterEnter(el): void {
        if (this.animIsActive) {
            setTimeout(() => {
                el.style.maxHeight = 'none';
            }, 300);
        }
    }

    private animLeave(el, done): void {
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

    private get typeIsRegular(): boolean {
        if (this.propsType == 'light' || this.propsType == 'noStyle') {
            return false;
        }
        return true;
    }
}

const AccordionPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(ACCORDION_NAME, MAccordion);
    }
};

export default AccordionPlugin;
