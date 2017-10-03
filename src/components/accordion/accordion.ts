import Vue from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './accordion.html?style=./accordion.scss';
import { ACCORDION_NAME, ACCORDION_GROUP_NAME } from '../component-names';
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
    private hasParentGroup: boolean | undefined = undefined;
    private root: any;
    private internalPropOpen: boolean = this.open;
    private internalPropSkin: MAccordionSkin = this.skin;
    private internalIconPosition: MAccordionIconPosition = this.iconPosition;
    private internalIconSize: MAccordionIconSize = this.iconSize;
    private internalIconSkin: MAccordionIconSkin = this.iconSkin;

    @Watch('open')
    public updateOpen(open: boolean): void {
        this.isOpen = this.open;
    }

    @Watch('skin')
    public updateSkin(skin: boolean): void {
        this.propSkin = this.skin;
    }

    public get isOpen(): boolean {
        return this.internalPropOpen;
    }

    public set isOpen(value) {
        this.$emit('input', value);
        this.internalPropOpen = value;
    }

    public get propSkin(): MAccordionSkin {
        return this.internalPropSkin;
    }

    public set propSkin(value: MAccordionSkin) {
        this.internalPropSkin = value;
        this.setSkin();
    }

    public setIsAnimActive(value: boolean): void {
        this.as<TransitionAccordionMixin>().isAnimActive = value;
    }

    public setSkin(): void {
        switch (this.internalPropSkin) {
            case MAccordionSkin.Light:
                if (this.propIconPosition == undefined) {
                    this.propIconPosition = MAccordionIconPosition.Left;
                }
                if (this.propIconSize == undefined) {
                    this.propIconSize = MAccordionIconSize.Small;
                }
                if (this.propIconSkin == undefined) {
                    this.propIconSkin = MAccordionIconSkin.Regular;
                }
                break;
            case MAccordionSkin.Vanilla:
                this.setSkinVanilla();
                break;
            default:
                if (this.propIconPosition == undefined) {
                    this.propIconPosition = MAccordionIconPosition.Right;
                }
                if (this.propIconSize == undefined) {
                    this.propIconSize = MAccordionIconSize.Large;
                }
                if (this.propIconSkin == undefined) {
                    this.propIconSkin = MAccordionIconSkin.Light;
                }
        }
    }

    private get propIconPosition(): MAccordionIconPosition {
        return this.internalIconPosition == undefined ? MAccordionIconPosition.Right : this.internalIconPosition;
    }

    private set propIconPosition(value: MAccordionIconPosition) {
        this.internalIconPosition = value;
    }

    private get propIconSize(): MAccordionIconSize {
        return this.internalIconSize == undefined ? MAccordionIconSize.Large : this.internalIconSize;
    }

    private set propIconSize(value: MAccordionIconSize) {
        this.internalIconSize = value;
    }

    private get propIconSkin(): MAccordionIconSkin {
        return this.internalIconSkin == undefined ? MAccordionIconSkin.Light : this.internalIconSkin;
    }

    private set propIconSkin(value: MAccordionIconSkin) {
        this.internalIconSkin = value;
    }

    private setSkinVanilla(): void {
        if (this.propIconPosition == undefined) {
            this.propIconPosition = MAccordionIconPosition.Right;
        }
        if (this.propIconSize == undefined) {
            this.propIconSize = MAccordionIconSize.Large;
        }
        if (this.propIconSkin == undefined) {
            this.propIconSkin = MAccordionIconSkin.Light;
        }
    }

    private toggleAccordion(): void {
        this.as<TransitionAccordionMixin>().isAnimActive = true;
        this.isOpen = !this.isOpen;
        (this.$refs.accordionHeader as HTMLElement).blur();
        this.$emit('click', this.id, this.isOpen);
    }
}

const AccordionPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(ACCORDION_NAME, MAccordion);
    }
};

export default AccordionPlugin;
