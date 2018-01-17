import Vue, { PluginObject, VNode } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './carousel.html?style=./carousel.scss';
import { CAROUSEL_NAME } from '../component-names';
import carouselItem, { MCarouselItem, BaseCarousel } from '../carousel-item/carousel-item';

@WithRender
@Component
export class MCarousel extends BaseCarousel {
    @Prop()
    public index: number;

    @Prop()
    public infinite: boolean;

    @Prop({ default: 0 })
    public interval: number;

    public rightToLeft: boolean = true;

    private internalIndex: number = 0;
    private updateInterval: any;
    private itemIds: string[] = [];

    public addItem(id) {
        this.itemIds.push(id);
    }

    public removeItem(id) {
        this.itemIds = this.itemIds.filter(item => {
            return item != id;
        });
    }

    public get activeId(): string {
        return this.itemIds[this.propIndex];
    }

    protected mounted() {
        document.addEventListener('keyup', this.changeItem);
        if (this.interval) {
            this.updateInterval = setInterval(() => {
                this.propIndex++;
            }, this.interval);
        }
    }

    protected beforeDestroy() {
        document.removeEventListener('keyup', this.changeItem);
        clearInterval(this.updateInterval);
    }

    private changeItem(e) {
        if (e.keyCode === 37) {
            this.showPrevItem();
        } else if (e.keyCode === 39) {
            this.showNextItem();
        }
    }

    private get propIndex(): number {
        if (this.index != undefined) {
            return this.index;
        }
        return this.internalIndex;
    }

    private set propIndex(value) {
        this.rightToLeft = value > this.propIndex;
        if (value > this.itemIds.length - 1) {
            value = this.infinite ? 0 : this.itemIds.length - 1;
        } else if (value < 0) {
            value = this.infinite ? this.itemIds.length - 1 : 0;
        }
        this.internalIndex = value;
        this.$emit('update:index', value);
    }

    private showPrevItem() {
        this.propIndex--;
        this.resetInterval();
    }

    private showNextItem() {
        this.propIndex++;
        this.resetInterval();
    }

    private resetInterval() {
        if (this.interval) {
            clearInterval(this.updateInterval);
            this.updateInterval = setInterval(() => {
                this.propIndex++;
            }, this.interval);
        }
    }
}

const CarouselPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(CAROUSEL_NAME, MCarousel);
    }
};

export default CarouselPlugin;
