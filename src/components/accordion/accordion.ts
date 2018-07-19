import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { ACCORDION_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import PlusPlugin from '../plus/plus';
import AccordionTransitionPlugin from './accordion-transition';
import WithRender from './accordion.html?style=./accordion.scss';

export enum MAccordionSkin {
    Default = 'default',
    Dark = 'dark',
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

export interface AccordionGateway extends Vue {
    propId: string;
    isOpen: boolean;
    isDisabled: boolean;
}

export interface AccordionGroupGateway {
    skin: MAccordionSkin;
    disabled: boolean;
    concurrent: boolean;
    addAccordion(accordion: AccordionGateway): void;
    removeAccordion(id: string): void;
    closeAllAccordions(): any;
}

function isAccordionGroup(parent: any): parent is AccordionGroupGateway {
    return parent && 'addAccordion' in parent;
}

@WithRender
@Component
export class MAccordion extends ModulVue implements AccordionGateway {
    @Prop()
    public id?: string;

    @Prop({
        default: false
    })
    public open: boolean;

    @Prop({
        default: false
    })
    public disabled: boolean;

    @Prop({
        default: MAccordionSkin.Default,
        validator: value =>
            value === MAccordionSkin.Default ||
            value === MAccordionSkin.Dark ||
            value === MAccordionSkin.Light ||
            value === MAccordionSkin.Plain
    })
    public skin: MAccordionSkin;

    @Prop({
        default: MAccordionIconPosition.Left,
        validator: value =>
            value === MAccordionIconPosition.Left ||
            value === MAccordionIconPosition.Right
    })
    public iconPosition?: MAccordionIconPosition;

    @Prop()
    public iconBorder?: boolean;

    @Prop({
        default: MAccordionIconSize.Large,
        validator: value =>
            value === MAccordionIconSize.Small ||
            value === MAccordionIconSize.Large
    })
    public iconSize?: MAccordionIconSize;

    @Prop({ default: true })
    public padding: boolean;
    @Prop({ default: true })
    public paddingHeader: boolean;
    @Prop({ default: true })
    public paddingBody: boolean;

    $refs: {
        accordionHeader: HTMLElement;
    };

    private uuid: string = uuid.generate();
    private internalIsOpen: boolean = false;

    public get propId(): string {
        return this.id || this.uuid;
    }

    public get isOpen(): boolean {
        return this.internalIsOpen;
    }

    public set isOpen(value) {
        if (value !== this.internalIsOpen) {
            this.internalIsOpen = value;
            this.$emit('update:open', value);
        }
    }

    public get isDisabled(): boolean {
        return (isAccordionGroup(this.$parent) && this.$parent.disabled) ||
            this.disabled;
    }

    private created(): void {
        this.internalIsOpen = this.open;

        if (isAccordionGroup(this.$parent)) {
            this.$parent.addAccordion(this);
        }
    }

    private beforeDestroy(): void {
        if (isAccordionGroup(this.$parent)) {
            this.$parent.removeAccordion(this.propId);
        }
    }

    private get propSkin(): MAccordionSkin {
        return isAccordionGroup(this.$parent) ? this.$parent.skin : this.skin;
    }

    private get hasIconBorder(): boolean {
        if (this.iconBorder) {
            return this.iconBorder;
        }

        return this.propSkin === MAccordionSkin.Light ? true : false;
    }

    private toggleAccordion(event: Event): void {
        let target: Element | null;
        target = (event.target as HTMLElement).closest('[href], [onclick], button, input, textarea, radio');

        if (!this.isDisabled && !target) {
            const initialState: boolean = this.internalIsOpen;

            if (!this.internalIsOpen &&
                isAccordionGroup(this.$parent) &&
                this.$parent.concurrent) {
                this.$parent.closeAllAccordions();
            }

            this.$refs.accordionHeader.blur();
            this.isOpen = !initialState;
            this.$emit('click', this.internalIsOpen);
        }
    }

    @Watch('open')
    private syncOpenProp(val: boolean): void {
        this.internalIsOpen = val;
    }
}

const AccordionPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(I18nPlugin);
        v.use(AccordionTransitionPlugin);
        v.use(PlusPlugin);
        v.component(ACCORDION_NAME, MAccordion);
    }
};

export default AccordionPlugin;
