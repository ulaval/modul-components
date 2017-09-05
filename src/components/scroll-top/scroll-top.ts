import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './scroll-top.html?style=./scroll-top.scss';
import { SCROLL_TOP_NAME } from '../component-names';

export enum MScrollTopPosition {
    STICKY = 'sticky',
    RELATIVE = 'relative'
}

@WithRender
@Component
export class MScrollTop extends ModulVue {
    @Prop({ default: MScrollTopPosition.STICKY })
    public position: string;

    public componentName = SCROLL_TOP_NAME;
    private scrollBreakPoint: number = window.innerHeight * 2;
    private isFocus: boolean = false;

    protected mounted(): void {
        console.log(this.scrollBreakPoint);
        this.$mWindow.event.$on('scroll', this.onScroll);
    }

    private update(): void {
        console.log('scroll');
    }

    private scrollTop(): void {
        console.log(document.body.offsetHeight);
    }

    private onScroll(e): void {
        console.log('scroll');
    }

    private onClick(event) {
        console.log(this.$el);
        let scollDuration: number = 600;
        let scrollStep: number = -window.scrollY / (scollDuration / 15);
        let scrollInterval = setInterval(() => {
            if (window.scrollY != 0) {
                window.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
            }
        }, 15);

        this.$emit('click');
        this.$el.blur();
    }

}

const ScrollTopPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(SCROLL_TOP_NAME, MScrollTop);
    }
};

export default ScrollTopPlugin;
