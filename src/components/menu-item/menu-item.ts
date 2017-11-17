import Vue from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './menu-item.html?style=./menu-item.scss';
import { MENU_ITEM_NAME } from '../component-names';
import { MOptionsMenu } from '../menu/menu';

@WithRender
@Component
export class MOptionsMenuItem extends ModulVue {

    @Prop()
    public iconName: string;
    @Prop()
    public disabled: boolean;

    private onClick(event: MouseEvent): void {
        if (!this.disabled) {
            let parentMenu: MOptionsMenu | undefined = this.getParent<MOptionsMenu>(p => p instanceof MOptionsMenu);
            if (parentMenu) {
                parentMenu.close();
            }
            this.$emit('click', event);
        } else {
            event.stopPropagation();
        }
    }

    private onKeydownEnter(event: Event) {
        if (!this.disabled) {
            let parentMenu: MOptionsMenu | undefined = this.getParent<MOptionsMenu>(p => p instanceof MOptionsMenu);
            if (parentMenu) {
                parentMenu.close();
            }
        }
    }

    private get hasIcon(): boolean {
        return !!this.iconName;
    }

    private get hasSlot(): boolean {
        return !!this.$slots.default;
    }
}

const MenuPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(MENU_ITEM_NAME, MOptionsMenuItem);
    }
};

export default MenuPlugin;
