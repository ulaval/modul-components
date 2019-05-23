import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import MAccordionPlugin, { AccordionGateway, AccordionGroupGateway, MAccordionSkin } from '../accordion/accordion';
import { ACCORDION_GROUP_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import LinkPlugin from '../link/link';
import WithRender from './accordion-group.html?style=./accordion-group.scss';


@WithRender
@Component
export class MAccordionGroup extends Vue implements AccordionGroupGateway {
    @Prop({
        default: MAccordionSkin.Default,
        validator: value =>
            value === MAccordionSkin.Default ||
            value === MAccordionSkin.Light ||
            value === MAccordionSkin.Plain
    })
    public skin: MAccordionSkin;

    @Prop({
        default: false
    })
    public concurrent: boolean;

    @Prop({
        default: false
    })
    public disabled: boolean;

    @Prop()
    public openedIds?: string[];

    @Prop({
        default: false
    })
    public toggleLinkLeft: boolean;

    private accordions: { [id: string]: AccordionGateway } = {};

    public addAccordion(accordion: AccordionGateway): void {
        accordion.$on('update:open', this.emitValueChange);
        this.$set(this.accordions, accordion.propId, accordion);
        if (this.openedIds && this.openedIds.find(v => v === accordion.propId)) {
            accordion.propOpen = true;
        }
    }

    public removeAccordion(id: string): void {
        this.accordions[id].$off('update:open', this.emitValueChange);
        this.$delete(this.accordions, id);
    }

    public closeAllAccordions(): void {
        for (const id in this.accordions) {
            this.accordions[id].propOpen = false;
        }
    }

    private get propAllOpen(): boolean {
        let allOpened: boolean = true;
        for (const id in this.accordions) {
            allOpened = this.accordions[id].propOpen;
            if (!allOpened && !this.accordions[id].propDisabled) {
                break;
            }
        }
        return allOpened;
    }

    private get propAllClosed(): boolean {
        let allClosed: boolean = true;
        for (const id in this.accordions) {
            allClosed = !this.accordions[id].propOpen;
            if (!allClosed && !this.accordions[id].propDisabled) {
                break;
            }
        }
        return allClosed;
    }

    private get propSkin(): MAccordionSkin {
        return this.skin === MAccordionSkin.Light || this.skin === MAccordionSkin.Plain || this.skin === MAccordionSkin.Default ? this.skin : MAccordionSkin.Default;
    }

    private get hasTitleSlot(): boolean {
        return !!this.$slots['title'];
    }

    private get hasSecondaryContentSlot(): boolean {
        return !!this.$slots['secondary-content'];
    }

    private openAllAccordions(): void {
        for (const id in this.accordions) {
            this.accordions[id].propOpen = true;
        }
    }

    private emitValueChange(): void {
        const openedIds: string[] = Object.keys(this.accordions).filter(
            id => this.accordions[id].propOpen
        );

        this.$emit('update:openedIds', openedIds);
    }

    @Watch('openedIds')
    private applyValuePropChange(val: string[]): void {
        for (const id in this.accordions) {
            this.accordions[id].propOpen =
                val.find(openedId => openedId === id) !== undefined;
        }
    }
}

const AccordionGroupPlugin: PluginObject<any> = {
    install(v): void {
        v.use(LinkPlugin);
        v.use(I18nPlugin);
        v.use(MAccordionPlugin);
        v.component(ACCORDION_GROUP_NAME, MAccordionGroup);
    }
};

export default AccordionGroupPlugin;
