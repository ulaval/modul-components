import Vue, { PluginObject, VNode } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './carousel.html?style=./carousel.scss';
import { CAROUSEL_NAME } from '../component-names';
import carouselItem, { MCarouselItem } from '../carousel-item/carousel-item';
import i18n from 'src/components/i18n/i18n';

@WithRender
@Component
export class MCarousel extends Vue {
    @Prop()
    public index: number;

    @Prop()
    public infinite: boolean;

    @Prop({ default: 0 })
    public interval: number;

    private items: MCarouselItem[] = [];

    private internalIndex: number = 0;
    private updateInterval: any;
    private moveForward: boolean = true;

    protected mounted() {
        this.buildItems();
        document.addEventListener('keyup', this.changeItem);
        if (this.interval) {
            this.updateInterval = setInterval(() => {
                this.propIndex++;
            }, this.interval);
        }
    }

    protected updated() {
        this.buildItems();
    }

    protected beforeDestroy() {
        document.removeEventListener('keyup', this.changeItem);
        clearInterval(this.updateInterval);
    }

    private async buildItems() {
        let newIndex = this.limitIndex(this.propIndex);
        this.moveForward = this.internalIndex < newIndex;
        this.internalIndex = newIndex;
        let items: MCarouselItem[] = [];
        await Vue.nextTick();
        if (this.$slots.default) {
            let index = 0;
            this.$slots.default.forEach((item) => {
                if (item.componentInstance instanceof MCarouselItem) {
                    item.componentInstance.transitionForward = this.moveForward;
                    item.componentInstance.isVisible = index === this.internalIndex;
                    item.componentInstance.$slots.default.forEach(content => {
                        let el = content.componentInstance && content.componentInstance.$el || content.elm;
                        if (el instanceof HTMLElement) {
                            el.style.maxHeight = this.$el.style.height || '100vh';
                            el.style.maxWidth = this.$el.clientWidth + 'px';
                            el.style.display = 'block';
                        }
                    });
                    items.push(item.componentInstance);
                    index++;
                }
            });
            this.items = items;
        }
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
        if (value != this.propIndex) {
            let newValue = this.limitIndex(value);
            this.items.forEach((item, index) => {
                item.transitionForward = this.moveForward;
                item.isVisible = index === newValue;
            });
            this.internalIndex = newValue;
            this.$emit('update:index', newValue);
        }
    }

    private limitIndex(value): number {
        if (this.infinite) {
            if (value > this.items.length - 1) {
                return 0;
            } else if (value < 0) {
                return this.items.length - 1;
            }
            return value;
        }
        return Math.max(Math.min(value, this.items.length - 1), 0);
    }

    private showPrevItem() {
        this.moveForward = false;
        this.propIndex--;
        this.resetInterval();
    }

    private showNextItem() {
        this.moveForward = true;
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
