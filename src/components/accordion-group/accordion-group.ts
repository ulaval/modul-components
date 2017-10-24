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
    @Prop()
    public skin: MAccordionSkin;
    @Prop({ default: false })
    public concurrent: boolean;
    @Prop({ default: false })
    public allOpen: boolean;
    @Prop()
    public value: string;

    public componentName: string = ACCORDION_GROUP_NAME;

    private nbAccordion: number = 0;
    private arrAccordion = new Array();
    private nbAccordionOpen: number = 0;
    private indexAccordionOpen: number | undefined = undefined;

    private hasError: boolean = false;
    private errorDefaultMesage: string = 'ERROR in <' + ACCORDION_GROUP_NAME + '> : ';
    private errorMessage: string = '';
    private internalPropAllOpen: boolean = false;

    protected mounted(): void {
        this.concurrent = this.concurrent;
        for (let i = 0; i < this.$children.length; i++) {
            if (this.checkAccordion(i)) {
                let accordion: MAccordion = this.$children[i] as MAccordion;
                accordion.id = this.nbAccordion;
                accordion.$on('click', (id: number, open: boolean) => this.toggleAccordionGroup(id, open));
                this.arrAccordion.push({
                    id: this.nbAccordion,
                    childrenNumber: i,
                    open: false
                });
                if (accordion.isOpen) {
                    if (this.concurrent) {
                        this.indexAccordionOpen = this.nbAccordion;
                        accordion.isOpen = false;
                        this.arrAccordion[this.nbAccordion].open = false;
                    } else {
                        this.nbAccordionOpen++;
                        this.arrAccordion[this.nbAccordion].open = true;
                    }
                }
                if (this.propSkin != accordion.propSkin) {
                    accordion.propSkin = this.propSkin;
                    accordion.setSkin();
                }
                this.nbAccordion++;
            }
        }
        if (this.concurrent) {
            this.openAccordionConcurrent();
        }
        if (this.propAllOpen && !this.concurrent) {
            this.openAllAccordions(false);
        }
        if (this.nbAccordion == 0) {
            this.hasError = true;
            this.errorMessage = this.errorDefaultMesage + 'No <' + ACCORDION_NAME + '> found in <' + ACCORDION_GROUP_NAME + '>';
            console.error(this.errorMessage);
        }
    }

    private toggleAccordionGroup(accordionID: number, open: boolean): void {
        if (this.concurrent) {
            this.closeAllAccordions(true);
            if (open) {
                this.openAccordionConcurrent();
            }
        } else {
            if (open) {
                this.nbAccordionOpen++;
            } else {
                this.nbAccordionOpen--;
            }
            this.propAllOpen = this.nbAccordionOpen == this.nbAccordion ? true : false;
        }
    }

    private openAccordionConcurrent(): void {
        if (this.indexAccordionOpen != undefined) {
            (this.$children[this.arrAccordion[this.indexAccordionOpen].childrenNumber] as MAccordion).isOpen = true;
            this.nbAccordionOpen = 1;
        } else {
            this.nbAccordionOpen = 0;
        }
    }

    private checkAccordion(index: number): boolean {
        return (this.$children[index] as MAccordion).componentName == ACCORDION_NAME ? true : false;
    }

    private openAllAccordions(isAnimActive: boolean = true): void {
        this.propAllOpen = true;
        this.nbAccordionOpen = this.nbAccordion;
        for (let i = 0; i < this.$children.length; i++) {
            let accordion: MAccordion = this.$children[i] as MAccordion;
            if (i < this.arrAccordion.length) {
                this.arrAccordion[i].open = true;
            }
            if (this.checkAccordion(i)) {
                accordion.setIsAnimActive(isAnimActive);
                accordion.isOpen = true;
            }
        }
    }

    private closeAllAccordions(isAnimActive: boolean = true): void {
        this.propAllOpen = false;
        this.nbAccordionOpen = 0;
        for (let i = 0; i < this.$children.length; i++) {
            let accordion: MAccordion = this.$children[i] as MAccordion;
            if (i < this.arrAccordion.length) {
                this.arrAccordion[i].open = false;
            }
            if (this.checkAccordion(i)) {
                accordion.setIsAnimActive(isAnimActive);
                accordion.isOpen = false;
            }
        }
    }

    private get propAllOpen(): boolean {
        return this.internalPropAllOpen == undefined ? this.allOpen : this.internalPropAllOpen;
    }

    private set propAllOpen(value: boolean) {
        this.internalPropAllOpen = value;
    }

    private get propSkin(): MAccordionSkin {
        return this.skin == MAccordionSkin.Light || this.skin == MAccordionSkin.Vanilla ? this.skin : MAccordionSkin.Regular;
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
