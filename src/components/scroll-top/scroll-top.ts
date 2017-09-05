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
    private scrollBreakPoint: number = window.innerHeight;
    private visible: boolean = true;

    protected mounted(): void {
        console.log(this.scrollBreakPoint);
        if (this.position != 'relative') {
            this.visible = false;
            this.$mWindow.event.$on('scroll', this.onScroll);
        }
    }

    protected beforeDestroy(): void {
        this.$mWindow.event.$off('scroll', this.onScroll);
    }

    private onScroll(e): void {
        let scrollPosition = window.pageYOffset;
        scrollPosition > this.scrollBreakPoint ? this.visible = true : this.visible = false;
    }

    private onClick(event) {
        let scollDuration: number = 600;
        let scrollStep: number = -window.scrollY / (scollDuration / 20);
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
