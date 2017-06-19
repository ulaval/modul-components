import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './accordion.html?style=./accordion.scss';
import { ACCORDION_NAME } from '../component-names';
import { ACCORDION_GROUP_NAME } from '../component-names';
import { TransitionAccordionMixin } from '../../mixins/transitionAccordion';

@WithRender
@Component({
    mixins: [
        TransitionAccordionMixin
    ]
})
export class MAccordion extends Vue {

    @Prop({ default: 'regular' })
    public mode: string;
    @Prop()
    public isOpen: boolean;
    @Prop()
    public iconPosition: string;
    @Prop()
    public iconStyle: string;
    @Prop()
    public iconSize: string;

    public componentName: string = ACCORDION_NAME;

    private propsMode: string = 'regular';
    private propsIsOpen: boolean = false;
    private propsIconPosition: string = 'right';
    private propsIconSize: string = 'large';
    private propsIconStyle: string = 'default';

    private animIsActive: boolean = false;
    private accordionID: number;

    private mounted(): void {
        this.propsMode = this.$props.type;
        this.propsIsOpen = this.$props.isOpen == undefined ? false : this.$props.isOpen;
        this.propsIconPosition = this.$props.iconPosition;
        this.propsIconSize = this.$props.iconSize;
        this.propsIconStyle = this.$props.iconStyle;
        this.setType();
    }

    private setType(): void {
        switch (this.propsMode) {
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
            case 'no-style':
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
            case 'no-style':
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

    private get typeIsRegular(): boolean {
        if (this.propsMode == 'light' || this.propsMode == 'noStyle') {
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
