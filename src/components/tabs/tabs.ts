import Vue from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Model } from 'vue-property-decorator';
import WithRender from './tabs.html?style=./tabs.scss';
import { TABS_NAME, TAB_PANE_NAME } from '../component-names';
import { BaseTabs } from '../tab-pane/tab-pane';
import { MTabPane } from '../tab-pane/tab-pane';

export interface MTabsInterface extends Vue {
    model: any;
}

@WithRender
@Component
export class MTabs extends BaseTabs implements MTabsInterface {
    @Prop()
    public value: string;

    public componentName = TABS_NAME;
    private internalValue: string = '';
    private hasModel: boolean = true;

    public get model(): any {
        return this.value;
    }

    public set model(value: any) {
        this.$emit('input', value);
    }
}

const TabsPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(TABS_NAME, MTabs);
    }
};

export default TabsPlugin;
