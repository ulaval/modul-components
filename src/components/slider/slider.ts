import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './slider.html?style=./slider.scss';
import { SLIDER_NAME } from '../component-names';

@WithRender
@Component
export class MSlider extends ModulVue {

    @Prop({ default: 50 })
    public value: number;
    @Prop({ default: 0 })
    public min: number;
    @Prop({ default: 100 })
    public max: number;
    @Prop({ default: 1 })
    public step: number;

    private selectedValue: number = this.value;
    private range: number = this.max - this.min;
    private offsetLeft: number;
    private offsetRatio: number;

    private mounted(): void {
        this.offsetLeft = this.$refs['m-slider']['offsetLeft'];
        this.offsetRatio = this.range / this.$refs['m-slider']['clientWidth'];
    }

    private get percentage(): number {
        return ((this.selectedValue - this.min) / this.range) * 100;
    }

    private computeNearestStep(position: number): number {
        return Math.round(((position - this.offsetLeft) * this.offsetRatio + this.min) / this.step) * this.step;
    }

    private onClick(event: MouseEvent): void {
        this.selectedValue = Math.max(this.min, Math.min(this.max, this.computeNearestStep(event.clientX)));
        this.$emit('change', this.selectedValue);
    }

    private onPanmove(event): void {
        this.selectedValue = Math.max(this.min, Math.min(this.max, this.computeNearestStep(event.center.x)));
        this.$emit('slide', this.selectedValue);
    }

    private onPanend(): void {
        this.$emit('change', this.selectedValue);
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
        this.$emit('change', this.selectedValue);
    }

    private decrement(value: number): void {
        this.selectedValue = Math.max(this.min, this.selectedValue - value);
    }

    private increment(value: number): void {
        this.selectedValue = Math.min(this.max, this.selectedValue + value);
    }
}

const SliderPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(SLIDER_NAME, MSlider);
    }
};

export default SliderPlugin;
