import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import AccordionTransitionPlugin from '../accordion/accordion-transition';
import { MENU_ITEM_NAME } from '../component-names';
import { BaseMenu, Menu } from '../menu/menu';
import WithRender from './menu-item.html?style=./menu-item.scss';

export abstract class BaseMenuItem extends ModulVue {
}

export interface MenuItem {
    group: boolean;
    propOpen: boolean;
    selected: boolean;
    groupSelected: boolean;
    insideGroup: boolean;
}

@WithRender
@Component
export class MMenuItem extends BaseMenuItem implements MenuItem {
    @Prop()
    public open: boolean;
    @Prop()
    public value: string;
    @Prop()
    public label: string;
    @Prop()
    public url: string;
    @Prop()
    public iconName: string;
    @Prop()
    public disabled: boolean;

    public group: boolean = false;
    public selected: boolean = false;
    public groupSelected: boolean = false;
    public insideGroup = false;
    // should be initialized to be reactive
    // tslint:disable-next-line:no-null-keyword
    public menuRoot: Menu | null = null;
    // tslint:disable-next-line:no-null-keyword
    public groupItemRoot: MenuItem | null = null;
    private internalOpen: boolean = false;

    private ariaControls: string = `mMenuItem-${uuid.generate()}-controls`;

    protected mounted(): void {
        let menuRoot: BaseMenu | undefined = this.getParent<BaseMenu>(p => p instanceof BaseMenu || p.$options.name === 'MMenu');
        if (menuRoot) {
            this.menuRoot = (menuRoot as any) as Menu;
        } else {
            console.error('<m-menu-item> need to be inside <m-menu>');
        }

        this.$children.forEach(item => {
            if (item instanceof MMenuItem) {
                this.group = true;
            }
        });

        this.propOpen = this.open;
    }

    @Watch('open')
    private openChanged(open: boolean): void {
        this.propOpen = open;
    }

    public set propOpen(open: boolean) {
        if (this.group) {
            this.internalOpen = open;
            this.$emit('update:open', open);
        }
    }

    public get propOpen(): boolean {
        return this.internalOpen;
    }

    public get isAnimReady(): boolean {
        return this.menuRoot ? this.menuRoot.animReady : false;
    }

    private get isUrl(): boolean {
        return !!this.url && !this.group;
    }

    private toggleOpen(): void {
        this.propOpen = !this.propOpen;
    }

    public get isDisabled(): boolean {
        return this.menuRoot && this.menuRoot.propDisabled ? true : this.disabled;
    }

    private onClick(event: Event): void {
        if (!this.isDisabled && this.menuRoot && !this.menuRoot.closeOnSelectionInAction) {
            if (this.group) {
                this.toggleOpen();
            } else if (this.value !== this.menuRoot.model) {
                this.menuRoot.updateValue(this.value);
                this.menuRoot.onClick(event, this.value);
            }
            this.$emit('click', event);
        }
    }
}

const MenuPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(AccordionTransitionPlugin);
        v.component(MENU_ITEM_NAME, MMenuItem);
    }
};

export default MenuPlugin;
