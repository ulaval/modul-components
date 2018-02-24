import Vue, { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop, Model } from 'vue-property-decorator';
import WithRender from './tab-panel.html?style=./tab-panel.scss';
import { TAB_PANEL_NAME } from '../component-names';
import { MTabsInterface } from '../tabs/tabs';

export abstract class BaseTabs extends ModulVue {
}

@WithRender
@Component
export class MTabPane extends ModulVue {

    @Prop()
    public label: string;
    @Prop()
    public value: any;
    @Prop()
    public disabled: boolean;

    public root: Vue;
    public inactif: boolean = false;
    private hasModel: boolean = true;

    public created(): void {
        this.getMTabsRoot(this);
    }

    public get selected(): boolean {
        return (this.root as MTabsInterface).model == this.value;
    }

    public onClick(): void {
        (this.root as MTabsInterface).model = this.value;
    }

    private getMTabsRoot(node: Vue): void {
        let rootNode: BaseTabs | undefined = this.getParent<BaseTabs>(p => p instanceof BaseTabs);

        if (rootNode) {
            this.root = rootNode;
        } else {
            console.error('m-tabs-pan need to be inside m-tabs');
        }
    }
}

const TabPannePlugin: PluginObject<any> = {
    install(v, options): void {
        console.warn(TAB_PANEL_NAME + ' is not ready for production');
        v.component(TAB_PANEL_NAME, MTabPane);
    }
};

export default TabPannePlugin;
