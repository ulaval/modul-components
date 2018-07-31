import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { MENU_ITEM_NAME } from '../component-names';
import IconPlugin from '../icon/icon';
import { BaseOption, MOptionInterface } from '../option/option';
import WithRender from './menu-item.html?style=./menu-item.scss';

@WithRender
@Component
export class MMenuItem extends ModulVue {

    @Prop()
    public iconName: string;
    @Prop()
    public disabled: boolean;

    public root: MOptionInterface; // Menu component
    private hasRoot: boolean = false;

    protected mounted(): void {
        let rootNode: BaseOption | undefined = this.getParent<BaseOption>(p => p instanceof BaseOption);

        if (rootNode) {
            this.root = (rootNode as any) as MOptionInterface;
            this.hasRoot = true;
        } else {
            console.error('m-menu-item need to be inside m-menu');
        }
    }

    private onClick(event: MouseEvent): void {
        if (!this.disabled) {
            if (this.hasRoot) {
                (this.root as MOptionInterface).close();
                this.$emit('click', event);
            }
        } else {
            event.stopPropagation();
        }
    }

    private get hasIconNameProp(): boolean {
        return !!this.iconName;
    }

    private get hasIcon(): boolean {
        if (this.hasRoot) {
            (this.root as MOptionInterface).checkIcon(this.hasIconNameProp);
            return (this.root as MOptionInterface).hasIcon;
        }
        return false;
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }
}

const MenuItemPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(IconPlugin);
        v.component(MENU_ITEM_NAME, MMenuItem);
    }
};

export default MenuItemPlugin;
