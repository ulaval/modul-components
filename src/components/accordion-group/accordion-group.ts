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
    @Prop({ default: false })
    private openAllAccordion: boolean;

    private accordionsAreOpen: boolean = false;
    private hasError: boolean = false;
    private nbAccordion: number = 0;

    private mounted() {
        this.accordionsAreOpen = this.openAllAccordion;
        for (let i = 0; i < this.$children.length; i++) {
            if (this.checkAccordion(i)) {
                this.nbAccordion++;
            }
        }

        if (this.accordionsAreOpen) {
            this.openAllAccordions();
        }
    }

    private toggleAccordion() {
        let nbAccordionOpen: number = 0;
        for (let i = 0; i < this.$children.length; i++) {
            if (this.checkAccordion(i) && this.$children[i].accordionIsOpen) {
                nbAccordionOpen++;
            }
        }
        this.accordionsAreOpen = nbAccordionOpen == this.nbAccordion ? true : false;
    }

    private checkAccordion(index: number): boolean {
        return this.$children[index].$options._componentTag == ACCORDION_NAME ? true : false;
    }

    private openAllAccordions() {
        this.accordionsAreOpen = true;
        for (let i = 0; i < this.$children.length; i++) {
            if (this.checkAccordion(i)) {
                this.$children[i].openAccordion();
            }
        }
    }

    private closeAllAccordions() {
        this.accordionsAreOpen = false;
        for (let i = 0; i < this.$children.length; i++) {
            if (this.checkAccordion(i)) {
                this.$children[i].closeAccordion();
            }
        }
    }

    private get accordionsAreAllOpen(): boolean {
        return this.accordionsAreOpen;
    }
}

const AccordionGroupPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(ACCORDION_GROUP_NAME, MAccordionGroup);
    }
};

export default AccordionGroupPlugin;
