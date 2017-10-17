import Vue from 'vue';
import { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { SIDEBAR_NAME } from '../component-names';
import { BaseWindow, BaseWindowMode, BaseWindowFrom } from '../../mixins/base-window/base-window';

@Component({
    mixins: [BaseWindow]
})
export class MSidebar extends ModulVue {
    @Prop({
        default: BaseWindowFrom.Bottom,
        validator: value =>
            value == BaseWindowFrom.Top ||
            value == BaseWindowFrom.Right ||
            value == BaseWindowFrom.Left ||
            value == BaseWindowFrom.Bottom ||
            value == BaseWindowFrom.BottomRight ||
            value == BaseWindowFrom.BottomLeft
    })
    public from: BaseWindowFrom;
    @Prop()
    public width: string;

    protected get windowMode(): BaseWindowMode {
        return BaseWindowMode.Sidebar;
    }

    private get marginLeft(): string {
        return this.from == BaseWindowFrom.Right || this.from == BaseWindowFrom.BottomRight ? 'calc(100% - ' + this.propWidth + ')' : '';
    }

    private get propWidth(): string {
        if (this.width == undefined || this.width == '') {
            if (this.from == BaseWindowFrom.Top || this.from == BaseWindowFrom.Bottom) {
                return '100%';
            } else {
                return '50%';
            }
        } else {
            return this.width;
        }
    }
}

const SidebarPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(SIDEBAR_NAME, MSidebar);
    }
};

export default SidebarPlugin;
