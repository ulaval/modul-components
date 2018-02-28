import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { ACCORDION_NAME, ACCORDION_TRANSITION_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import { MAccordionTransition } from './accordion-transition';
import WithRender from './accordion.html?style=./accordion.scss';

export enum MAccordionSkin {
    Primary = 'primary',
    Secondary = 'secondary',
    Light = 'light',
    Plain = 'plain'
}

export enum MAccordionIconPosition {
    Left = 'left',
    Right = 'right'
}

export enum MAccordionIconSize {
    Small = 'small',
    Large = 'large'
}

export abstract class BaseAccordionGroup extends Vue {
    abstract skin: MAccordionSkin;
    abstract disabled: boolean;
    abstract accordionIsOpen(id: string): boolean;
    abstract addAccordion(id: string, open: boolean): void;
    abstract removeAccordion(id: string): void;
    abstract toggleAccordion(id: string): void;
}

@WithRender
@Component
export class MAccordion extends ModulVue {
    @Prop() public open: boolean;
    @Prop() public disabled: boolean;

    @Prop({
        default: MAccordionSkin.Secondary,
        validator: value =>
            value == MAccordionSkin.Primary ||
            value == MAccordionSkin.Secondary ||
            value == MAccordionSkin.Light ||
            value == MAccordionSkin.Plain
    })
    public skin: MAccordionSkin;

    @Prop({
        validator: value =>
            value == MAccordionIconPosition.Left ||
            value == MAccordionIconPosition.Right
    })
    public iconPosition: MAccordionIconPosition;

    @Prop() public iconBorder: boolean;

    @Prop({
        validator: value =>
            value == MAccordionIconSize.Small ||
            value == MAccordionIconSize.Large
    })
    public iconSize: MAccordionIconSize;

    @Prop() public id: string;

    @Prop({ default: true })
    public padding: boolean;
    @Prop({ default: true })
    public paddingHeader: boolean;
    @Prop({ default: true })
    public paddingBody: boolean;

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
        if (this.$parent instanceof BaseAccordionGroup) {
            this.$parent.addAccordion(this.propId, this.open);
        }
    }

    protected beforeDestroy(): void {
        if (this.$parent instanceof BaseAccordionGroup) {
            this.$parent.removeAccordion(this.propId);
        }
    }

    private get propId(): string {
        return this.id || this.uuid;
    }

    private get propSkin(): MAccordionSkin {
        return this.$parent instanceof BaseAccordionGroup
            ? this.$parent.skin
            : this.skin;
    }

    private get propDisabled(): boolean {
        return this.$parent instanceof BaseAccordionGroup
            ? this.$parent.disabled
            : this.disabled;
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

    private get propIconBorder(): boolean {
        if (this.propSkin == MAccordionSkin.Light) {
            return this.iconBorder || true;
        } else {
            return this.iconBorder || false;
        }
    }

    private toggleAccordion(): void {
        if (!this.propDisabled) {
            if (this.$parent instanceof BaseAccordionGroup)
                this.$parent.toggleAccordion(this.propId);
            (this.$refs.accordionHeader as HTMLElement).blur();
            this.propOpen = !this.propOpen;
            this.$emit('click', this.internalPropOpen);
        }
        if (this.$parent instanceof BaseAccordionGroup) {
            this.$parent.toggleAccordion(this.propId);
        }
        (this.$refs.accordionHeader as HTMLElement).blur();
        this.propOpen = !this.propOpen;
        this.$emit('click', this.internalPropOpen);
    }
}

const AccordionPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(I18nPlugin);
        v.component(ACCORDION_NAME, MAccordion);
        v.component(ACCORDION_TRANSITION_NAME, MAccordionTransition);
    }
};

export default AccordionPlugin;
