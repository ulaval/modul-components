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
    public open: boolean;
    @Prop()
    public iconPosition: string;
    @Prop()
    public iconStyle: string;
    @Prop()
    public iconSize: string;

    public componentName: string = ACCORDION_NAME;
    public isAnimActive: boolean = false;

    private propMode: string = MODE_REGULAR;
    private propOpen: boolean = false;
    private propIconPosition: string = ICON_POSITION_RIGHT;
    private propIconStyle: string = ICON_STYLE_DEFAULT;
    private propIconSize: string = ICON_SIZE_LARGE;
    private eventBus: Vue = new Vue();

    private accordionID: number;

    private beforeMount(): void {
        this.propMode = this.mode;
        this.propOpen = this.open == undefined ? false : this.open;
        this.propIconPosition = this.iconPosition;
        this.propIconSize = this.iconSize;
        this.propIconStyle = this.iconStyle;
        this.setMode();
    }

    private setMode(): void {
        switch (this.propMode) {
            case MODE_LIGHT:
                if (this.propIconPosition == undefined) {
                    this.propIconPosition = ICON_POSITION_LEFT;
                }
                if (this.propIconSize == undefined) {
                    this.propIconSize = ICON_SIZE_SMALL;
                }
                if (this.propIconStyle == undefined) {
                    this.propIconStyle = ICON_STYLE_BORDER;
                }
                break;
            case MODE_NO_STYLE:
                this.setModeNoStyle();
                break;
            default:
                if (this.propIconPosition == undefined) {
                    this.propIconPosition = ICON_POSITION_RIGHT;
                }
                if (this.propIconSize == undefined) {
                    this.propIconSize = ICON_SIZE_LARGE;
                }
                if (this.propIconStyle == undefined) {
                    this.propIconStyle = ICON_STYLE_DEFAULT;
                }
        }
    }

    private resetMode(type): void {
        switch (type) {
            case MODE_LIGHT:
                this.propIconPosition = ICON_POSITION_LEFT;
                this.propIconSize = ICON_SIZE_SMALL;
                this.propIconStyle = ICON_STYLE_BORDER;
                break;
            case MODE_NO_STYLE:
                this.setModeNoStyle();
                break;
            default:
                this.propIconPosition = ICON_POSITION_RIGHT;
                this.propIconSize = ICON_SIZE_LARGE;
                this.propIconStyle = ICON_STYLE_DEFAULT;
        }
    }

    private setModeNoStyle(): void {
        if (this.propIconPosition == undefined) {
            this.propIconPosition = ICON_POSITION_RIGHT;
        }
        if (this.propIconSize == undefined) {
            this.propIconSize = ICON_SIZE_LARGE;
        }
        if (this.propIconStyle == undefined) {
            this.propIconStyle = ICON_STYLE_DEFAULT;
        }
    }

    private toggleAccordion(event): void {
        this.isAnimActive = true;
        this.propOpen = !this.propOpen;
        this.$refs.accordionHeader['blur']();
        this.eventBus.$emit('click', this.accordionID, this.propOpen);
        this.$emit('click', this.accordionID, this.propOpen);
    }

    private openAccordion(): void {
        this.propOpen = true;
    }

    private closeAccordion(): void {
        this.propOpen = false;
    }

    private get modeIsRegular(): boolean {
        if (this.propMode == MODE_LIGHT || this.propMode == MODE_NO_STYLE) {
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
