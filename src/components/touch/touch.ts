import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { TOUCH_NAME } from '../component-names';
import { MZingGestureDirections, MZingTapInteractions, MZingTouchGestures } from './enums';
import WithRender from './touch.html';
import ZingTouchUtil, { MZingRegion } from './zingtouch';


export enum MTouchSwipeDirection {
    horizontal = 'horizontal',
    vertical = 'vertical',
    both = 'both'
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

    private zingRegion: MZingRegion | undefined;

    private get internalSwipeOptions(): MTouchSwipeOptions {
        const swipeOptions: any = this.swipeOptions || {};
        return Object.assign({
            direction: swipeOptions.direction || MTouchSwipeDirection.both,
            angleThreshold: swipeOptions.angleThreshold || 20,
            velocity: swipeOptions.velocity || 0.3
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

        this.zingRegion = ZingTouchUtil.setupRegion(this.$el as HTMLElement, false, false);

        this.configureZingSwipe();
        this.configureZingTap();
    }

    private configureZingSwipe(): void {
        this.zingRegion!.bind(this.$el as HTMLElement,
            ZingTouchUtil.GestureFactory.getGesture(MZingTouchGestures.Swipe, this.internalSwipeOptions),
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
        const swipeOptions: MTouchSwipeOptions = this.internalSwipeOptions;

        switch (ZingTouchUtil.detectDirection(event, swipeOptions.angleThreshold)) {
            case MZingGestureDirections.Right:
                this.handleZingEvent(event);
                this.$emit('swiperight', event);
                break;
            case MZingGestureDirections.Left:
                this.handleZingEvent(event);
                this.$emit('swipeleft', event);
                break;
        }
    }

    private configureZingTap(): void {
        this.zingRegion!.bind(this.$el as HTMLElement, ZingTouchUtil.GestureFactory.getGesture(MZingTouchGestures.Tap), (event: CustomEvent) => {
            switch (ZingTouchUtil.detectTap(event)) {
                case MZingTapInteractions.Tap:
                    this.handleZingEvent(event);
                    this.$emit('tap', event);
                    break;
                case MZingTapInteractions.Click:
                    this.handleZingEvent(event);
                    this.$emit('click', event);
                    break;
            }
        });
    }

    private destroyZingTouch(): void {
        if (this.zingRegion) { this.zingRegion.unbind(this.$el as HTMLElement); }
        this.zingRegion = undefined;
    }

    private handleZingEvent(event: CustomEvent): void {
        // Since we reemit the event, we stop event propagation.  Event whould be handled twice from each listener otherwise.
        event.stopPropagation();
    }

}

const TouchPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(TOUCH_NAME, MTouch);
    }
};

export default TouchPlugin;
