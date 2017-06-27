import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './tabs.html?style=./tabs.scss';
import { TABS_NAME } from '../component-names';
import { TAB_PANE_NAME } from '../component-names';

@WithRender
@Component
export class MTabs extends Vue {
    @Prop({ default: '' })
    public mode: string;

    public componentName = TABS_NAME;
    private nbTabPane: number = 0;
    private arrTabPane = new Array();
    private indexTabPaneSelected: number = 0;

    private mounted(): void {
        for (let i = 0; i < this.$children.length; i++) {
            if (this.checkTabPane(i)) {
                this.$children[i]['tabePaneID'] = this.nbTabPane;
                if (this.$children[i]['isSelected'] ) {
                    this.indexTabPaneSelected = this.nbTabPane;
                }
                this.$children[i]['unselectTab']();
                this.arrTabPane.push({
                    id: this.nbTabPane,
                    label: this.$children[i]['label'],
                    isSelected: this.$children[i]['isSelected'],
                    childrenNumber: i
                });
                this.nbTabPane++;
            }
        }
        this.$children[this.arrTabPane[this.indexTabPaneSelected].childrenNumber]['selectTab']();
    }

    private changeTab(tabIndex) {
        this.indexTabPaneSelected = tabIndex;
        for (let i = 0; i < this.$children.length; i++) {
            if (this.checkTabPane(i)) {
                if (this.$children[i]['tabePaneID'] == tabIndex) {
                    this.$children[i]['selectTab']();
                    this.arrTabPane[tabIndex]['isSelected'] = true;
                } else {
                    this.$children[i]['unselectTab']();
                    this.arrTabPane[tabIndex]['isSelected'] = false;
                }
            }
        }
    }

    private checkTabPane(index: number): boolean {
        return this.$children[index]['componentName'] == TAB_PANE_NAME ? true : false;
    }
}

const TabsPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(TABS_NAME, MTabs);
    }
};

export default TabsPlugin;
