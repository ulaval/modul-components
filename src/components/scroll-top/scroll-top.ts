import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import ScrollToPlugin, { ScrollToDuration } from '../../utils/scroll-to/scroll-to';
import { ModulVue } from '../../utils/vue/vue';
import { SCROLL_TOP_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import IconPlugin from '../icon/icon';
import WithRender from './scroll-top.html?style=./scroll-top.scss';

export enum MScrollTopPosition {
    Fixed = 'fixed',
    Relative = 'relative'
}

@WithRender
@Component
export class MScrollTop extends ModulVue {
    @Prop({
        default: MScrollTopPosition.Fixed,
        validator: value =>
            value === MScrollTopPosition.Fixed ||
            value === MScrollTopPosition.Relative
    })
    public position: string;
    @Prop({
        default: ScrollToDuration.Regular,
        validator: value =>
            value === ScrollToDuration.Regular ||
            value === ScrollToDuration.Long
    })
    public duration: ScrollToDuration;

    show: boolean = false;

    scrollTopBreakPoint: number = window.innerHeight * 0.2;

    @Emit('click')
    public onClick(event: Event): void {
        this.$scrollTo.goToTop(this.duration);
    }

    created(): void {
        if (this.isPositionFixed) {
            this.$modul.event.$on('scroll', this.onScroll);
        } else {
            this.show = true;
        }
    }

    onScroll(): void {
        let scrollPosition: number = window.pageYOffset;
        this.show = scrollPosition > this.scrollTopBreakPoint;
    }

    get isPositionFixed(): boolean {
        return this.position === MScrollTopPosition.Fixed;
    }

}

const ScrollTopPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(IconPlugin);
        v.use(I18nPlugin);
        v.use(ScrollToPlugin);
        v.component(SCROLL_TOP_NAME, MScrollTop);
    }
};

export default ScrollTopPlugin;
