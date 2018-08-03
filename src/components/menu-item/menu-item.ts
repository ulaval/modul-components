import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

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
    isAnimReady: boolean;
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
    // should be initialized to be reactive
    // tslint:disable-next-line:no-null-keyword
    public menuRoot: Menu | null = null;
    // tslint:disable-next-line:no-null-keyword
    public menuItiemGroupRoot: MenuItem | null = null;
    private internalOpen: boolean = false;

    private ariaControls: string = `mMenuItem-${uuid.generate()}`;

    protected mounted(): void {
        let menuRoot: BaseMenu | undefined;
        menuRoot = this.getParent<BaseMenu>(
            p => p instanceof BaseMenu || // these will fail with Jest, but should pass in prod mode
                p.$options.name === 'MMenu' // these are necessary for Jest, but the first two should pass in prod mode
        );

        if (menuRoot) {
            this.menuRoot = (menuRoot as any) as Menu;
        } else {
            console.error('m-menu-item need to be inside m-menu');
        }

        let menuItiemGroupRoot: BaseMenuItem | undefined;
        menuItiemGroupRoot = this.getParent<BaseMenuItem>(
            p => p instanceof BaseMenuItem || // these will fail with Jest, but should pass in prod mode
                p.$options.name === 'MMenuItem' // these are necessary for Jest, but the first two should pass in prod mode
        );

        if (menuItiemGroupRoot) {
            this.menuItiemGroupRoot = (menuItiemGroupRoot as any) as MenuItem;
            this.menuItiemGroupRoot.group = true;
        }
    }

    public get isAnimReady(): boolean {
        return this.menuRoot ? this.menuRoot.isAnimReady : false;
    }

    public get isSelected(): boolean {
        let selected: boolean = !this.isDisabled && !this.group && this.menuRoot ? this.value === this.menuRoot.model : false;
        if (selected && this.menuRoot) {
            this.menuRoot.groupSelectioned = this.menuItiemGroupRoot ? this.menuItiemGroupRoot : undefined;
        }
        return selected;
    }

    private get isUrl(): boolean {
        return !!this.url && !this.group;
    }

    public set propOpen(open: boolean) {
        this.internalOpen = open;
        this.$emit('update:open', open);
    }

    public get propOpen(): boolean {
        return this.internalOpen;
    }

    private toggleOpen(): void {
        this.propOpen = !this.propOpen;
    }

    private get isDisabled(): boolean {
        return this.menuRoot && this.menuRoot.propDisabled ? true : this.disabled;
    }

    private onClick(event: Event): void {
        if (!this.isDisabled && this.menuRoot) {
            if (this.group) {
                this.toggleOpen();
            } else if (this.value !== this.menuRoot.model) {
                this.menuRoot.updateValue(this.value);
                this.menuRoot.onClick(event, this.value);
            }
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
