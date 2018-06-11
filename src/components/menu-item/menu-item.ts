import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { MENU_ITEM_NAME } from '../component-names';
import WithRender from './menu-item.html?style=./menu-item.scss';

export abstract class BaseMenu extends ModulVue {
}

export interface MMenuInterface {
    hasIcon: boolean;
    checkIcon(el: boolean): void;
    close(): void;
}

export enum MMenuItemAction {
    Default = 'default',
    Add = 'add',
    Edit = 'edit',
    Delete = 'delete',
    Archive = 'archive'
}

@WithRender
@Component
export class MMenuItem extends ModulVue {

    @Prop()
    public iconName: string;
    @Prop()
    public disabled: boolean;
    @Prop({
        default: MMenuItemAction.Default,
        validator: value =>
            value === MMenuItemAction.Default ||
            value === MMenuItemAction.Add ||
            value === MMenuItemAction.Edit ||
            value === MMenuItemAction.Delete ||
            value === MMenuItemAction.Archive
    })
    public action: string;

    public root: MMenuInterface; // Menu component
    private hasRoot: boolean = false;

    protected mounted(): void {
        let rootNode: BaseMenu | undefined = this.getParent<BaseMenu>(p => p instanceof BaseMenu);

        if (rootNode) {
            this.root = (rootNode as any) as MMenuInterface;
            this.hasRoot = true;
        } else {
            console.error('m-menu-item need to be inside m-menu');
        }
    }

    private onClick(event: MouseEvent): void {
        if (!this.disabled) {
            if (this.hasRoot) {
                (this.root as MMenuInterface).close();
                this.$emit('click', event);
            }
        } else {
            event.stopPropagation();
        }
    }

    private get hasIconNameProp(): boolean {
        return !!this.iconName || this.action !== MMenuItemAction.Default;
    }

    private get hasIcon(): boolean {
        if (this.hasRoot) {
            (this.root as MMenuInterface).checkIcon(this.hasIconNameProp);
            return (this.root as MMenuInterface).hasIcon || this.action !== MMenuItemAction.Default;
        }
        return false;
    }

    private get iconInfo(): any {
        let iconName: string = '';
        let label: string | undefined;
        switch (this.action) {
            case MMenuItemAction.Add:
                iconName = 'add';
                label = this.$i18n.translate('m-menu:add');
                break;
            case MMenuItemAction.Edit:
                iconName = 'edit';
                label = this.$i18n.translate('m-menu:edit');
                break;
            case MMenuItemAction.Delete:
                iconName = 'delete';
                label = this.$i18n.translate('m-menu:delete');
                break;
            case MMenuItemAction.Archive:
                iconName = 'archive';
                label = this.$i18n.translate('m-menu:archive');
                break;
            default:
                iconName = this.iconName;
                label = undefined;
                break;
        }
        return { 'iconName': iconName, 'label': label };
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }
}

const MenuPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(MENU_ITEM_NAME, MMenuItem);
    }
};

export default MenuPlugin;
