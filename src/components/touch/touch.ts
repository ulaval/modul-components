import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import ZingTouch from 'zingtouch';

import { TOUCH_NAME } from '../component-names';
import WithRender from './touch.html';

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

    private zingRegion: any = undefined;

    private get internalSwipeOptions(): MTouchSwipeOptions {
        return Object.assign({
            direction: MTouchSwipeDirection[this.swipeOptions!.direction || MTouchSwipeDirection.both] as any as MTouchSwipeOptions,
            angleThreshold: this.swipeOptions!.angleThreshold || 20,
            velocity: this.swipeOptions!.velocity || 1
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

        this.zingRegion = new ZingTouch.Region(this.$refs.swipeContainer, false, false);
        (this.$refs.swipeContainer as HTMLElement).style.touchAction = '';

        this.configureZingSwipe();
        this.configureZingTap();
    }

    private configureZingSwipe(): void {
        this.zingRegion.bind(this.$slots.default[0].elm, 'swipe', (event: CustomEvent) => {
            const swipeOptions: MTouchSwipeOptions = this.internalSwipeOptions;

            if (event.detail.data[0].velocity < swipeOptions.velocity) {
                return;
            }

            switch (swipeOptions.direction) {
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

        if ((angle >= 360 - swipeOptions.angleThreshold && angle <= 360) || (angle <= swipeOptions.angleThreshold && angle >= 0)) {
            event.detail.events.forEach(event => event.originalEvent.preventDefault());
            this.$emit('swiperight', event);
        } else if (angle >= 180 - swipeOptions.angleThreshold && angle <= 180 + swipeOptions.angleThreshold) {
            event.detail.events.forEach(event => event.originalEvent.preventDefault());
            this.$emit('swipeleft', event);
        }
    }

    private configureZingTap(): void {
        this.zingRegion.bind(this.$slots.default[0].elm, new ZingTouch.Tap({
            numInputs: 1,
            maxDelay: 300
        }), (event: Event) => {
            this.$emit('tap', event);
        });
    }

    private destroyZingTouch(): void {
        if (this.zingRegion) { this.zingRegion.unbind(this.$slots.default[0].elm); }
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
