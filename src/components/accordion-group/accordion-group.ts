import Vue from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './accordion-group.html?style=./accordion-group.scss';
import { ACCORDION_NAME, ACCORDION_GROUP_NAME } from '../component-names';
import { MAccordion, MAccordionSkin } from '../accordion/accordion';

@WithRender
@Component
export class MAccordionGroup extends ModulVue {

    @Prop({ default: MAccordionSkin.Regular })
    public skin: MAccordionSkin;

    @Prop({ default: false })
    public concurrent: boolean;

    @Prop({ default: false })
    public allOpen: boolean;

    @Prop()
    public value: string;

    public componentName: string = ACCORDION_GROUP_NAME;

    private arrAccordion: MAccordion[] = new Array();
    private nbAccordionOpen: number = 0;

    private hasError: boolean = false;
    private errorDefaultMesage: string = 'ERROR in <' + ACCORDION_GROUP_NAME + '> : ';
    private errorMessage: string = '';

    protected mounted(): void {
        this.$children.forEach((accordion, index) => {
            if (accordion instanceof MAccordion && accordion.componentName == ACCORDION_NAME) {
                accordion.id = index;
                accordion.$on('click', (open: boolean) => this.toggleAccordionGroup(open, accordion));
                this.arrAccordion.push(accordion);
                if (accordion.isOpen) {
                    if (this.concurrent && this.nbAccordionOpen == 1) {
                        accordion.setIsAnimActive(false);
                        accordion.isOpen = false;
                    } else {
                        this.nbAccordionOpen++;
                    }
                }
            }
        });
        if (this.allOpen && !this.concurrent) {
            this.openAllAccordions(false);
        }
        if (this.arrAccordion.length == 0) {
            this.hasError = true;
            this.errorMessage = this.errorDefaultMesage + 'No <' + ACCORDION_NAME + '> found in <' + ACCORDION_GROUP_NAME + '>';
            console.error(this.errorMessage);
        }
    }

    private toggleAccordionGroup(open: boolean, accordion: MAccordion): void {
        if (this.concurrent) {
            this.closeAllAccordions(true);
            if (open) accordion.isOpen = true;
        } else {
            open ? this.nbAccordionOpen++ : this.nbAccordionOpen--;
        }
    }

    private openAllAccordions(isAnimActive: boolean = true): void {
        this.nbAccordionOpen = this.arrAccordion.length;
        this.arrAccordion.forEach(el => {
            el.setIsAnimActive(isAnimActive);
            el.isOpen = true;
        });
    }

    private closeAllAccordions(isAnimActive: boolean = true): void {
        this.nbAccordionOpen = 0;
        this.arrAccordion.forEach(el => {
            el.setIsAnimActive(isAnimActive);
            el.isOpen = false;
        });
    }

    private get propAllOpen(): boolean {
        return this.nbAccordionOpen == this.arrAccordion.length;
    }

    private get propAllClosed(): boolean {
        return this.nbAccordionOpen == 0;
    }

    private get hasTitleSlot(): boolean {
        return !!this.$slots['title'];
    }
}

const AccordionGroupPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(ACCORDION_GROUP_NAME, MAccordionGroup);
    }
};

export default AccordionGroupPlugin;
