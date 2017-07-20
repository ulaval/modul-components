import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './nav-bar-item.html?style=./nav-bar-item.scss';
import { NAV_BAR_ITEM_NAME } from '../component-names';

@WithRender
@Component
export class MNavItembar extends Vue {
    @Prop({ default: false })
    public selected: boolean;
    public componentName: string = NAV_BAR_ITEM_NAME;

    private id: number;
    private eventBus: Vue = new Vue();
    private isSelected: boolean = false;
    private childrenIndex: number;
    private isFirtsItem: boolean = false;
    private isLastItem: boolean = false;

    private onClick(): void {
        this.$emit('click');
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

const NavbarItemPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(NAV_BAR_ITEM_NAME, MNavItembar);
    }
};

export default NavbarItemPlugin;
