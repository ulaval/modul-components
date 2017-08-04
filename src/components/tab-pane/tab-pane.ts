import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './tab-pane.html?style=./tab-pane.scss';
import { TAB_PANE_NAME } from '../component-names';

@WithRender
@Component
export class MTabPane extends Vue {

    @Prop({ default: '' })
    public label: string;
    @Prop({ default: false })
    public selected: boolean;

    public componentName = TAB_PANE_NAME;
    public id: number;
    public isSelected: boolean = false;

    public selectTab(): void {
        this.isSelected = true;
    }

    public unselectTab(): void {
        this.isSelected = false;
    }

    private get propSelected(): boolean {
        this.isSelected = this.selected;
        return this.selected;
    }
}

const TabPannePlugin: PluginObject<any> = {
    install(v, options) {
        v.component(TAB_PANE_NAME, MTabPane);
    }
};

export default TabPannePlugin;
