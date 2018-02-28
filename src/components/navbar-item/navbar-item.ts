import { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './navbar-item.html?style=./navbar-item.scss';
import { NAVBAR_ITEM_NAME } from '../component-names';

export abstract class BaseNavbar extends ModulVue {
    abstract model: string;
    abstract disabled: boolean;
}

export interface MNavbarInterface {
    model: string;
    selectedElem: HTMLElement;
    selecteItem(el: HTMLElement): void;
}

@WithRender
@Component
export class MNavbarItem extends ModulVue {

    @Prop()
    public value: string;
    @Prop()
    public disabled: boolean;

    public root: MNavbarInterface; // Navbar component

    public isFirst: boolean = false;
    public isLast: boolean = false;
    private internalSelected: boolean = false;

    protected mounted(): void {
        let rootNode: BaseNavbar | undefined = this.getParent<BaseNavbar>(p => p instanceof BaseNavbar);

        if (rootNode) {
            this.root = (rootNode as any) as MNavbarInterface;
        } else {
            console.error('m-navbar-item need to be inside m-navbar');
        }

        if (!this.$el.querySelector('a, button')) {
            this.$el.setAttribute('tabindex', '0');
        }
    }

    private get selected(): boolean {
        let selected: boolean = this.$parent instanceof BaseNavbar && this.$parent.model == this.value && !this.disabled;
        if (selected) {
            (this.root as MNavbarInterface).selectedElem = this.$el;
        }
        return selected;
    }

    private get isDisabled(): boolean {
        return (this.$parent instanceof BaseNavbar && this.$parent.disabled) || this.disabled;
    }

    private onClick(event): void {
        if (!this.disabled) {
            (this.root as MNavbarInterface).model = this.value;
            (this.root as MNavbarInterface).selecteItem(this.$el);
            this.$emit('click', event, this.value);
        }
    }
}

const NavbarItemPlugin: PluginObject<any> = {
    install(v, options): void {
        console.warn(NAVBAR_ITEM_NAME + ' is not ready for production');
        v.component(NAVBAR_ITEM_NAME, MNavbarItem);
    }
};

export default NavbarItemPlugin;
