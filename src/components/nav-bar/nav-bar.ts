import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './nav-bar.html?style=./nav-bar.scss';
import { NAV_BAR_NAME, NAV_BAR_ITEM_NAME } from '../component-names';
import NavBarItemPlugin, { BaseNavBar } from '../nav-bar-item/nav-bar-item';

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
export class MNavbar extends BaseNavBar {

    @Prop({ default: MNavbarSkin.Dark })
    public skin: string;
    @Prop()
    public line: boolean;
    @Prop()
    public value: string;

    private isAnimActive: boolean = false;
    private internalSelectedID: string;

    private itemCount: number = 0;
    private arrItem = new Array();
    private childrenIndexSelected: number;

    public isItemSelected(value, el): boolean {
        if (this.propSkin == MNavbarSkin.Light && this.value == value && el != undefined) {
            this.setLinePosition(el);
        }
        if (this.propSkin == MNavbarSkin.Arrow && this.value == value && el != undefined) {
            this.setArrowPosition(el);
        }
        return this.value == value;
    }

    protected mounted() {
        this.setItem();
        this.$nextTick(() => {
            this.initLine();
        });
    }

    private setItem(): void {
        this.$children.forEach((child, index, arr) => {
            if (index == 0) {
                child['isFirtsItem'] = true;
            }
            if (arr.length - 1 === index) {
                child['isLastItem'] = true;
            }
        });
    }

    private initLine(): void {
        this.$children.forEach((child, index, arr) => {
            if (child.$props.value == this.value) {
                if (this.skin == MNavbarSkin.Light) {
                    this.setLinePosition(child.$el);
                }
                if (this.skin == MNavbarSkin.Arrow) {
                    this.setArrowPosition(child.$el);
                }
            }
        });
    }

    private setLinePosition(el: HTMLElement): void {
        this.$nextTick(() => {
            let positionX: number = el.offsetLeft;
            let width: number = el.clientWidth;
            let lineEL: HTMLElement = this.$refs.line as HTMLElement;
            lineEL.style.transform = 'translate3d(' + positionX + 'px, 0, 0)';
            lineEL.style.width = width + 'px';
        });
    }

    private setArrowPosition(el: HTMLElement): void {
        this.$nextTick(() => {
            let positionX: number = el.offsetLeft;
            let width: number = el.clientWidth;
            let arrowEL: HTMLElement = this.$refs.Arrow as HTMLElement;
            arrowEL.style.transform = 'translate3d(' + positionX + 'px, 0, 0)';
            arrowEL.style.width = width + 'px';
        });
    }

    private get propSkin(): MNavbarSkin {
        return this.skin == MNavbarSkin.Regular || this.skin == MNavbarSkin.Dark || this.skin == MNavbarSkin.Vanilla || this.skin == MNavbarSkin.Arrow ? this.skin : MNavbarSkin.Light;
    }

    private get propLine(): boolean {
        if (this.line == undefined || this.line == true) {
            return this.propSkin == MNavbarSkin.Light;
        }
        return this.line;
    }

    private get propArrow(): boolean {
        if (this.line == undefined || this.line == true) {
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
