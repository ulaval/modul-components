import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './tabs.html?style=./tabs.scss';
import { TABS_NAME, TAB_PANE_NAME } from '../component-names';
import { MTabPane } from '../tab-pane/tab-pane';

const ASPECT_REGULAR: string = 'regular';
const ASPECT_LIGHT: string = 'light';
const ASPECT_DARK: string = 'dark';
const ASPECT_NO_STYLE: string = 'no-style';

@WithRender
@Component
export class MTabs extends Vue {
    @Prop({ default: ASPECT_LIGHT })
    public aspect: string;

    public componentName = TABS_NAME;
    private nbTabPane: number = 0;
    private arrTabPane = new Array();
    private indexTabPaneSelected: number = 0;
    private loading = true;

    protected mounted(): void {
        for (let i = 0; i < this.$children.length; i++) {
            if (this.checkTabPane(i)) {
                let tabPane: MTabPane = this.$children[i] as MTabPane;
                tabPane.id = this.nbTabPane;
                if (tabPane.isSelected ) {
                    this.indexTabPaneSelected = this.nbTabPane;
                }
                tabPane.unselectTab();
                this.arrTabPane.push({
                    id: this.nbTabPane,
                    value: tabPane.label,
                    isSelected: tabPane.isSelected,
                    childrenNumber: i
                });
                this.nbTabPane++;
            }
        }
        (this.$children[this.arrTabPane[this.indexTabPaneSelected].childrenNumber] as MTabPane).selectTab();
        this.loading = false;
    }

    private changeTab(index: number): void {
        this.indexTabPaneSelected = index;
        for (let i = 0; i < this.$children.length; i++) {
            if (this.checkTabPane(i)) {
                let tabPane: MTabPane = this.$children[i] as MTabPane;
                if (tabPane.id == index) {
                    tabPane.selectTab();
                    tabPane.isSelected = true;
                } else {
                    tabPane.unselectTab();
                    this.arrTabPane[index].isSelected = false;
                }
            }
        }
    }

    private checkTabPane(index: number): boolean {
        return (this.$children[index] as MTabPane).componentName == TAB_PANE_NAME ? true : false;
    }

    private get propAspect(): string {
        return this.aspect == ASPECT_REGULAR || this.aspect == ASPECT_DARK || this.aspect == ASPECT_NO_STYLE ? this.aspect : ASPECT_LIGHT;
    }
}

const TabsPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(TABS_NAME, MTabs);
    }
};

export default TabsPlugin;
