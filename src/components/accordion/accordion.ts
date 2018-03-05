import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import uuid from '../../utils/uuid/uuid';
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

export interface AccordionGroupGateway {
    skin: MAccordionSkin;
    disabled: boolean;
    accordionIsOpen(id: string): boolean;
    addAccordion(id: string, open: boolean): void;
    removeAccordion(id: string): void;
    toggleAccordion(id: string): void;
}

function isAccordionGroup(parent: any): parent is AccordionGroupGateway {
    return parent && 'addAccordion' in parent;

}

@WithRender
@Component
export class MAccordion extends ModulVue {

    @Prop() public disabled: boolean;

    @Prop()
    public open?: boolean;

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
    public iconPosition?: MAccordionIconPosition;

    @Prop() public iconBorder: boolean;

    @Prop({
        validator: value =>
            value == MAccordionIconSize.Small ||
            value == MAccordionIconSize.Large
    })
    public iconSize?: MAccordionIconSize;


    @Prop({ default: true })
    public padding: boolean;
    @Prop({ default: true })
    public paddingHeader: boolean;
    @Prop({ default: true })
    public paddingBody: boolean;
    @Prop()
    public id?: string;

    $refs: {
        accordionHeader: HTMLElement;
    };

    private uuid: string;
    private internalPropOpen: boolean;

    private created(): void {
        this.internalPropOpen = this.open !== undefined ? this.open : false;
        this.uuid = this.id !== undefined ? this.id : uuid.generate();

        if (isAccordionGroup(this.$parent)) {
            this.$parent.addAccordion(this.propId, this.internalPropOpen);
        }
    }

    private beforeDestroy(): void {
        if (isAccordionGroup(this.$parent)) {
            this.$parent.removeAccordion(this.propId);
        }
    }

    private get propOpen(): boolean {
        if (isAccordionGroup(this.$parent)) {
            return this.$parent.accordionIsOpen(this.propId);
        } else {
            return this.internalPropOpen;
        }
    }

    private set propOpen(value) {
        this.internalPropOpen = value;
        this.$emit('update:open', value);
    }

    private get propId(): string {
        return this.uuid;
    }

    private get propSkin(): MAccordionSkin {
        return isAccordionGroup(this.$parent) ? this.$parent.skin : this.skin;
    }

    private get propDisabled(): boolean {
        return this.$parent instanceof BaseAccordionGroup
            ? this.$parent.disabled
            : this.disabled;
    }

    private get propIconPosition(): MAccordionIconPosition {
        if (this.iconPosition) {
            return this.iconPosition;
        }

        return this.propSkin == MAccordionSkin.Light
            ? MAccordionIconPosition.Left
            : MAccordionIconPosition.Right;
    }

    private get propIconSize(): MAccordionIconSize {
        if (this.iconSize) {
            return this.iconSize;
        }

        return this.propSkin == MAccordionSkin.Light
            ? MAccordionIconSize.Small
            : MAccordionIconSize.Large;
    }

    private get propIconBorder(): boolean {
        if (this.iconBorder) {
            return this.iconBorder;
        }

        return this.propSkin == MAccordionSkin.Light ? true : false;
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
        if (isAccordionGroup(this.$parent)) {
            this.$parent.toggleAccordion(this.propId);
        }

        this.$refs.accordionHeader.blur();

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
