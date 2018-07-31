import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import AccordionTransitionPlugin from '../accordion/accordion-transition';
import { MENU_ITEM_NAME } from '../component-names';
import { BaseMenu, Menu } from '../menu/menu';
import WithRender from './menu-item.html?style=./menu-item.scss';

@WithRender
@Component
export class MMenuItem extends ModulVue {

    // @Prop()
    // public open: string;
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
    @Prop({ default: false })
    public group: boolean;

    private hasRoot: boolean = false;
    private open: boolean = false;

    // should be initialized to be reactive
    // tslint:disable-next-line:no-null-keyword
    private root: Menu | null = null;

    protected mounted(): void {

        let root: BaseMenu | undefined;
        root = this.getParent<BaseMenu>(
            p => p instanceof BaseMenu || // these will fail with Jest, but should pass in prod mode
                p.$options.name === 'MMenu' // these are necessary for Jest, but the first two should pass in prod mode
        );

        if (root) {
            this.root = (root as any) as Menu;
        } else {
            console.error('m-menu-item need to be inside m-menu');
        }

    }

    public get isSelected(): boolean {
        return !!this.root && !this.disabled && this.value === this.root.model;
    }

    // private get isOpen(): boolean {
    //     return this.open;
    // }

    private get hasChildrenSelected(): boolean {
        return this.$parent.$props.group && this.isSelected;
    }

    // protected get isOpen(): boolean {
    //     return (!!this.root && !this.disabled && this.isSelected) || !!this.root && this.hasChildrenSelected === this.root.model;
    // }

    public get insideGroup(): boolean {
        return this.$parent.$props.group;
    }

    private onClick(event: Event): void {
        if (!this.disabled && this.root) {
            this.root.onClick(this.value, event);
            if (this.value !== this.root.model) {
                this.root.updateValue(this.value);
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
