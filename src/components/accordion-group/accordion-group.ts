import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './accordion-group.html?style=./accordion-group.scss';
import { ACCORDION_GROUP_NAME } from '../component-names';
import { ACCORDION_NAME } from '../component-names';

@WithRender
@Component
export class MAccordionGroup extends Vue {
    @Prop()
    private type: string;
    @Prop({ default: false })
    private openAll: boolean;

    private propsType: string;
    private propsOpenAll: boolean = false;
    private hasError: boolean = false;
    private errorDefaultMesage: string = 'Error in <' + ACCORDION_GROUP_NAME + '>: ';
    private errorMessage: string = '';
    private componentName: string = ACCORDION_GROUP_NAME;
    private nbAccordion: number = 0;
    private arrAccordion: boolean[] = [];
    private nbAccordionOpen: number = 0;

    private mounted(): void {
        this.propsOpenAll = this.$props.openAll;
        this.propsType = this.$props.type == 'light' || this.$props.type == 'noStyle' ? this.$props.type : this.propsType = 'regular';
        for (let i = 0; i < this.$children.length; i++) {
            if (this.checkAccordion(i)) {
                this.$children[i]['accordionID'] = this.nbAccordion;
                if (this.$children[i]['propsIsOpen']) {
                    this.nbAccordionOpen++;
                    this.arrAccordion.push(true);
                } else {
                    this.arrAccordion.push(false);
                }
                if (this.propsType != this.$children[i]['propsType']) {
                    this.$children[i]['propsType'] = this.propsType;
                    this.$children[i]['resetType'](this.propsType);
                }
                this.nbAccordion++;
            }
        }
        if (this.propsOpenAll) {
            this.openAllAccordions();
        }
        if (this.nbAccordion == 0) {
            this.hasError = true;
            this.errorMessage = this.errorDefaultMesage + 'No <' + ACCORDION_NAME + '> found in <' + ACCORDION_GROUP_NAME + '>';
            console.error(this.errorMessage);
        }
    }

    private checkToggleAccordion(accordionID: number, isOpen: boolean): void {
        this.arrAccordion[accordionID] = isOpen;
        if (isOpen) {
            this.nbAccordionOpen++;
        } else {
            this.nbAccordionOpen--;
        }
        this.propsOpenAll = this.nbAccordionOpen == this.nbAccordion ? true : false;
    }

    private checkAccordion(index: number): boolean {
        return this.$children[index]['componentName'] == ACCORDION_NAME ? true : false;
    }

    private openAllAccordions(): void {
        this.propsOpenAll = true;
        this.nbAccordionOpen = this.nbAccordion;
        for (let i = 0; i < this.$children.length; i++) {
            if (i < this.arrAccordion.length) {
                this.arrAccordion[i] = true;
            }
            if (this.checkAccordion(i)) {
                this.$children[i]['animIsActive'] = true;
                this.$children[i]['openAccordion']();
            }
        }
    }

    private closeAllAccordions(): void {
        this.propsOpenAll = false;
        this.nbAccordionOpen = 0;
        for (let i = 0; i < this.$children.length; i++) {
            if (i < this.arrAccordion.length) {
                this.arrAccordion[i] = false;
            }
            if (this.checkAccordion(i)) {
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
