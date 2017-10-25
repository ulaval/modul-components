import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './accordion-group.html?style=./accordion-group.scss';
import { ACCORDION_GROUP_NAME } from '../component-names';
import { MAccordionSkin, BaseAccordionGroup } from '../accordion/accordion';
import I18nPlugin from '../i18n/i18n';
import LinkPlugin from '../link/link';

@WithRender
@Component
export class MAccordionGroup extends BaseAccordionGroup {

    @Prop({ default: MAccordionSkin.Regular })
    public skin: MAccordionSkin;

    @Prop({ default: false })
    public concurrent: boolean;

    @Prop({ default: false })
    public allOpen: boolean;

    @Prop()
    public value: string[];

    public componentName: string = ACCORDION_GROUP_NAME;

    private accordions: string[] = [];
    private openAccordions: string[] = [];

    public addAccordion(id: string, open: boolean = false): void {
        if (this.accordions.indexOf(id) == -1) this.accordions.push(id);
        // group value override individual accordion's inital open state
        if (!this.value && open && this.openAccordions.indexOf(id) == -1) {
            this.setOpenAccordions([...this.openAccordions, id]);
        }
    }

    public removeAccordion(id: string): void {
        this.accordions = this.accordions.filter(el => el != id);
        this.setOpenAccordions(this.openAccordions.filter(el => el != id));
    }

    public toggleAccordion(id: string): void {
        if (this.openAccordions.indexOf(id) == -1) {
            this.setOpenAccordions([id, ...this.openAccordions]);
        } else {
            this.setOpenAccordions(this.openAccordions.filter(el => el != id));
        }
    }

    public accordionIsOpen(id): boolean {
        return (this.openAccordions.indexOf(id) != -1);
    }

    protected created(): void {
        this.setOpenAccordions(this.value);
    }

    @Watch('value')
    private setOpenAccordions(value?: string[]): void {
        if (this.concurrent && value && value.length > 1) {
            this.openAccordions = [value[0]];
        } else {
            this.openAccordions = value || [];
        }
        this.$emit('update:value', this.openAccordions);
    }

    private get propAllOpen(): boolean {
        return this.openAccordions.length == this.accordions.length;
    }

    private get propAllClosed(): boolean {
        return this.openAccordions.length == 0;
    }

    private get propSkin(): MAccordionSkin {
        return this.skin == MAccordionSkin.Light || this.skin == MAccordionSkin.Plain ? this.skin : MAccordionSkin.Regular;
    }

    private get hasTitleSlot(): boolean {
        return !!this.$slots['title'];
    }

    private openAllAccordions(): void {
        this.setOpenAccordions([...this.accordions]);
    }

    private closeAllAccordions(): void {
        this.setOpenAccordions();
    }
}

const AccordionGroupPlugin: PluginObject<any> = {
    install(v, options) {
        v.use(I18nPlugin);
        v.use(LinkPlugin);
        v.component(ACCORDION_GROUP_NAME, MAccordionGroup);
    }
};

export default AccordionGroupPlugin;
