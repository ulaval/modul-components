import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './accordion.html?style=./accordion.scss';
import { ACCORDION_NAME } from '../component-names';
import { ACCORDION_GROUP_NAME } from '../component-names';
import { TransitionAccordion, TransitionAccordionMixin } from '../../mixins/transition-accordion/transition-accordion';

const MODE_REGULAR: string = 'regular';
const MODE_LIGHT: string = 'light';
const MODE_NO_STYLE: string = 'no-style';

const ICON_POSITION_LEFT: string = 'left';
const ICON_POSITION_RIGHT: string = 'right';

const ICON_STYLE_DEFAULT: string = 'default';
const ICON_STYLE_BORDER: string = 'border';

const ICON_SIZE_SMALL: string = 'small';
const ICON_SIZE_LARGE: string = 'large';

@WithRender
@Component({
    mixins: [
        TransitionAccordion
    ]
})
export class MAccordion extends Vue implements TransitionAccordionMixin {

    @Prop({ default: MODE_REGULAR })
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
    public animIsActive: boolean = false;

    private propsMode: string = MODE_REGULAR;
    private propsIsOpen: boolean = false;
    private propsIconPosition: string = ICON_POSITION_RIGHT;
    private propsIconStyle: string = ICON_STYLE_DEFAULT;
    private propsIconSize: string = ICON_SIZE_LARGE;
    private eventBus: Vue = new Vue();

    private accordionID: number;

    private beforeMount(): void {
        this.propsMode = this.mode;
        this.propsIsOpen = this.isOpen == undefined ? false : this.isOpen;
        this.propsIconPosition = this.iconPosition;
        this.propsIconSize = this.iconSize;
        this.propsIconStyle = this.iconStyle;
        this.setMode();
    }

    private setMode(): void {
        switch (this.propsMode) {
            case MODE_LIGHT:
                if (this.propsIconPosition == undefined) {
                    this.propsIconPosition = ICON_POSITION_LEFT;
                }
                if (this.propsIconSize == undefined) {
                    this.propsIconSize = ICON_SIZE_SMALL;
                }
                if (this.propsIconStyle == undefined) {
                    this.propsIconStyle = ICON_STYLE_BORDER;
                }
                break;
            case MODE_NO_STYLE:
                this.setModeNoStyle();
                break;
            default:
                if (this.propsIconPosition == undefined) {
                    this.propsIconPosition = ICON_POSITION_RIGHT;
                }
                if (this.propsIconSize == undefined) {
                    this.propsIconSize = ICON_SIZE_LARGE;
                }
                if (this.propsIconStyle == undefined) {
                    this.propsIconStyle = ICON_STYLE_DEFAULT;
                }
        }
    }

    private resetMode(type): void {
        switch (type) {
            case MODE_LIGHT:
                this.propsIconPosition = ICON_POSITION_LEFT;
                this.propsIconSize = ICON_SIZE_SMALL;
                this.propsIconStyle = ICON_STYLE_BORDER;
                break;
            case MODE_NO_STYLE:
                this.setModeNoStyle();
                break;
            default:
                this.propsIconPosition = ICON_POSITION_RIGHT;
                this.propsIconSize = ICON_SIZE_LARGE;
                this.propsIconStyle = ICON_STYLE_DEFAULT;
        }
    }

    private setModeNoStyle(): void {
        if (this.propsIconPosition == undefined) {
            this.propsIconPosition = ICON_POSITION_RIGHT;
        }
        if (this.propsIconSize == undefined) {
            this.propsIconSize = ICON_SIZE_LARGE;
        }
        if (this.propsIconStyle == undefined) {
            this.propsIconStyle = ICON_STYLE_DEFAULT;
        }
    }

    private toggleAccordion(event): void {
        this.animIsActive = true;
        this.propsIsOpen = !this.propsIsOpen;
        this.eventBus.$emit('click', this.accordionID, this.propsIsOpen);
        this.$emit('click', this.accordionID, this.propsIsOpen);
    }

    private openAccordion(): void {
        this.propsIsOpen = true;
    }

    private closeAccordion(): void {
        this.propsIsOpen = false;
    }

    private get modeIsRegular(): boolean {
        if (this.propsMode == MODE_LIGHT || this.propsMode == MODE_NO_STYLE) {
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
