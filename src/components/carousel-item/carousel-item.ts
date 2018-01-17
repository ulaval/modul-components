import Vue, { PluginObject, VNode } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './carousel-item.html?style=./carousel-item.scss';
import { CAROUSEL_ITEM_NAME } from '../component-names';
import uuid from '../../utils/uuid/uuid';

export abstract class BaseCarousel extends Vue {
    abstract rightToLeft: boolean;
    abstract activeId: string;
    abstract addItem(id): void;
    abstract removeItem(id): void;
}

@WithRender
@Component
export class MCarouselItem extends Vue {
    @Prop()
    public id: number;

    private uuid: string = uuid.generate();

    protected mounted() {
        if (this.$parent.$parent instanceof BaseCarousel) {
            this.$parent.$parent.addItem(this.uuid);
        }
    }

    protected beforeDestroy() {
        if (this.$parent.$parent instanceof BaseCarousel) {
            this.$parent.$parent.removeItem(this.uuid);
        }
    }

    private get isVisible(): boolean {
        if (this.$parent.$parent instanceof BaseCarousel) {
            return this.$parent.$parent.activeId == this.uuid;
        }
        return false;
    }

    private get transitionName(): string {
        if (this.$parent.$parent instanceof BaseCarousel) {
            return this.$parent.$parent.rightToLeft ? 'right-to-left' : 'left-to-right';
        }
        return '';
    }
}

const CarouselItemPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(CAROUSEL_ITEM_NAME, MCarouselItem);
    }
};

export default CarouselItemPlugin;
