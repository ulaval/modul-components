import PortalPlugin from 'portal-vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ScrollToDuration } from '../../utils';
import { ModulVue } from '../../utils/vue/vue';
import ButtonPlugin from '../button/button';
import { SCROLL_TOP_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import IconPlugin from '../icon/icon';
import WithRender from './scroll-top.html?style=./scroll-top.scss';

export enum MScrollTopPosition {
    Fixed = 'fixed',
    Relative = 'relative'
}

declare global {
    interface Window { requestAnimFrame: any; }
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

    @Prop({ default: window.innerHeight * 0.2 })
    public scrollBreakPoint: number;

    show: boolean = false;

    created(): void {
        if (this.isPositionFixed) {
            this.$modul.event.$on('scroll', this.onScroll);
        } else {
            this.$nextTick(() => {
                this.show = true;
            });
        }
    }

    onClick(): void {
        this.$scrollTo.goToTop(this.duration);
        this.$emit('click');
    }

    onScroll(): void {
        let scrollPosition: number = window.pageYOffset;
        this.$nextTick(() => {
            this.show = scrollPosition > this.scrollBreakPoint;
        });
    }

    get isPositionFixed(): boolean {
        return this.position === MScrollTopPosition.Fixed;
    }

}

const ScrollTopPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.warn(SCROLL_TOP_NAME + ' is not ready for production');
        v.use(IconPlugin);
        v.use(ButtonPlugin);
        v.use(I18nPlugin);
        v.use(PortalPlugin);
        v.component(SCROLL_TOP_NAME, MScrollTop);
    }
};

export default ScrollTopPlugin;
