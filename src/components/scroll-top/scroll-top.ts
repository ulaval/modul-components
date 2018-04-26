import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import uuid from '../../utils/uuid/uuid';
import WithRender from './scroll-top.html?style=./scroll-top.scss';
import { SCROLL_TOP_NAME } from '../component-names';
// import { Portal, PortalMixin } from '../../mixins/portal/portal';
import ScrollTo, { ScrollToDuration } from '../../directives/scroll-to/scroll-to-lib';
import IconPlugin from '../icon/icon';
import ButtonPlugin from '../button/button';
import I18nPlugin from '../i18n/i18n';
import PortalPlugin from 'portal-vue';

export enum MScrollTopPosition {
    Fixe = 'fixe',
    Relative = 'relative'
}

declare global {
    interface Window { requestAnimFrame: any; }
}

const SCROLL_TOP_ID: string = 'MScrollTop';

@WithRender
@Component({
    // mixins: [Portal]
})
export class MScrollTop extends ModulVue {
    @Prop({
        default: MScrollTopPosition.Fixe,
        validator: value =>
            value == MScrollTopPosition.Fixe ||
            value == MScrollTopPosition.Relative
    })
    public position: string;
    @Prop({
        default: ScrollToDuration.Regular,
        validator: value =>
            value == ScrollToDuration.Regular ||
            value == ScrollToDuration.Slow ||
            value == ScrollToDuration.Fast ||
            value == ScrollToDuration.Null
    })
    public duration: string;

    private scrollBreakPoint: number = window.innerHeight * 1.5;
    private scrollPosition: number;

    private visible: boolean = true;
    private show: boolean = false;
    private defaultTargetElVisible: boolean = false;
    // private portalTargetElement: HTMLElement = document.createElement('div');
    private scrollTopId: string = SCROLL_TOP_ID + '-' + uuid.generate();
    private scrollTopPortalId: string;

    protected created(): void {
        if (this.position != MScrollTopPosition.Relative) {
            this.visible = false;
            this.defaultTargetElVisible = false;
            this.$nextTick(() => {
                this.appendScrollTopToBody();
            });
            this.$modul.event.$on('scroll', this.onScroll);
        } else {
            this.defaultTargetElVisible = true;
            this.visible = true;
            this.$nextTick(() => {
                this.show = true;
            });
        }
    }

    protected beforeDestroy(): void {
        this.removeScrollTopToBody();
        this.$modul.event.$off('scroll', this.onScroll);
    }

    private onScroll(e): void {
        this.scrollPosition = window.pageYOffset;
        this.scrollPosition > this.scrollBreakPoint ? this.show = true : this.show = false;
    }

    private get scrollTarget(): number {
        return this.position == MScrollTopPosition.Relative ? this.$el.offsetTop : 0;
    }

    private onClick(event): void {
        ScrollTo.startScroll(this.$modul.bodyEl, this.scrollTarget, this.propDuration);
        (this.$refs.scrollButton as HTMLElement).blur();
        this.$emit('click');
    }

    private appendScrollTopToBody(): void {
        // this.as<PortalMixin>().appendPortalToBody(SCROLL_TOP_ID, 'm-scrollTop-popover', '0.3s');
        // this.scrollTopPortalId = this.as<PortalMixin>().portalId;
        // this.visible = true;
    }

    private removeScrollTopToBody(): void {
        // this.as<PortalMixin>().removePortal();
    }

    private getScrollTopId(): string {
        return this.position == MScrollTopPosition.Relative ? this.scrollTopId : this.scrollTopPortalId;
    }

    private get propDuration(): ScrollToDuration {
        return this.duration == ScrollToDuration.Null || this.duration == ScrollToDuration.Slow || this.duration == ScrollToDuration.Fast ? this.duration : ScrollToDuration.Regular;
    }

    private get hasAdditionalContentSlot(): boolean {
        return !!this.$slots.additionalContent;
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
