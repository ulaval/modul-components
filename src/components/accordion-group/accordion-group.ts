import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './accordion-group.html?style=./accordion-group.scss';
import { ACCORDION_GROUP_NAME } from '../component-names';
import { ACCORDION_NAME } from '../component-names';

const MODE_REGULAR: string = 'regular';
const MODE_LIGHT: string = 'light';
const MODE_NO_STYLE: string = 'no-style';

@WithRender
@Component
export class MAccordionGroup extends Vue {
    @Prop()
    public mode: string;
    @Prop({ default: false })
    public isConcurrent: boolean;
    @Prop({ default: false })
    public areAllOpen: boolean;

    public componentName: string = ACCORDION_GROUP_NAME;

    private propsMode: string = MODE_REGULAR;
    private propsIsConcurrent: boolean = true;
    private propsAreAllOpen: boolean = false;

    private nbAccordion: number = 0;
    private arrAccordion = new Array();
    private nbAccordionOpen: number = 0;
    private indexAccordionOpen: number | undefined = undefined;

    private hasError: boolean = false;
    private errorDefaultMesage: string = 'ERROR in <' + ACCORDION_GROUP_NAME + '> : ';
    private errorMessage: string = '';

    private mounted(): void {
        this.propsAreAllOpen = this.areAllOpen;
        this.propsMode = this.mode == MODE_LIGHT || this.mode == MODE_NO_STYLE ? this.mode : this.propsMode;
        this.propsIsConcurrent = this.isConcurrent;
        for (let i = 0; i < this.$children.length; i++) {
            if (this.checkAccordion(i)) {
                this.$children[i]['accordionID'] = this.nbAccordion;

                this.arrAccordion.push({
                    id: this.nbAccordion,
                    isOpen: false,
                    childrenNumber: i
                });

                if (this.$children[i]['propsIsOpen']) {
                    if (this.propsIsConcurrent) {
                        this.indexAccordionOpen = this.nbAccordion;
                        this.$children[i]['closeAccordion']();
                        this.arrAccordion[this.nbAccordion]['isOpen'] = false;
                    } else {
                        this.nbAccordionOpen++;
                        this.arrAccordion[this.nbAccordion]['isOpen'] = true;
                    }
                }

                if (this.propsMode != this.$children[i]['propsMode']) {
                    this.$children[i]['propsMode'] = this.propsMode;
                    this.$children[i]['resetMode'](this.propsMode);
                }

                this.nbAccordion++;
            }
        }
        if (this.propsIsConcurrent) {
            this.openAccordionConcurrent();
        }
        if (this.propsAreAllOpen && !this.propsIsConcurrent) {
            this.openAllAccordions(false);
        }
        if (this.nbAccordion == 0) {
            this.hasError = true;
            this.errorMessage = this.errorDefaultMesage + 'No <' + ACCORDION_NAME + '> found in <' + ACCORDION_GROUP_NAME + '>';
            console.error(this.errorMessage);
        }
    }

    private checkToggleAccordion(accordionID: number, isOpen: boolean): void {
        console.log(this.$children);
        for (let i = 0; i < this.arrAccordion.length; i++) {
            if (this.arrAccordion[i]['id'] == accordionID) {
                this.arrAccordion[i]['isOpen'] = isOpen;
                this.indexAccordionOpen = i;
            }
        }
        if (this.propsIsConcurrent) {
            this.closeAllAccordions(true);
            if (isOpen) {
                this.openAccordionConcurrent();
            }
        } else {
            if (isOpen) {
                this.nbAccordionOpen++;
            } else {
                this.nbAccordionOpen--;
            }
            this.propsAreAllOpen = this.nbAccordionOpen == this.nbAccordion ? true : false;
        }
    }

    private openAccordionConcurrent(): void {
        if (this.indexAccordionOpen != undefined) {
            this.$children[this.arrAccordion[this.indexAccordionOpen].childrenNumber]['openAccordion']();
            this.nbAccordionOpen = 1;
        } else {
            this.nbAccordionOpen = 0;
        }
    }

    private checkAccordion(index: number): boolean {
        return this.$children[index]['componentName'] == ACCORDION_NAME ? true : false;
    }

    private openAllAccordions(animIsActive: boolean = true): void {
        this.propsAreAllOpen = true;
        this.nbAccordionOpen = this.nbAccordion;
        for (let i = 0; i < this.$children.length; i++) {
            if (i < this.arrAccordion.length) {
                this.arrAccordion[i]['isOpen'] = true;
            }
            if (this.checkAccordion(i)) {
                this.$children[i]['animIsActive'] = animIsActive;
                this.$children[i]['openAccordion']();
            }
        }
    }

    private closeAllAccordions(animIsActive: boolean = true): void {
        this.propsAreAllOpen = false;
        this.nbAccordionOpen = 0;
        for (let i = 0; i < this.$children.length; i++) {
            if (i < this.arrAccordion.length) {
                this.arrAccordion[i]['isOpen'] = false;
            }
            if (this.checkAccordion(i)) {
                this.$children[i]['animIsActive'] = animIsActive;
                this.$children[i]['closeAccordion']();
            }
        }
    }

    public get hasTitle(): boolean {
        return !!this.$slots['title'];
    }
}

const AccordionGroupPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(ACCORDION_GROUP_NAME, MAccordionGroup);
    }
};

export default AccordionGroupPlugin;
