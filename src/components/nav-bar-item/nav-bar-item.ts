import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './nav-bar-item.html?style=./nav-bar-item.scss';
import { NAV_BAR_ITEM_NAME } from '../component-names';

@WithRender
@Component
export class MNavBarItem extends Vue {
    @Prop({ default: false })
    public selected: boolean;

    public componentName: string = NAV_BAR_ITEM_NAME;

    private id: number;
    private propFocus: boolean = true;
    private eventBus: Vue = new Vue();
    private isSelected: boolean = false;
    private childrenIndex: number;
    private isFirtsItem: boolean = false;
    private isLastItem: boolean = false;

    protected mounted() {
        if (!this.$el.querySelector('a, button')) {
            this.$el.setAttribute('tabindex', '0');
        }
    }

    private onClick(): void {
        this.$emit('click', this.id);
        this.eventBus.$emit('click', this.id, this.childrenIndex);
    }

    private selectItem(): void {
        this.isSelected = true;
    }

    private unselectItem(): void {
        this.isSelected = false;
    }

    private get propSelected(): boolean {
        this.isSelected = this.selected;
        return this.selected;
    }
}

const NavBarItemPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(NAV_BAR_ITEM_NAME, MNavBarItem);
    }
};

export default NavBarItemPlugin;
