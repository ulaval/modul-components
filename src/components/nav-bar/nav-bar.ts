import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './nav-bar.html?style=./nav-bar.scss';
import { NAV_BAR_NAME, NAV_BAR_ITEM_NAME } from '../component-names';

const UNDEFINED: string = 'undefined';
const PAGE_STEP: number = 4;
const POPPER_CLASS_NAME: string = '.m-popper__popper';

export enum MNavbarSkin {
    Regular = 'regular',
    Light = 'light',
    Dark = 'dark',
    Vanilla = 'vanilla',
    Arrow = 'arrow'
}

@WithRender
@Component
export class MNavbar extends ModulVue {

    @Prop({ default: MNavbarSkin.Dark })
    public skin: string;
    @Prop()
    public line: boolean;

    private isAnimActive: boolean = false;

    private itemCount: number = 0;
    private arrItem = new Array();
    private childrenIndexSelected: number;

    protected mounted(): void {
        this.init();
    }

    private init(): void {
        for (let i = 0; i < this.$children.length; i++) {
            if (this.checkNavBarItem(i)) {
                this.$children[i]['id'] = this.itemCount;
                if (this.$children[i]['isSelected']) {
                    this.childrenIndexSelected = i;
                }
                this.$children[i]['unselectItem']();
                this.$children[i]['childrenIndex'] = i;
                this.arrItem.push({
                    id: this.itemCount,
                    isSelected: this.$children[i]['isSelected'],
                    childrenIndex: i
                });
                this.itemCount++;
                this.$children[i]['$on']('click', (id, childrenIndex) => this.changeItem(id, childrenIndex));
            }
        }
        this.$children[this.arrItem[0].childrenIndex]['isFirtsItem'] = true;
        this.$children[this.arrItem[this.arrItem.length - 1].childrenIndex]['isLastItem'] = true;
        this.childrenIndexSelected = this.childrenIndexSelected == undefined ? this.arrItem[0].childrenIndex : this.childrenIndexSelected;
        let childrenSelected = this.$children[this.childrenIndexSelected];
        childrenSelected['selectItem']();
        if (this.propSkin == MNavbarSkin.Light) {
            this.setLinePosition(childrenSelected.$el as HTMLElement);
        }
        if (this.propSkin == MNavbarSkin.Arrow) {
            this.setArrowPosition(childrenSelected.$el as HTMLElement);
        }
    }

    private changeItem(id: number, childrenIndex: number): void {
        if (childrenIndex != this.childrenIndexSelected) {
            this.isAnimActive = true;
            this.arrItem[this.$children[this.childrenIndexSelected]['id']]['isSelected'] = false;
            this.arrItem[id]['isSelected'] = true;
            this.$children[this.childrenIndexSelected]['unselectItem']();
            this.$children[childrenIndex]['selectItem']();
            this.childrenIndexSelected = childrenIndex;
            if (this.propSkin == MNavbarSkin.Light) {
                this.setLinePosition(this.$children[childrenIndex].$el as HTMLElement);
            }
            if (this.propSkin == MNavbarSkin.Arrow) {
                this.setArrowPosition(this.$children[childrenIndex].$el as HTMLElement);
            }
            this.$emit('click');
        }
    }

    private checkNavBarItem(index: number): boolean {
        return this.$children[index]['componentName'] == NAV_BAR_ITEM_NAME ? true : false;
    }

    private setLinePosition(el: HTMLElement): void {
        this.$nextTick(() => {
            let positionX: number = el.offsetLeft;
            let width: number = el.clientWidth;
            this.$refs.line['style']['transform'] = 'translate3d(' + positionX + 'px, 0, 0)';
            this.$refs.line['style']['width'] = width + 'px';
        });
    }

    private setArrowPosition(el: HTMLElement): void {
        this.$nextTick(() => {
            let positionX: number = el.offsetLeft;
            let width: number = el.clientWidth;
            this.$refs.Arrow['style']['transform'] = 'translate3d(' + positionX + 'px, 0, 0)';
            this.$refs.Arrow['style']['width'] = width + 'px';
        });
    }

    private get propSkin(): MNavbarSkin {
        return this.skin == MNavbarSkin.Regular || this.skin == MNavbarSkin.Dark || this.skin == MNavbarSkin.Vanilla || this.skin == MNavbarSkin.Arrow ? this.skin : MNavbarSkin.Light;
    }

    private get propLine(): boolean {
        if (this.line == undefined) {
            return this.propSkin == MNavbarSkin.Light;
        }
        return this.line;
    }

    private get propArrow(): boolean {
        if (this.line == undefined) {
            return this.propSkin == MNavbarSkin.Arrow;
        }
        return this.line;
    }
}

const NavbarPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(NAV_BAR_NAME, MNavbar);
    }
};

export default NavbarPlugin;
