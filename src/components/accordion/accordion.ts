import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './accordion.html?style=./accordion.scss';
import { ACCORDION_NAME, ACCORDION_GROUP_NAME } from '../component-names';
import { TransitionAccordion, TransitionAccordionMixin } from '../../mixins/transition-accordion/transition-accordion';

export enum MAccordionAspect {
    Regular = 'regular',
    Light = 'light',
    NoStyle= 'no-style'
}

export enum MAccordionIconPosition {
    Left = 'left',
    Right = 'right'
}

export enum MAccordionIconAspect {
    Regular = 'regular',
    Light = 'light'
}

export enum MAccordionIconASize {
    Small = 'small',
    Large = 'large'
}

@WithRender
@Component({
    mixins: [TransitionAccordion]
})
export class MAccordion extends Vue implements TransitionAccordionMixin {

    @Prop({ default: MAccordionAspect.Regular })
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
    public propAspect: string = MAccordionAspect.Regular;
    public propOpen: boolean = false;
    public eventBus: Vue = new Vue();
    public id: number;

    private propIconPosition: string = MAccordionIconPosition.Right;
    private propIconAspect: string = MAccordionIconAspect.Light;
    private propIconSize: string = MAccordionIconASize.Large;

    public resetAspect(type): void {
        switch (type) {
            case MAccordionAspect.Light:
                this.propIconPosition = MAccordionIconPosition.Left;
                this.propIconSize = MAccordionIconASize.Small;
                this.propIconAspect = MAccordionIconAspect.Regular;
                break;
            case MAccordionAspect.NoStyle:
                this.setAspectNoStyle();
                break;
            default:
                this.propIconPosition = MAccordionIconPosition.Right;
                this.propIconSize = MAccordionIconASize.Large;
                this.propIconAspect = MAccordionIconAspect.Light;
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
            case MAccordionAspect.Light:
                if (this.propIconPosition == undefined) {
                    this.propIconPosition = MAccordionIconPosition.Left;
                }
                if (this.propIconSize == undefined) {
                    this.propIconSize = MAccordionIconASize.Small;
                }
                if (this.propIconAspect == undefined) {
                    this.propIconAspect = MAccordionIconAspect.Regular;
                }
                break;
            case MAccordionAspect.NoStyle:
                this.setAspectNoStyle();
                break;
            default:
                if (this.propIconPosition == undefined) {
                    this.propIconPosition = MAccordionIconPosition.Right;
                }
                if (this.propIconSize == undefined) {
                    this.propIconSize = MAccordionIconASize.Large;
                }
                if (this.propIconAspect == undefined) {
                    this.propIconAspect = MAccordionIconAspect.Light;
                }
        }
    }

    private setAspectNoStyle(): void {
        if (this.propIconPosition == undefined) {
            this.propIconPosition = MAccordionIconPosition.Right;
        }
        if (this.propIconSize == undefined) {
            this.propIconSize = MAccordionIconASize.Large;
        }
        if (this.propIconAspect == undefined) {
            this.propIconAspect = MAccordionIconAspect.Light;
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
        return this.propAspect == MAccordionAspect.Light || this.propAspect == MAccordionAspect.NoStyle ? false : true;
    }
}

const AccordionPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(ACCORDION_NAME, MAccordion);
    }
};

export default AccordionPlugin;
