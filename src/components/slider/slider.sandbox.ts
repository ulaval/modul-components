import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import ZingTouch from 'zingtouch';
import ButtonPlugin from '../button/button';
import { SLIDER_NAME } from '../component-names';
import SliderPlugin from './slider';
import WithRender from './slider.sandbox.html?style=./slider.sandbox.scss';

@WithRender
@Component
export class MSliderSandbox extends Vue {
    // tslint:disable-next-line: no-null-keyword
    public slider: Element;
    public knob: Element;
    public bar: Element;
    public value: number = 0;
    // tslint:disable-next-line: no-null-keyword
    public currentEvent: any = null;
    public panValue: number = 0;

    protected mounted(): void {
        this.slider = this.$refs['slider'] as Element;
        this.bar = this.$refs['bar'] as Element;
        this.knob = this.$refs['knob'] as Element;

        const activeRegion: any = ZingTouch.Region(this.slider);
        let zingPan: any = new ZingTouch.Pan();

        zingPan.end = () => {
            this.value = this.value + this.panValue;
            this.panValue = 0;
        };

        activeRegion.bind(this.bar, zingPan, (event: any) => {
            // tslint:disable-next-line: no-console
            // if (!this.panStartOnKnob(event.detail.events[0].x)) {
            //     return;
            // }

            this.currentEvent = event;
            this.panValue = event.detail.data[0].distanceFromOrigin;
        });
    }

    public panStartOnKnob(x: number): boolean {
        return (
            x <= this.value + 17.5
            &&
            x >= this.value - 17.5
        );
    }

    public percentage(): number {
        if (!this.slider) {
            return 0;
        }

        return ((this.value + this.panValue) / this.slider.clientWidth) * 100;
    }

    public reset(): void {
        // tslint:disable-next-line: no-null-keyword
        this.currentEvent = null;
        this.value = 0;
        this.panValue = 0;
    }
}

const SliderSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(SliderPlugin);
        v.use(ButtonPlugin);
        v.component(`${SLIDER_NAME}-sandbox`, MSliderSandbox);
    }
};

export default SliderSandboxPlugin;
