import Vue from 'vue';
import { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { SIDEBAR_NAME } from '../component-names';
import { BaseWindow, BaseWindowMode, BaseWindowFrom } from '../../mixins/base-window/base-window';

@Component({
    mixins: [BaseWindow]
})
export class MSidebar extends ModulVue {
    @Prop({ default: BaseWindowFrom.Bottom })
    public from: BaseWindowFrom;

    @Prop({ default: '100%' })
    public width: string;

    public componentName: String = SIDEBAR_NAME;

    protected get windowMode(): BaseWindowMode {
        return BaseWindowMode.Sidebar;
    }

    private get marginLeft(): string {
        return this.from == BaseWindowFrom.Right || this.from == BaseWindowFrom.BottomRight ? 'calc(100% - ' + this.width + ')' : '';
    }
}

const SidebarPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(SIDEBAR_NAME, MSidebar);
    }
};

export default SidebarPlugin;
