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

    @Prop({ default: true })
    public infinite: boolean;

    @Prop({ default: 0 })
    public interval: number;

    private items: MCarouselItem[] = [];

    private internalIndex: number = 0;
    private updateInterval: any;

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
        console.log('updated');
    }

    protected beforeDestroy() {
        document.removeEventListener('keyup', this.changeItem);
        clearInterval(this.updateInterval);
    }

    private async buildItems() {
        let items: MCarouselItem[] = [];
        await Vue.nextTick();
        if (this.$slots.default) {
            let index = 0;
            this.$slots.default.forEach((item) => {
                if (item.componentInstance instanceof MCarouselItem) {
                    if (index === this.propIndex) item.componentInstance.isVisible = true;
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
        this.propIndex = Math.min(this.items.length - 1, this.propIndex);
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
            let transition = value > this.propIndex;
            if (value > this.items.length - 1) {
                if (this.infinite) {
                    value = 0;
                } else {
                    value = this.items.length - 1;
                }
            } else if (value < 0) {
                if (this.infinite) {
                    value = this.items.length - 1;
                } else {
                    value = 0;
                }
            }
            this.items.forEach((item, index) => {
                item.transitionForward = transition;
                item.isVisible = index === value;
            });
            this.internalIndex = value;
            this.$emit('update:index', value);
        }
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
