import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './nav-bar.html?style=./nav-bar.scss';
import { NAV_BAR_NAME } from '../component-names';

const UNDEFINED: string = 'undefined';
const PAGE_STEP: number = 4;
const POPPER_CLASS_NAME: string = '.m-popper__popper';

const ICON_POSITION_LEFT: string = 'left';
const ICON_POSITION_RIGHT: string = 'right';

@WithRender
@Component
export class MNavbar extends ModulVue {

    @Prop({ default: () => [{value: 'ele 1', isSelected: false, iconName: 'default'}, {value: 'element #2', isSelected: true}, {value: 'element 3', isSelected: false}] })
    public elements: any[];
    @Prop()
    public mode: string;
    @Prop({ default: ICON_POSITION_LEFT })
    private iconPosition: string;

    private isAnimActive: boolean = false;

    protected mounted(): void {
        this.setLinePosition();
    }

    private setLinePosition(): void {
        ModulVue.nextTick(() => {
            let el: HTMLElement = this.$el.querySelector('.m--is-selected') as HTMLElement;
            let positionX: number = el.offsetLeft;
            let width: number = el.clientWidth;
            this.$refs.line['style']['transform'] = 'translate3d(' + positionX + 'px, 0, 0)';
            this.$refs.line['style']['width'] = width + 'px';
        });
    }

    private onClick(event, index): void {
        this.isAnimActive = true;
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].isSelected = i == index ? true : false;
        }
        this.setLinePosition();
        this.$emit('click', event, index);
    }

    private get propIconPosition(): string {
        return this.iconPosition == ICON_POSITION_RIGHT ? this.iconPosition : ICON_POSITION_LEFT;
    }

}

const NavbarPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(NAV_BAR_NAME, MNavbar);
    }
};

export default NavbarPlugin;
