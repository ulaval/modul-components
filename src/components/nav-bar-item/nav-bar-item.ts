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

    private internalSelected: boolean = false;
    private numberChild: number;
    private childIndex: string;
    private beforeChildIndex: string;
    private internalIsLast: boolean = false;

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

    private get isFirst(): boolean {
        return (this.$parent instanceof BaseNavBar && this.$parent.$children.length >= 1) ? this.$parent.$children['0'].value == this.value : false;
    }

    private get isLast(): boolean {
        if (this.$parent instanceof BaseNavBar) {
            this.numberChild = this.$parent.$children.length;
            this.childIndex = (this.numberChild - 1).toString();
            if (this.$parent.$children[this.childIndex].value == this.value) {
                this.internalIsLast = true;
            }
            if (this.numberChild > 1) {
                this.$nextTick(() => {
                    this.beforeChildIndex = (this.numberChild - 2).toString();
                    this.$parent.$children[this.beforeChildIndex].isLast = false;
                });
            }
        }
        return (this.$parent instanceof BaseNavBar && this.$parent.$children.length > 1) ? this.internalIsLast : false;
    }

    private set isLast(value) {
        this.internalIsLast = value;
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
