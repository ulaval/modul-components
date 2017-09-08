import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import uuid from '../../utils/uuid/uuid';
import WithRender from './scroll-top.html?style=./scroll-top.scss';
import { SCROLL_TOP_NAME } from '../component-names';

export enum MScrollTopPosition {
    STICKY = 'sticky',
    RELATIVE = 'relative'
}

declare global {
    interface Window { requestAnimFrame: any; }
}

const SCROLL_TOP_ID: string = 'MScrollTop';

@WithRender
@Component
export class MScrollTop extends ModulVue {
    @Prop({ default: MScrollTopPosition.STICKY })
    public position: string;

    public componentName = SCROLL_TOP_NAME;
    private scrollBreakPoint: number = window.innerHeight * 0.75;
    private visible: boolean = true;
    private scrollPosition: number;
    private bodyElement: HTMLElement = document.body;
    private portalTargetElement: HTMLElement = document.createElement('div');
    private scrollTopId: string = SCROLL_TOP_ID + '-' + uuid.generate();
    private scrollTopPortalId: string = SCROLL_TOP_ID + '-portal-' + uuid.generate();

    protected mounted(): void {
        if (this.position != 'relative') {
            this.visible = false;
            this.$mWindow.event.$on('scroll', this.onScroll);
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
        this.$mWindow.event.$off('scroll', this.onScroll);
    }

    private onScroll(e): void {
        this.scrollPosition = window.pageYOffset;
        this.scrollPosition > this.scrollBreakPoint ? this.visible = true : this.visible = false;
    }

    // Need to be modified
    private get scrollTarget(): number {
        return this.position == MScrollTopPosition.RELATIVE ? 0 : 0;
    }

    private onClick(event) {
        let scollDuration: number = 600;
        this.scrollToY(this.scrollTarget, 1500);
        this.$emit('click');
        this.$el.blur();
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
        this.portalTargetElement.setAttribute('id', this.scrollTopPortalId);
        this.portalTargetElement.setAttribute('class', 'm-spinner-popover');
        this.portalTargetElement.style.position = 'relative';
        this.bodyElement.appendChild(this.portalTargetElement);

        this.$mWindow.addWindow(this.scrollTopPortalId);
        this.portalTargetElement.style.zIndex = String(this.$mWindow.windowZIndex);

        if (!this.$mWindow.hasBackdrop) {
            this.$mWindow.createBackdrop(this.bodyElement);
        }

        this.bodyElement.appendChild(this.portalTargetElement);
        this.visible = true;
    }

    private removeScrollTopToBody(): void {
        let portalTargetElement: HTMLElement = this.bodyElement.querySelector('#' + this.scrollTopPortalId) as HTMLElement;
        if (portalTargetElement) {
            this.bodyElement.removeChild(portalTargetElement);
            this.$mWindow.deleteWindow(this.scrollTopPortalId);
        }
    }

    private getScrollTopId(): string {
        return this.position == MScrollTopPosition.RELATIVE ? this.scrollTopPortalId : this.scrollTopId;
    }

}

const ScrollTopPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(SCROLL_TOP_NAME, MScrollTop);
    }
};

export default ScrollTopPlugin;
