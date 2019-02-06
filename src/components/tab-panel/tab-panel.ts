import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { TAB_PANEL_NAME } from '../component-names';
import { MTabsInterface } from '../tabs/tabs';
import WithRender from './tab-panel.html?style=./tab-panel.scss';

export abstract class BaseTabs extends ModulVue {
}

@WithRender
@Component
export class MTabPanel extends ModulVue {

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
        return (this.root as MTabsInterface).model === this.value;
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
        v.prototype.$log.error('MTabPanel will be deprecated in modul v.1.0');

        v.component(TAB_PANEL_NAME, MTabPanel);
    }
};

export default TabPannePlugin;
