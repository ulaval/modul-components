import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import * as TouchPlugin from 'vue-touch';

import { CAROUSEL_ITEM_NAME } from '../component-names';
import WithRender from './carousel-item.html?style=./carousel-item.scss';

@WithRender
@Component
export class MCarouselItem extends Vue {
    public isVisible: boolean = false;
    public transitionForward: boolean = true;
    private animActive: boolean = false;

    public beforeEnter(): void {
        this.$emit('animationStart');
    }

    public afterLeave(): void {
        this.$emit('animationDone');
    }

    private mounted(): void {
        setTimeout(() => {
            this.animActive = true;
        });
    }

    private get transitionName(): string {
        return this.transitionForward ? 'm--is-right-to-left' : 'm--is-left-to-right';
    }
}

const CarouselItemPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.warn(CAROUSEL_ITEM_NAME + ' is not ready for production');
        v.component(CAROUSEL_ITEM_NAME, MCarouselItem);
        Vue.use(TouchPlugin, { name: 'v-touch' });
    }
};

export default CarouselItemPlugin;
