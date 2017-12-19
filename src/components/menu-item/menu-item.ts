import { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './menu-item.html?style=./menu-item.scss';
import { MENU_ITEM_NAME } from '../component-names';
import { MMenu } from '../menu/menu';

export abstract class BaseMenu extends ModulVue {
}

export interface MMenuInterface {
    hasIcon: boolean;
    setValue(value: string): void;
    checkIcon(el: boolean): void;
    close(): void;
}

@WithRender
@Component
export class MMenuItem extends ModulVue {

    @Prop()
    public iconName: string;
    @Prop()
    public disabled: boolean;
    @Prop()
    public value: string;

    public root: MMenuInterface; // Menu component

    protected mounted() {
        let rootNode: BaseMenu | undefined = this.getParent<BaseMenu>(p => p instanceof BaseMenu);

        if (rootNode) {
            this.root = (rootNode as any) as MMenuInterface;
        } else {
            console.error('m-menu-item need to be inside m-menu');
        }
    }

    private onClick(event: MouseEvent): void {
        if (!this.disabled) {
            if (this.root) {
                (this.root as MMenuInterface).close();
            }
            this.$emit('click', event, this.value);
            (this.root as MMenuInterface).setValue(this.value);
        } else {
            event.stopPropagation();
        }
    }

    private get hasIconNameProp(): boolean {
        return !!this.iconName;
    }

    private get hasIcon(): boolean {
        (this.root as MMenuInterface).checkIcon(this.hasIconNameProp);
        return (this.root as MMenuInterface).hasIcon;
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }
}

const MenuPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(MENU_ITEM_NAME, MMenuItem);
    }
};

export default MenuPlugin;
