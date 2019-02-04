import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Model, Prop, Watch } from 'vue-property-decorator';
import * as TouchPlugin from 'vue-touch';
import { ModulVue } from '../../utils/vue/vue';
import { SLIDER_NAME } from '../component-names';
import WithRender from './slider.html?style=./slider.scss';
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
    private setElOffset: any;
    private offsetLeft: number;
    private offsetRatio: number;

    protected mounted(): void {
        this.model = this.value;
        this.setElOffset = window.setInterval(() => {
            this.offsetLeft = this.$el.getBoundingClientRect().left;
            this.offsetRatio = this.range / this.$el.clientWidth;
        }, 300);
    }

    protected beforeDestroy(): void {
        window.clearInterval(this.setElOffset);
    }

    @Watch('value')
    private onValueChange(value: any): void {
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
        // tslint:disable-next-line: deprecation
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
    install(v, options): void {
        v.prototype.$log.error('MSlider will be deprecated in modul v.1.0');

        v.use(TouchPlugin, { name: 'v-touch' }); // @todo really needed? should be loaded only by slider component.
        v.component(SLIDER_NAME, MSlider);
    }
};

export default SliderPlugin;
