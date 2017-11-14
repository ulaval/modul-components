import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './nav-bar-item.html?style=./nav-bar-item.scss';
import { NAV_BAR_ITEM_NAME } from '../component-names';

export abstract class BaseNavBar extends Vue {
    abstract isItemSelected(value: string, el: HTMLElement): boolean;
}

@WithRender
@Component
export class MNavBarItem extends Vue {
    @Prop({ default: false })
    public selected: boolean;
    @Prop()
    public value: string;

    private isFirst: boolean = false;
    private isLast: boolean = false;
    private internalSelected: boolean = false;

    protected mounted() {
        if (!this.$el.querySelector('a, button')) {
            this.$el.setAttribute('tabindex', '0');
        }
    }

    private get propSelected(): boolean {
        if (this.$parent instanceof BaseNavBar) {
            return this.$parent.isItemSelected(this.value, this.$el);
        } else if (this.selected != undefined) {
            return this.selected;
        }
        return this.internalSelected;
    }

    private onClick(): void {
        this.$emit('click', this.value);
    }
}

const NavBarItemPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(NAV_BAR_ITEM_NAME, MNavBarItem);
    }
};

export default NavBarItemPlugin;
