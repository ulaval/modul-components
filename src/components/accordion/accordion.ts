import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './accordion.html?style=./accordion.scss';
import { ACCORDION_NAME, ACCORDION_GROUP_NAME } from '../component-names';
import { TransitionAccordion, TransitionAccordionMixin } from '../../mixins/transition-accordion/transition-accordion';

export enum MAccordionSkin {
    Regular = 'regular',
    Light = 'light',
    Vanilla= 'vanilla'
}

export enum MAccordionIconPosition {
    Left = 'left',
    Right = 'right'
}

export enum MAccordionIconSkin {
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
export class MAccordion extends ModulVue {

    @Prop({ default: MAccordionSkin.Regular })
    public skin: MAccordionSkin;
    @Prop()
    public open: boolean;
    @Prop()
    public iconPosition: MAccordionIconPosition;
    @Prop()
    public iconSkin: MAccordionIconSkin;
    @Prop()
    public iconSize: MAccordionIconASize;

    public componentName: string = ACCORDION_NAME;
    public propSkin: string = MAccordionSkin.Regular;
    public propOpen: boolean = false;
    public id: number;

    private propIconPosition: string = MAccordionIconPosition.Right;
    private propIconSkin: string = MAccordionIconSkin.Light;
    private propIconSize: string = MAccordionIconASize.Large;

    public resetSkin(type): void {
        switch (type) {
            case MAccordionSkin.Light:
                this.propIconPosition = MAccordionIconPosition.Left;
                this.propIconSize = MAccordionIconASize.Small;
                this.propIconSkin = MAccordionIconSkin.Regular;
                break;
            case MAccordionSkin.Vanilla:
                this.setSkinVanilla();
                break;
            default:
                this.propIconPosition = MAccordionIconPosition.Right;
                this.propIconSize = MAccordionIconASize.Large;
                this.propIconSkin = MAccordionIconSkin.Light;
        }
    }

    public openAccordion(): void {
        this.propOpen = true;
    }

    public closeAccordion(): void {
        this.propOpen = false;
    }

    public setIsAnimActive(value: boolean): void {
        this.as<TransitionAccordionMixin>().isAnimActive = value;
    }

    protected beforeMount(): void {
        this.propSkin = this.skin;
        this.propOpen = this.open == undefined ? false : this.open;
        this.propIconPosition = this.iconPosition;
        this.propIconSize = this.iconSize;
        this.propIconSkin = this.iconSkin;
        this.setSkin();
    }

    private setSkin(): void {
        switch (this.propSkin) {
            case MAccordionSkin.Light:
                if (this.propIconPosition == undefined) {
                    this.propIconPosition = MAccordionIconPosition.Left;
                }
                if (this.propIconSize == undefined) {
                    this.propIconSize = MAccordionIconASize.Small;
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
                    this.propIconSize = MAccordionIconASize.Large;
                }
                if (this.propIconSkin == undefined) {
                    this.propIconSkin = MAccordionIconSkin.Light;
                }
        }
    }

    private setSkinVanilla(): void {
        if (this.propIconPosition == undefined) {
            this.propIconPosition = MAccordionIconPosition.Right;
        }
        if (this.propIconSize == undefined) {
            this.propIconSize = MAccordionIconASize.Large;
        }
        if (this.propIconSkin == undefined) {
            this.propIconSkin = MAccordionIconSkin.Light;
        }
    }

    private toggleAccordion(): void {
        this.as<TransitionAccordionMixin>().isAnimActive = true;
        this.propOpen = !this.propOpen;
        (this.$refs.accordionHeader as HTMLElement).blur();
        this.$emit('click', this.id, this.propOpen);
    }

    private get isSkinRegular(): boolean {
        return this.propSkin == MAccordionSkin.Light || this.propSkin == MAccordionSkin.Vanilla ? false : true;
    }
}

const AccordionPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(ACCORDION_NAME, MAccordion);
    }
};

export default AccordionPlugin;
