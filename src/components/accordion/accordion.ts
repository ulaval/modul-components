import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './accordion.html?style=./accordion.scss';
import { ACCORDION_NAME, ACCORDION_GROUP_NAME } from '../component-names';
import { TransitionAccordion, TransitionAccordionMixin } from '../../mixins/transition-accordion/transition-accordion';

export enum MAccordionAspect {
    REGULAR = 'regular',
    LIGHT = 'light',
    NO_STYLE= 'no-style'
}

export enum MAccordionIconPosition {
    LEFT = 'left',
    RIGHT = 'right'
}

export enum MAccordionIconAspect {
    REGULAR = 'regular',
    LIGHT = 'light'
}

export enum MAccordionIconASize {
    SMALL = 'small',
    LARGE = 'large'
}

@WithRender
@Component({
    mixins: [TransitionAccordion]
})
export class MAccordion extends Vue implements TransitionAccordionMixin {

    @Prop({ default: MAccordionAspect.REGULAR })
    public aspect: MAccordionAspect;
    @Prop()
    public open: boolean;
    @Prop()
    public iconPosition: MAccordionIconPosition;
    @Prop()
    public iconAspect: MAccordionIconAspect;
    @Prop()
    public iconSize: MAccordionIconASize;

    // Variable form TransitionAccordionMixin
    public isAnimActive: boolean = false;

    public componentName: string = ACCORDION_NAME;
    public propAspect: string = MAccordionAspect.REGULAR;
    public propOpen: boolean = false;
    public eventBus: Vue = new Vue();
    public id: number;

    private propIconPosition: string = MAccordionIconPosition.RIGHT;
    private propIconAspect: string = MAccordionIconAspect.LIGHT;
    private propIconSize: string = MAccordionIconASize.LARGE;

    public resetAspect(type): void {
        switch (type) {
            case MAccordionAspect.LIGHT:
                this.propIconPosition = MAccordionIconPosition.LEFT;
                this.propIconSize = MAccordionIconASize.SMALL;
                this.propIconAspect = MAccordionIconAspect.REGULAR;
                break;
            case MAccordionAspect.NO_STYLE:
                this.setAspectNoStyle();
                break;
            default:
                this.propIconPosition = MAccordionIconPosition.RIGHT;
                this.propIconSize = MAccordionIconASize.LARGE;
                this.propIconAspect = MAccordionIconAspect.LIGHT;
        }
    }

    public openAccordion(): void {
        this.propOpen = true;
    }

    public closeAccordion(): void {
        this.propOpen = false;
    }

    protected beforeMount(): void {
        this.propAspect = this.aspect;
        this.propOpen = this.open == undefined ? false : this.open;
        this.propIconPosition = this.iconPosition;
        this.propIconSize = this.iconSize;
        this.propIconAspect = this.iconAspect;
        this.setAspect();
    }

    private setAspect(): void {
        switch (this.propAspect) {
            case MAccordionAspect.LIGHT:
                if (this.propIconPosition == undefined) {
                    this.propIconPosition = MAccordionIconPosition.LEFT;
                }
                if (this.propIconSize == undefined) {
                    this.propIconSize = MAccordionIconASize.SMALL;
                }
                if (this.propIconAspect == undefined) {
                    this.propIconAspect = MAccordionIconAspect.REGULAR;
                }
                break;
            case MAccordionAspect.NO_STYLE:
                this.setAspectNoStyle();
                break;
            default:
                if (this.propIconPosition == undefined) {
                    this.propIconPosition = MAccordionIconPosition.RIGHT;
                }
                if (this.propIconSize == undefined) {
                    this.propIconSize = MAccordionIconASize.LARGE;
                }
                if (this.propIconAspect == undefined) {
                    this.propIconAspect = MAccordionIconAspect.LIGHT;
                }
        }
    }

    private setAspectNoStyle(): void {
        if (this.propIconPosition == undefined) {
            this.propIconPosition = MAccordionIconPosition.RIGHT;
        }
        if (this.propIconSize == undefined) {
            this.propIconSize = MAccordionIconASize.LARGE;
        }
        if (this.propIconAspect == undefined) {
            this.propIconAspect = MAccordionIconAspect.LIGHT;
        }
    }

    private toggleAccordion(): void {
        this.isAnimActive = true;
        this.propOpen = !this.propOpen;
        this.$refs.accordionHeader['blur']();
        this.eventBus.$emit('click', this.id, this.propOpen);
        this.$emit('click', this.id, this.propOpen);
    }

    private get isAspectRegular(): boolean {
        return this.propAspect == MAccordionAspect.LIGHT || this.propAspect == MAccordionAspect.NO_STYLE ? false : true;
    }
}

const AccordionPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(ACCORDION_NAME, MAccordion);
    }
};

export default AccordionPlugin;
