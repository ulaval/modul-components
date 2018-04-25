import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './icon-menu.html?style=./icon-menu.scss';
import { ModulVue } from '../../utils/vue/vue';
import { ICON_MENU_NAME } from '../component-names';
import IconPlugin from '../icon/icon';

@WithRender
@Component
export class MIconMenu extends ModulVue {
    @Prop()
    public iconName: string;
    @Prop()
    public title: string;
    @Prop()
    public titreButton: string;
    @Prop({ default: '300px' })
    public width: string;
    @Prop({ default: true })
    public padding: boolean;
    @Prop({ default: true })
    public paddingHeader: boolean;
    @Prop({ default: true })
    public paddingBody: boolean;
    @Prop({ default: true })
    public paddingFooter: boolean;

    private get hasTitle(): boolean {
        return !!this.title;
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }
}

const IconMenuPlugin: PluginObject<any> = {
    install(v, options): void {
        console.debug(ICON_MENU_NAME, 'plugin.install');
        v.use(IconPlugin);
        v.component(ICON_MENU_NAME, MIconMenu);
    }
};

export default IconMenuPlugin;
