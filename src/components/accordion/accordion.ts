import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { ACCORDION_NAME, BUTTON_GROUP_NAME, CHECKBOX_NAME, INPLACE_EDIT_NAME, INPUT_STYLE_NAME, LINK_NAME, RADIO_GROUP_NAME, RADIO_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import PlusPlugin, { MPlusSkin } from '../plus/plus';
import AccordionTransitionPlugin from '../transitions/accordion-transition/accordion-transition';
import WithRender from './accordion.html?style=./accordion.scss';


export enum MAccordionSkin {
    Default = 'default',
    Dark = 'dark',
    DarkB = 'dark-b',
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
    propOpen: boolean;
    propDisabled: boolean;
}

export interface AccordionGroupGateway {
    skin: MAccordionSkin;
    disabled: boolean;
    concurrent: boolean;
    addAccordion(accordion: AccordionGateway): void;
    removeAccordion(id: string): void;
    closeAllAccordions(): any;
}

const COMPONENT_IN_CLOSEST: string = '.' + BUTTON_GROUP_NAME + ', .' + INPUT_STYLE_NAME + ', .' + CHECKBOX_NAME + ', .' + RADIO_GROUP_NAME + ', .' + RADIO_NAME + ', .' + LINK_NAME + ', .' + INPLACE_EDIT_NAME;

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
            value === MAccordionSkin.DarkB ||
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
    @Prop({ default: false })
    public keepContentAlive: boolean;

    public titleMenuOpen: string = this.$i18n.translate('m-accordion:open');
    public titleMenuClose: string = this.$i18n.translate('m-accordion:close');

    $refs: {
        accordionHeader: HTMLElement;
    };

    private uuid: string = uuid.generate();
    private internalPropOpen: boolean = false;


    @Emit('click')
    private clickEvent(event: Event): void {
    }

    public get propDisabled(): boolean {
        return (isAccordionGroup(this.$parent) && this.$parent.disabled) ||
            this.disabled;
    }

    protected created(): void {
        this.internalPropOpen = this.open;

        if (isAccordionGroup(this.$parent)) {
            this.$parent.addAccordion(this);
        }
    }

    protected beforeDestroy(): void {
        if (isAccordionGroup(this.$parent)) {
            this.$parent.removeAccordion(this.propId);
        }
    }

    public get propId(): string {
        return this.id || this.uuid;
    }

    public get idBodyWrap(): string {
        return `${this.propId}-body-wrap`;
    }

    public get classBody(): Object {
        return {
            'm--has-padding': this.paddingBody && this.padding
        };
    }

    public get propOpen(): boolean {
        return this.internalPropOpen;
    }

    public set propOpen(value) {
        if (value !== this.internalPropOpen) {
            this.internalPropOpen = value;
            this.$emit('update:open', value);
        }
    }

    public get headerTabindex(): number | undefined {
        return this.propDisabled || !this.hasContent() ? undefined : 0;
    }

    public hasContent(): boolean {
        return !!this.$slots.default;
    }

    public get propSkin(): MAccordionSkin {
        return isAccordionGroup(this.$parent) ? this.$parent.skin : this.skin;
    }

    public get plusSkin(): MPlusSkin {
        if (this.skin === MAccordionSkin.DarkB) {
            if (this.propOpen) {
                return MPlusSkin.CurrentColor;
            } else {
                return MPlusSkin.Light;
            }
        } else {
            return MPlusSkin.Default;
        }
    }

    public get hasIconBorder(): boolean {
        if (this.iconBorder) {
            return this.iconBorder;
        }

        return this.propSkin === MAccordionSkin.Light ? true : false;
    }

    public toggleAccordion(event: Event): void {
        if (!this.hasContent()) {
            return;
        }

        let target: Element | null = (event.target as HTMLElement).closest('[href], [onclick], a, button, input, textarea, radio, ' + COMPONENT_IN_CLOSEST);

        if (!this.propDisabled && !target) {
            const initialState: boolean = this.internalPropOpen;

            if (!this.internalPropOpen &&
                isAccordionGroup(this.$parent) &&
                this.$parent.concurrent) {
                this.$parent.closeAllAccordions();
            }

            this.$refs.accordionHeader.blur();
            this.propOpen = !initialState;
            this.clickEvent(event);
        }
    }

    @Watch('open')
    private syncOpenProp(val: boolean): void {
        this.propOpen = val;
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
