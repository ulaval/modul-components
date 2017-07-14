import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './accordion.html?style=./accordion.scss';
import { ACCORDION_NAME } from '../component-names';
import { ACCORDION_GROUP_NAME } from '../component-names';
import { TransitionAccordion, TransitionAccordionMixin } from '../../mixins/transition-accordion/transition-accordion';

const ASPECT_REGULAR: string = 'regular';
const ASPECT_LIGHT: string = 'light';
const ASPECT_NO_STYLE: string = 'no-style';

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

    @Prop({ default: ASPECT_REGULAR })
    public aspect: string;
    @Prop()
    public open: boolean;
    @Prop()
    public iconPosition: string;
    @Prop()
    public iconAspect: string;
    @Prop()
    public iconSize: string;

    public componentName: string = ACCORDION_NAME;
    public isAnimActive: boolean = false;

    private propAspect: string = ASPECT_REGULAR;
    private propOpen: boolean = false;
    private propIconPosition: string = ICON_POSITION_RIGHT;
    private propIconAspect: string = ICON_STYLE_DEFAULT;
    private propIconSize: string = ICON_SIZE_LARGE;
    private eventBus: Vue = new Vue();

    private accordionID: number;

    private beforeMount(): void {
        this.propAspect = this.aspect;
        this.propOpen = this.open == undefined ? false : this.open;
        this.propIconPosition = this.iconPosition;
        this.propIconSize = this.iconSize;
        this.propIconAspect = this.iconAspect;
        this.setAspect();
    }

    private setAspect(): void {
        switch (this.propAspect) {
            case ASPECT_LIGHT:
                if (this.propIconPosition == undefined) {
                    this.propIconPosition = ICON_POSITION_LEFT;
                }
                if (this.propIconSize == undefined) {
                    this.propIconSize = ICON_SIZE_SMALL;
                }
                if (this.propIconAspect == undefined) {
                    this.propIconAspect = ICON_STYLE_BORDER;
                }
                break;
            case ASPECT_NO_STYLE:
                this.setAspectNoStyle();
                break;
            default:
                if (this.propIconPosition == undefined) {
                    this.propIconPosition = ICON_POSITION_RIGHT;
                }
                if (this.propIconSize == undefined) {
                    this.propIconSize = ICON_SIZE_LARGE;
                }
                if (this.propIconAspect == undefined) {
                    this.propIconAspect = ICON_STYLE_DEFAULT;
                }
        }
    }

    private resetAspect(type): void {
        switch (type) {
            case ASPECT_LIGHT:
                this.propIconPosition = ICON_POSITION_LEFT;
                this.propIconSize = ICON_SIZE_SMALL;
                this.propIconAspect = ICON_STYLE_BORDER;
                break;
            case ASPECT_NO_STYLE:
                this.setAspectNoStyle();
                break;
            default:
                this.propIconPosition = ICON_POSITION_RIGHT;
                this.propIconSize = ICON_SIZE_LARGE;
                this.propIconAspect = ICON_STYLE_DEFAULT;
        }
    }

    private setAspectNoStyle(): void {
        if (this.propIconPosition == undefined) {
            this.propIconPosition = ICON_POSITION_RIGHT;
        }
        if (this.propIconSize == undefined) {
            this.propIconSize = ICON_SIZE_LARGE;
        }
        if (this.propIconAspect == undefined) {
            this.propIconAspect = ICON_STYLE_DEFAULT;
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

    private get isAspectRegular(): boolean {
        return this.propAspect == ASPECT_LIGHT || this.propAspect == ASPECT_NO_STYLE ? false : true;
    }
}

const AccordionPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(ACCORDION_NAME, MAccordion);
    }
};

export default AccordionPlugin;
