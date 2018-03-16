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
    private transitionForward: boolean = true;

    protected mounted(): void {
        document.addEventListener('keyup', this.changeItem);
        if (this.interval) {
            this.updateInterval = setInterval(() => {
                this.showNextItem();
            }, this.interval);
        }
    }

    protected updated(): void {
        if (this.isIndexValid(this.propIndex) || this.propIndex === 0 && this.items.length === 0) {
            this.transitionForward = this.internalIndex <= this.propIndex;
            this.internalIndex = this.propIndex;
            let items: MCarouselItem[] = [];
            if (this.$slots.default) {
                let index = 0;
                this.$slots.default.forEach(item => {
                    if (item.componentInstance instanceof MCarouselItem) {
                        item.componentInstance.transitionForward = this.transitionForward;
                        item.componentInstance.isVisible = index === this.internalIndex;
                        item.componentInstance.$slots.default.forEach(content => {
                            let el: HTMLElement = content.componentInstance && content.componentInstance.$el || content.elm as HTMLElement;
                            if (el instanceof HTMLElement && (el.tagName == 'IMG' || el.tagName == 'PICTURE')) {
                                el.style.maxWidth = '100%';
                                el.style.maxHeight = '100%';
                                el.style.position = 'absolute';
                                el.style.top = '50%';
                                el.style.left = '50%';
                                el.style.transform = 'translate(-50%, -50%)';
                            }
                        });
                        items.push(item.componentInstance);
                        index++;
                    }
                });
                this.items = items.length > 0 ? items : this.items;
            }
        }
    }

    protected beforeDestroy(): void {
        document.removeEventListener('keyup', this.changeItem);
        clearInterval(this.updateInterval);
    }

    private changeItem(e): void {
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
        if (value != this.propIndex && this.isIndexValid(value)) {
            this.items.forEach((item, index) => {
                item.transitionForward = this.transitionForward;
                item.isVisible = index === value;
            });
            this.internalIndex = value;
            this.$emit('update:index', value);
        }
    }

    private isIndexValid(value): boolean {
        return value >= 0 && value < this.items.length;
    }

    private showPrevItem(resetInterval: boolean = false): void {
        if (this.isIndexValid(this.propIndex - 1)) {
            this.showItem(this.propIndex - 1, false, resetInterval);
        } else if (this.infinite) {
            this.showItem(this.items.length - 1, false, resetInterval);
        }
    }

    private showNextItem(resetInterval: boolean = false): void {
        if (this.isIndexValid(this.propIndex + 1)) {
            this.showItem(this.propIndex + 1, true, resetInterval);
        } else if (this.infinite) {
            this.showItem(0, true, resetInterval);
        }
    }

    private showItem(index: number, transitionForward: boolean, resetInterval: boolean): void {
        this.transitionForward = transitionForward;
        this.propIndex = index;
        if (resetInterval) {
            this.resetInterval();
        }
    }

    private resetInterval(): void {
        if (this.interval) {
            clearInterval(this.updateInterval);
            this.updateInterval = setInterval(() => {
                this.showNextItem(true);
            }, this.interval);
        }
    }
}

const CarouselPlugin: PluginObject<any> = {
    install(v, options): void {
        console.warn(CAROUSEL_NAME + ' is not ready for production');
        v.component(CAROUSEL_NAME, MCarousel);
    }
};

export default CarouselPlugin;
