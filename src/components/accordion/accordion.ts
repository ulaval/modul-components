import Vue from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './accordion.html?style=./accordion.scss';
import { ACCORDION_NAME, ACCORDION_GROUP_NAME } from '../component-names';
import { MAccordionGroup } from '../accordion-group/accordion-group';
import { TransitionAccordion, TransitionAccordionMixin } from '../../mixins/transition-accordion/transition-accordion';

export enum MAccordionSkin {
    Regular = 'regular',
    Light = 'light',
    Vanilla = 'vanilla'
}

export enum MAccordionIconPosition {
    Left = 'left',
    Right = 'right'
}

export enum MAccordionIconSkin {
    Regular = 'regular',
    Light = 'light'
}

export enum MAccordionIconSize {
    Small = 'small',
    Large = 'large'
}

@WithRender
@Component({
    mixins: [TransitionAccordion]
})
export class MAccordion extends ModulVue {

    @Prop({ default: false })
    public open: boolean;

    @Prop({ default: MAccordionSkin.Regular })
    public skin: MAccordionSkin;

    @Prop()
    public iconPosition: MAccordionIconPosition;

    @Prop()
    public iconSkin: MAccordionIconSkin;

    @Prop()
    public iconSize: MAccordionIconSize;

    public componentName: string = ACCORDION_NAME;
    public id: number;
    private internalPropOpen: boolean = this.open;

    @Watch('open')
    public updateOpen(open: boolean): void {
        this.isOpen = this.open;
    }

    public get isOpen(): boolean {
        return this.internalPropOpen;
    }

    public set isOpen(value) {
        this.$emit('input', value);
        this.internalPropOpen = value;
    }

    private get propSkin() {
        return this.$parent instanceof MAccordionGroup ? this.$parent.skin : this.skin;
    }

    private get propIconPosition(): MAccordionIconPosition {
        if (this.propSkin == MAccordionSkin.Light) {
            return this.iconPosition || MAccordionIconPosition.Left;
        }
        return this.iconPosition || MAccordionIconPosition.Right;
    }

    private get propIconSize(): MAccordionIconSize {
        if (this.propSkin == MAccordionSkin.Light) {
            return this.iconSize || MAccordionIconSize.Small;
        }
        return this.iconSize || MAccordionIconSize.Large;
    }

    private get propIconSkin(): MAccordionIconSkin {
        if (this.propSkin == MAccordionSkin.Light) {
            return this.iconSkin || MAccordionIconSkin.Regular;
        }
        return this.iconSkin || MAccordionIconSkin.Light;
    }

    public setIsAnimActive(value: boolean): void {
        this.as<TransitionAccordionMixin>().isAnimActive = value;
    }

    private toggleAccordion(): void {
        this.isOpen = !this.isOpen;
        (this.$refs.accordionHeader as HTMLElement).blur();
        this.$emit('click', this.isOpen);
    }
}

const AccordionPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(ACCORDION_NAME, MAccordion);
    }
};

export default AccordionPlugin;
