import Vue from 'vue';
import { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { SIDEBAR_NAME } from '../component-names';
import { DialogTemplate, DialogMode, DialogFrom } from '../../mixins/dialog-template/dialog-template';

@Component({
    mixins: [DialogTemplate]
})
export class MSidebar extends ModulVue {

    private componentName: string = SIDEBAR_NAME;

    @Prop({ default: DialogFrom.Bottom })
    private from: DialogFrom;

    protected get dialogMode(): DialogMode {
        return DialogMode.Sidebar;
    }

    private getPanelDirection(): String {
        return this.from;
    }

}

const SidebarPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(SIDEBAR_NAME, MSidebar);
    }
};

export default SidebarPlugin;
