import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { CAROUSEL_NAME } from '../component-names';
import WithRender from './carousel.sandbox.html';

@WithRender
@Component
export class MCarouselSandbox extends Vue {
    private test: number = 0;

    private onClick(): void {
        this.test = 16;
    }
}

const CarouselSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${CAROUSEL_NAME}-sandbox`, MCarouselSandbox);
    }
};

export default CarouselSandboxPlugin;
