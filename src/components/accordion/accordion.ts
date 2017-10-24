import Vue from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './accordion.html?style=./accordion.scss';
import { ACCORDION_NAME, ACCORDION_GROUP_NAME } from '../component-names';
import { MAccordionGroup } from '../accordion-group/accordion-group';
import { TransitionAccordion, TransitionAccordionMixin } from '../../mixins/transition-accordion/transition-accordion';
import uuid from '../../utils/uuid/uuid';

export enum MAccordionSkin {
    Regular = 'regular',
    Light = 'light',
    NoSkin = 'no-skin'
}

export enum MAccordionIconPosition {
    Left = 'left',
    Right = 'right'
}

export enum MAccordionIconSkin {
    Default = 'default',
    Border = 'border'
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

    @Prop()
    public open: boolean;

    @Prop({ default: MAccordionSkin.Regular })
    public skin: MAccordionSkin;

    @Prop()
    public iconPosition: MAccordionIconPosition;

    @Prop()
    public iconSkin: MAccordionIconSkin;

    @Prop()
    public iconSize: MAccordionIconSize;

    @Prop()
    public id: string;

    public componentName: string = ACCORDION_NAME;

    private uuid: string = uuid.generate();
    private internalPropOpen: boolean = false;

    public get propOpen(): boolean {
        if (this.$parent instanceof MAccordionGroup) {
            return this.$parent.accordionIsOpen(this.propId);
        } else if (this.open != undefined) {
            return this.open;
        }
        return this.internalPropOpen;
    }

    public set propOpen(value) {
        this.$emit('update:open', value);
        this.internalPropOpen = value;
    }

    protected created() {
        if (this.$parent instanceof MAccordionGroup) this.$parent.addAccordion(this.propId, this.open);
    }

    protected beforeDestroy() {
        if (this.$parent instanceof MAccordionGroup) this.$parent.removeAccordion(this.propId);
    }

    private get propId() {
        return this.id || this.uuid;
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
        return this.iconSkin || MAccordionIconSkin.Default;
    }

    private toggleAccordion(): void {
        if (this.$parent instanceof MAccordionGroup) this.$parent.toggleAccordion(this.propId);
        this.propOpen = !this.propOpen;
        (this.$refs.accordionHeader as HTMLElement).blur();
        this.$emit('click', this.propOpen);
    }
}

const AccordionPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(ACCORDION_NAME, MAccordion);
    }
};

export default AccordionPlugin;
