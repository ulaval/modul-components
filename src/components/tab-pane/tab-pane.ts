import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './tab-pane.html?style=./tab-pane.scss';
import { TAB_PANE_NAME } from '../component-names';

const STATE_DEFAULT: string = 'default';
const STATE_SELECTED: string = 'selected';

@WithRender
@Component
export class MTabPane extends Vue {

    @Prop({ default: '' })
    public label: string;
    @Prop({ default: STATE_DEFAULT })
    public state: string;

    public componentName = TAB_PANE_NAME;

    private tabePaneID: number;
    private propsState: string = STATE_DEFAULT;
    private isSelected: boolean = false;
    private isDisabled: boolean = false;

    protected beforeMount(): void {
        this.checkState(this.state);
    }

    @Watch('state')
    private changeState(newState: string): void {
        this.checkState(newState);
    }

    private checkState(state: string) {
        this.propsState = state != STATE_SELECTED ? STATE_DEFAULT : state;
        this.isSelected = state == STATE_SELECTED;
    }

    private selectTab(): void {
        this.isSelected = true;
        this.propsState = STATE_SELECTED;
    }

    private unselectTab(): void {
        this.isSelected = false;
        this.propsState = STATE_DEFAULT;
    }
}

const TabPannePlugin: PluginObject<any> = {
    install(v, options) {
        v.component(TAB_PANE_NAME, MTabPane);
    }
};

export default TabPannePlugin;
