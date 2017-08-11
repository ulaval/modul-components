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

    private componentName: String = SIDEBAR_NAME;

    @Prop({ default: DialogFrom.Bottom })
    private from: DialogFrom;

    @Prop({ default: '100%' })
    private offset: String;

    protected get dialogMode(): DialogMode {
        return DialogMode.Sidebar;
    }

    protected get offsetStyle(): String {

        let offsetValue: string = '';
        if (this.from == 'right') {
            offsetValue = 'margin-left: ' + this.offset;
        } else if (this.from == 'left') {
            offsetValue = 'margin-right: ' + this.offset;
        }

        return offsetValue;
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
