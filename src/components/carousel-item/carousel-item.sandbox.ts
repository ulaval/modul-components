import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { CAROUSEL_ITEM_NAME } from '../component-names';
import WithRender from './carousel-item.sandbox.html';

@WithRender
@Component
export class MCarouselItemSandbox extends Vue {
}

const CarouselItemSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${CAROUSEL_ITEM_NAME}-sandbox`, MCarouselItemSandbox);
    }
};

export default CarouselItemSandboxPlugin;
