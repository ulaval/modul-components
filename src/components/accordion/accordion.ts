import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './accordion.html?style=./accordion.scss';
import { ACCORDION_NAME } from '../component-names';
import { TransitionAccordion, TransitionAccordionMixin } from '../../mixins/transition-accordion/transition-accordion';
import uuid from '../../utils/uuid/uuid';
import I18nPlugin from '../i18n/i18n';

export enum MAccordionSkin {
    Regular = 'regular',
    Light = 'light',
    Plain = 'plain'
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

export abstract class BaseAccordionGroup extends Vue {
    abstract skin: MAccordionSkin;
    abstract accordionIsOpen(id: string): boolean;
    abstract addAccordion(id: string, open: boolean): void;
    abstract removeAccordion(id: string): void;
    abstract toggleAccordion(id: string): void;
}

@WithRender
@Component({
    mixins: [TransitionAccordion]
})
export class MAccordion extends Vue {

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

    private uuid: string = uuid.generate();
    private internalPropOpen: boolean = false;

    public get propOpen(): boolean {
        if (this.$parent instanceof BaseAccordionGroup) {
            return this.$parent.accordionIsOpen(this.propId);
        } else if (this.open != undefined) {
            return this.open;
        }
        return this.internalPropOpen;
    }

    public set propOpen(value) {
        this.internalPropOpen = value;
        this.$emit('update:open', value);
    }

    protected created(): void {
        if (this.$parent instanceof BaseAccordionGroup) this.$parent.addAccordion(this.propId, this.open);
    }

    protected beforeDestroy(): void {
        if (this.$parent instanceof BaseAccordionGroup) this.$parent.removeAccordion(this.propId);
    }

    private get propId(): string {
        return this.id || this.uuid;
    }

    private get propSkin(): MAccordionSkin {
        return this.$parent instanceof BaseAccordionGroup ? this.$parent.skin : this.skin;
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
        if (this.$parent instanceof BaseAccordionGroup) this.$parent.toggleAccordion(this.propId);
        (this.$refs.accordionHeader as HTMLElement).blur();
        this.propOpen = !this.propOpen;
        this.$emit('click', this.internalPropOpen);
    }
}

const AccordionPlugin: PluginObject<any> = {
    install(v, options) {
        v.use(I18nPlugin);
        v.component(ACCORDION_NAME, MAccordion);
    }
};

export default AccordionPlugin;
