import Vue, { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop, Model } from 'vue-property-decorator';
import WithRender from './tabs.html?style=./tabs.scss';
import { TABS_NAME, TAB_PANEL_NAME } from '../component-names';
import { BaseTabs } from '../tab-panel/tab-panel';

export interface MTabsInterface extends Vue {
    model: any;
}

@WithRender
@Component
export class MTabs extends BaseTabs implements MTabsInterface {
    @Prop()
    public value: string;

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
    install(v, options): void {
        v.prototype.$log.error('MTabs will be deprecated in modul v.1.0');

        v.component(TABS_NAME, MTabs);
    }
};

export default TabsPlugin;
