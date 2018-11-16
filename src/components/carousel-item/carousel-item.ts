import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import * as TouchPlugin from 'vue-touch';

import { CAROUSEL_ITEM_NAME } from '../component-names';
import WithRender from './carousel-item.html?style=./carousel-item.scss';

@WithRender
@Component
export class MCarouselItem extends Vue {

    public isVisible: boolean = false;
    public position: number = 0;
    public margin: number = 0;

    private animNotReady = true;

    public beforeEnter(): void {
        this.$emit('animationStart');
    }

    public afterLeave(): void {
        this.$emit('animationDone');
    }

    public get translate(): string {
        if (this.position === 0) {
            return 'translate(0)';
        } else {
            return `translate(calc(${100 * this.position}% + ${(this.margin / 2) * this.position}px))`;
        }
    }

    protected mounted(): void {
        setTimeout(() => {
            this.animNotReady = false;
        });
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
