import Vue, { PluginObject, VNode } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './carousel-item.html?style=./carousel-item.scss';
import { CAROUSEL_ITEM_NAME } from '../component-names';
import * as TouchPlugin from 'vue-touch';

@WithRender
@Component
export class MCarouselItem extends Vue {
    public isVisible: boolean = false;
    public transitionForward: boolean = true;

    private get transitionName() {
        return this.transitionForward ? 'right-to-left' : 'left-to-right';
    }
}

const CarouselItemPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(CAROUSEL_ITEM_NAME, MCarouselItem);
        Vue.use(TouchPlugin, { name: 'v-touch' });
    }
};

export default CarouselItemPlugin;
