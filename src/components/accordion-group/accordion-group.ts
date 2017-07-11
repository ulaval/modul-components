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
    public concurrent: boolean;
    @Prop({ default: false })
    public allOpen: boolean;

    public componentName: string = ACCORDION_GROUP_NAME;

    private propMode: string = MODE_REGULAR;
    private propConcurrent: boolean = true;
    private propAllOpen: boolean = false;

    private nbAccordion: number = 0;
    private arrAccordion = new Array();
    private nbAccordionOpen: number = 0;
    private indexAccordionOpen: number | undefined = undefined;

    private hasError: boolean = false;
    private errorDefaultMesage: string = 'ERROR in <' + ACCORDION_GROUP_NAME + '> : ';
    private errorMessage: string = '';

    private mounted(): void {
        this.propAllOpen = this.allOpen;
        this.propMode = this.mode == MODE_LIGHT || this.mode == MODE_NO_STYLE ? this.mode : this.propMode;
        this.propConcurrent = this.concurrent;
        for (let i = 0; i < this.$children.length; i++) {
            if (this.checkAccordion(i)) {
                this.$children[i]['accordionID'] = this.nbAccordion;
                this.$children[i]['eventBus']['$on']('click', (id, value) => this.toggleAccordionGroup(id, value));
                this.arrAccordion.push({
                    id: this.nbAccordion,
                    childrenNumber: i,
                    open: false
                });
                if (this.$children[i]['propOpen']) {
                    if (this.propConcurrent) {
                        this.indexAccordionOpen = this.nbAccordion;
                        this.$children[i]['closeAccordion']();
                        this.arrAccordion[this.nbAccordion]['open'] = false;
                    } else {
                        this.nbAccordionOpen++;
                        this.arrAccordion[this.nbAccordion]['open'] = true;
                    }
                }
                if (this.propMode != this.$children[i]['propMode']) {
                    this.$children[i]['propMode'] = this.propMode;
                    this.$children[i]['resetMode'](this.propMode);
                }
                this.nbAccordion++;
            }
        }
        if (this.propConcurrent) {
            this.openAccordionConcurrent();
        }
        if (this.propAllOpen && !this.propConcurrent) {
            this.openAllAccordions(false);
        }
        if (this.nbAccordion == 0) {
            this.hasError = true;
            this.errorMessage = this.errorDefaultMesage + 'No <' + ACCORDION_NAME + '> found in <' + ACCORDION_GROUP_NAME + '>';
            console.error(this.errorMessage);
        }
    }

    private toggleAccordionGroup(accordionID: number, open: boolean): void {
        for (let i = 0; i < this.arrAccordion.length; i++) {
            if (this.arrAccordion[i]['id'] == accordionID) {
                this.arrAccordion[i]['open'] = open;
                this.indexAccordionOpen = i;
            }
        }
        if (this.propConcurrent) {
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
            this.$children[this.arrAccordion[this.indexAccordionOpen].childrenNumber]['openAccordion']();
            this.nbAccordionOpen = 1;
        } else {
            this.nbAccordionOpen = 0;
        }
    }

    private checkAccordion(index: number): boolean {
        return this.$children[index]['componentName'] == ACCORDION_NAME ? true : false;
    }

    private openAllAccordions(isAnimActive: boolean = true): void {
        this.propAllOpen = true;
        this.nbAccordionOpen = this.nbAccordion;
        for (let i = 0; i < this.$children.length; i++) {
            if (i < this.arrAccordion.length) {
                this.arrAccordion[i]['open'] = true;
            }
            if (this.checkAccordion(i)) {
                this.$children[i]['isAnimActive'] = isAnimActive;
                this.$children[i]['openAccordion']();
            }
        }
    }

    private closeAllAccordions(isAnimActive: boolean = true): void {
        this.propAllOpen = false;
        this.nbAccordionOpen = 0;
        for (let i = 0; i < this.$children.length; i++) {
            if (i < this.arrAccordion.length) {
                this.arrAccordion[i]['open'] = false;
            }
            if (this.checkAccordion(i)) {
                this.$children[i]['isAnimActive'] = isAnimActive;
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
