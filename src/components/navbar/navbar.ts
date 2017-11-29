import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './navbar.html?style=./navbar.scss';
import { NAVBAR_NAME, NAVBAR_ITEM_NAME } from '../component-names';
import NavBarItemPlugin, { BaseNavBar } from '../navbar-item/navbar-item';

const UNDEFINED: string = 'undefined';
const PAGE_STEP: number = 4;
const POPPER_CLASS_NAME: string = '.m-popper__popper';

export enum MNavbarSkin {
    Regular = 'regular',
    Light = 'light',
    Dark = 'dark',
    Plain = 'plain',
    Arrow = 'arrow'
}

@WithRender
@Component
export class MNavbar extends BaseNavBar {

    @Prop({
        default: MNavbarSkin.Dark,
        validator: value =>
            value == MNavbarSkin.Regular ||
            value == MNavbarSkin.Light ||
            value == MNavbarSkin.Dark ||
            value == MNavbarSkin.Plain ||
            value == MNavbarSkin.Arrow
    })
    public skin: string;
    @Prop()
    public line: boolean;
    @Prop()
    public value: string;
    @Prop({ default: true })
    public margin: boolean;

    public isItemSelected(value, el): boolean {
        if (this.skin == MNavbarSkin.Light && this.value == value && el != undefined) {
            this.setLinePosition(el);
        }
        if (this.skin == MNavbarSkin.Arrow && this.value == value && el != undefined) {
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
            if (index == 0 && arr.length >= 1) {
                child['isFirst'] = true;
            }
            if (arr.length - 1 === index && arr.length > 1) {
                child['isLast'] = true;
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
            setTimeout(() => {
                setTimeout(() => {
                    let positionX: number = el.offsetLeft;
                    let width: number = el.clientWidth;
                    let lineEL: HTMLElement = this.$refs.line as HTMLElement;
                    lineEL.style.transform = 'translate3d(' + positionX + 'px, 0, 0)';
                    lineEL.style.width = width + 'px';
                }, 0);
            }, 0);
        });

    }

    private setArrowPosition(el: HTMLElement): void {
        this.$nextTick(() => {
            setTimeout(() => {
                setTimeout(() => {
                    let positionX: number = el.offsetLeft;
                    let width: number = el.clientWidth;
                    let arrowEL: HTMLElement = this.$refs.Arrow as HTMLElement;
                    arrowEL.style.transform = 'translate3d(' + positionX + 'px, 0, 0)';
                    arrowEL.style.width = width + 'px';
                }, 0);
            }, 0);
        });
    }

    private get propLine(): boolean {
        if (this.line == undefined || this.line == true) {
            return this.skin == MNavbarSkin.Light;
        }
        return this.line;
    }

    private get propArrow(): boolean {
        if (this.line == undefined || this.line == true) {
            return this.skin == MNavbarSkin.Arrow;
        }
        return this.line;
    }
}

const NavbarPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(NAVBAR_NAME, MNavbar);
    }
};

export default NavbarPlugin;
