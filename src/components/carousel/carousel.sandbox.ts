import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import ButtonPlugin from '../button/button';
import { CAROUSEL_NAME } from '../component-names';
import CarouselPlugin from './carousel';
import WithRender from './carousel.sandbox.html';


@WithRender
@Component
export class MCarouselSandbox extends Vue {
    protected tapCounter: number = 0;
    private test: number = 0;

    protected clearEventDetectionTest(): void {
        this.tapCounter = 0;
    }

    protected testTap(): void {
        this.tapCounter++;
    }

    private onClick(): void {
        if (this.test === 0) {
            this.test = 16;
        } else {
            this.test = 0;
        }
    }
}

const CarouselSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(ButtonPlugin);
        v.use(CarouselPlugin);
        v.component(`${CAROUSEL_NAME}-sandbox`, MCarouselSandbox);
    }
};

export default CarouselSandboxPlugin;
