import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch, Model } from 'vue-property-decorator';
import WithRender from './slider.html?style=./slider.scss';
import { SLIDER_NAME } from '../component-names';

@WithRender
@Component
export class MSlider extends ModulVue {
    @Model('change')
    @Prop({ default: 50 })
    public value: number;
    @Prop({ default: 0 })
    public min: number;
    @Prop({ default: 100 })
    public max: number;
    @Prop({ default: 1 })
    public step: number;

    private internalValue: number = 50;
    private range: number = this.max - this.min;
    private offsetLeft: number;
    private offsetRatio: number;

    protected mounted(): void {
        this.offsetLeft = this.$el.offsetLeft;
        this.offsetRatio = this.range / this.$el.clientWidth;
        this.model = this.value;
    }

    @Watch('value')
    private onValueChange(value: any) {
        this.model = value;
    }

    private get model(): number {
        return this.internalValue;
    }

    private set model(value: number) {
        this.internalValue = value;
    }

    private get percentage(): number {
        return ((this.model - this.min) / this.range) * 100;
    }

    private computeNearestStep(position: number): number {
        return Math.round(((position - this.offsetLeft) * this.offsetRatio + this.min) / this.step) * this.step;
    }

    private onClick(event: MouseEvent): void {
        this.model = Math.max(this.min, Math.min(this.max, this.computeNearestStep(event.clientX)));
        this.$emit('change', this.model);
    }

    private onPanmove(event): void {
        this.model = Math.max(this.min, Math.min(this.max, this.computeNearestStep(event.center.x)));
        this.$emit('change', this.model);
    }

    private onPanend(): void {
        this.$emit('change', this.model);
    }

    private onKeydown(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case 37:
                this.decrement(this.step);
                break;
            case 39:
                this.increment(this.step);
                break;
        }
        this.$emit('change', this.model);
    }

    private decrement(value: number): void {
        this.model = Math.max(this.min, this.internalValue - value);
    }

    private increment(value: number): void {
        this.model = Math.min(this.max, this.internalValue + value);
    }
}

const SliderPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(SLIDER_NAME, MSlider);
    }
};

export default SliderPlugin;
