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
    private hasRippleEffect: boolean;
    @Prop()
    private iconPosition: string;
    @Prop()
    private iconStyle: string;
    @Prop()
    private iconSize: string;

    private aType: string = 'regular';
    private aIsOpen: boolean = false;
    private aIconPosition: string = 'right';
    private hasRipple: boolean = false;
    private aIconSize: string = 'large';
    private aIconStyle: string = 'default';
    private componentName: string = ACCORDION_NAME;
    private animIsActive: boolean = false;
    private accordionID: number;

    private mounted() {
        this.aType = this.$props.type;
        this.aIsOpen = this.$props.isOpen == undefined ? false : true;
        this.hasRipple = this.$props.hasRippleEffect;
        this.aIconPosition = this.$props.iconPosition;
        this.aIconSize = this.$props.iconSize;
        this.aIconStyle = this.$props.iconStyle;
        this.setType();
    }

    private setType(): void {
        switch (this.aType) {
            case 'light':
                if (this.hasRipple == undefined) {
                    this.hasRipple = false;
                }
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
                if (this.hasRipple == undefined) {
                    this.hasRipple = false;
                }
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
                if (this.hasRipple == undefined) {
                    this.hasRipple = true;
                }
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

    private resetType(type): void {
        switch (this.aType) {
            case 'light':
                this.hasRipple = false;
                this.aIconPosition = 'left';
                this.aIconSize = 'small';
                this.aIconStyle = 'border';
                break;
            case 'noStyle':
                this.hasRipple = false;
                this.aIconPosition = 'right';
                this.aIconSize = 'large';
                this.aIconStyle = 'default';
                break;
            default:
                this.hasRipple = true;
                this.aIconPosition = 'right';
                this.aIconSize = 'large';
                this.aIconStyle = 'default';
        }
    }

    private toggleAccordion(event): void {
        this.animIsActive = true;
        this.aIsOpen = !this.aIsOpen;
        if (this.$parent['componentName'] == ACCORDION_GROUP_NAME) {
            this.$parent['checkToggleAccordion'](this.accordionID, this.aIsOpen);
        }
        event.preventDefault();
    }

    private openAccordion(): void {
        this.aIsOpen = true;
    }

    private closeAccordion(): void {
        this.aIsOpen = false;
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
}

const AccordionPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(ACCORDION_NAME, MAccordion);
    }
};

export default AccordionPlugin;
