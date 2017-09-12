import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import uuid from '../../utils/uuid/uuid';
import WithRender from './scroll-top.html?style=./scroll-top.scss';
import { SCROLL_TOP_NAME } from '../component-names';
import { Portal, PortalMixin } from '../../mixins/portal/portal';

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
    mixins: [Portal]
})
export class MScrollTop extends ModulVue {
    @Prop({ default: MScrollTopPosition.Fixe })
    public position: string;

    public componentName = SCROLL_TOP_NAME;
    private scrollBreakPoint: number = window.innerHeight * 1.5;
    private scrollPosition: number;

    private bodyElement: HTMLElement = document.body;
    private visible: boolean = true;
    private show: boolean = false;
    private defaultTargetElVisible: boolean = false;
    // private portalTargetElement: HTMLElement = document.createElement('div');
    private scrollTopId: string = SCROLL_TOP_ID + '-' + uuid.generate();
    private scrollTopPortalId: string;

    protected mounted(): void {
        console.log(this.position);

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
        window.requestAnimFrame = (function() {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();
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

    private onClick(event) {
        let scollDuration: number = 600;
        this.scrollToY(this.scrollTarget, 1500);
        this.$emit('click');
        this.$refs['scrollButton']['blur']();
    }

    private scrollToY(scrollTargetYReceived, speedReceived) {

        let scrollY = window.scrollY || document.documentElement.scrollTop;
        let scrollTargetY = scrollTargetYReceived || 0;
        let speed = speedReceived || 2000;
        let easing = 'easeOutSine';
        let currentTime = 0;
        let time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));

        // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
        let easingEquations = {
            easeOutSine: function(pos) {
                return Math.pow(pos, 0.15);
            }
        };

        function tick() {
            currentTime += 1 / 60;

            let p = currentTime / time;
            let t = easingEquations[easing](p);

            if (p < 1) {
                window.requestAnimFrame(tick);
                window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
            } else {
                window.scrollTo(0, scrollTargetY);
            }
        }

        tick();
    }

    private appendScrollTopToBody(): void {
        this.as<PortalMixin>().appendPortalToBody(SCROLL_TOP_ID, 'm-scrollTop-popover', '0.3s');
        this.scrollTopPortalId = this.as<PortalMixin>().portalId;
        this.visible = true;
    }

    private removeScrollTopToBody(): void {
        this.as<PortalMixin>().removePortal();
    }

    private getScrollTopId(): string {
        return this.position == MScrollTopPosition.Relative ? this.scrollTopId : this.scrollTopPortalId;
    }

    private get hasAdditionalContentSlot(): boolean {
        return !!this.$slots.additionalContent;
    }
}

const ScrollTopPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(SCROLL_TOP_NAME, MScrollTop);
    }
};

export default ScrollTopPlugin;
