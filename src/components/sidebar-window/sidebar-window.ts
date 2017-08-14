import Vue from 'vue';
import { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { SIDEBAR_NAME } from '../component-names';
import { DialogTemplate, DialogMode, DialogFrom } from '../../mixins/base-window/base-window';

@Component({
    mixins: [DialogTemplate]
})
export class MSidebar extends ModulVue {
    @Prop({ default: DialogFrom.Bottom })
    public from: DialogFrom;

    @Prop({ default: '100%' })
    public width: string;

    public componentName: String = SIDEBAR_NAME;

    protected get dialogMode(): DialogMode {
        return DialogMode.Sidebar;
    }

    private getDialogFrom(): String {
        return this.from;
    }

    private get marginLeft(): string {
        return this.from == DialogFrom.Right || this.from == DialogFrom.BottomRight ? 'calc(100% - ' + this.width + ')' : '';
    }
}

const SidebarPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(SIDEBAR_NAME, MSidebar);
    }
};

export default SidebarPlugin;
