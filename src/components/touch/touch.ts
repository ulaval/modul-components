import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { TOUCH_NAME } from '../component-names';
import WithRender from './touch.html';
import ZingTouchUtil, { ZingGestureDirections, ZingRegion, ZingTouchGestures } from './zingtouch.';

export enum MTouchSwipeDirection {
    horizontal,
    vertical,
    both
}

export interface MTouchSwipeOptions {
    direction: MTouchSwipeDirection;
    angleThreshold: number;
    velocity: number;
}

@WithRender
@Component
export class MTouch extends Vue {
    @Prop({ default: 'div' })
    public tag: string;

    @Prop()
    public swipeOptions: MTouchSwipeOptions | undefined;

    private zingRegion: ZingRegion | undefined;

    private get internalSwipeOptions(): MTouchSwipeOptions {
        return Object.assign({
            direction: MTouchSwipeDirection[this.swipeOptions!.direction || MTouchSwipeDirection.both] as any as MTouchSwipeOptions,
            angleThreshold: this.swipeOptions!.angleThreshold || 20,
            velocity: this.swipeOptions!.velocity || 0.3
        });
    }

    protected mounted(): void {
        this.initializeZingTouch();
    }

    protected beforeDestroy(): void {
        this.destroyZingTouch();
    }

    private initializeZingTouch(): void {
        this.destroyZingTouch();

        this.zingRegion = ZingTouchUtil.setupRegion(this.$el, false, false);
        (this.$el).style.touchAction = '';

        this.configureZingSwipe();
        this.configureZingTap();
    }

    private configureZingSwipe(): void {
        this.zingRegion!.bind(this.$el,
            ZingTouchUtil.GestureFactory.getGesture(ZingTouchGestures.Swipe, { velocity: this.internalSwipeOptions }),
            (event: CustomEvent) => {
                switch (this.internalSwipeOptions.direction) {
                    case MTouchSwipeDirection.both:
                    case MTouchSwipeDirection.horizontal:
                        this.handleHorizontalSwipe(event);
                        break;
                }
            });
    }

    private handleHorizontalSwipe(event: CustomEvent): void {
        const angle: number = event.detail.data[0].currentDirection;
        const swipeOptions: MTouchSwipeOptions = this.internalSwipeOptions;

        switch (ZingTouchUtil.detectDirection(angle, swipeOptions.angleThreshold)) {
            case ZingGestureDirections.Right:
                event.detail.events.forEach(event => event.originalEvent.preventDefault());
                this.$emit('swiperight', event);
                break;
            case ZingGestureDirections.Left:
                event.detail.events.forEach(event => event.originalEvent.preventDefault());
                this.$emit('swipeleft', event);
                break;
        }
    }

    private configureZingTap(): void {
        this.zingRegion!.bind(this.$el, ZingTouchUtil.GestureFactory.getGesture(ZingTouchGestures.Tap), (event: Event) => {
            this.$emit('tap', event);
        });
    }

    private destroyZingTouch(): void {
        if (this.zingRegion) { this.zingRegion.unbind(this.$el); }
        this.zingRegion = undefined;
    }
}

const TouchPlugin: PluginObject<any> = {
    install(v): void {
        v.prototype.$log.warn(TOUCH_NAME + ' is not ready for production');
        v.component(TOUCH_NAME, MTouch);
    }
};

export default TouchPlugin;
