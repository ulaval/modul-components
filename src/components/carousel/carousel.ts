import Vue, { PluginObject, VNode } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './carousel.html?style=./carousel.scss';
import { CAROUSEL_NAME } from '../component-names';

export interface CarouselItem {
    url: string;
    title: string;
    description: string;
    source: string;
}

@WithRender
@Component
export class MCarousel extends Vue {
    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop({
        default: () => [
            { url: 'https://www.w3schools.com/html/pulpitrock.jpg', title: 'Une roche', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum mollitia beatae iusto pariatur quidem distinctio corporis debitis quisquam enim autem veritatis labore nesciunt, minima officia officiis accusamus illo accusantium culpa. Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum mollitia beatae iusto pariatur quidem distinctio corporis debitis quisquam enim autem veritatis labore nesciunt, minima officia officiis accusamus illo accusantium culpa.', source: 'paysage.com' },
            { url: 'https://www.w3schools.com/html/img_girl.jpg', title: 'Une tuque', description: 'La tuque tendance...', source: 'mode.com' },
            { url: 'https://www.w3schools.com/html/mov_bbb.mp4', title: 'Une vidéo', description: 'wouhou!!', source: 'pixar.com' }
        ]
    })
    items: CarouselItem[];

    private activeItemIndex: number = 0;

    protected created() {
        document.addEventListener('keyup', this.changeItem);
    }

    protected beforeDestroy() {
        document.removeEventListener('keyup', this.changeItem);
    }

    // TODO: verify if url contains file extension
    private get medias(): any[] {
        let mediaArray: any[] = [];
        this.activeItemIndex = Math.min(this.activeItemIndex, this.items.length - 1);
        this.items.forEach(item => {
            let extension = item.url.match(/\.[^\.]*$/);
            if (extension) {
                switch (extension[0]) {
                    case '.jpg':
                    case '.jpeg':
                    case '.png':
                    case '.gif':
                        mediaArray.push({ template: `<img src="${item.url}" alt="${item.title.substr(0, 125)}">` });
                        break;
                    case '.mp4':
                        mediaArray.push({ template: `<video src="${item.url}" controls></video>` });
                        break;
                }
            }
        });
        return mediaArray;
    }

    private changeItem(e) {
        if (e.keyCode === 37 && !this.prevDisabled) {
            this.showPrevItem();
        } else if (e.keyCode === 39 && !this.nextDisabled) {
            this.showNextItem();
        }
    }

    private showPrevItem() {
        this.activeItemIndex = Math.max(0, this.activeItemIndex - 1);
    }

    private showNextItem() {
        this.activeItemIndex = Math.min(this.items.length - 1, this.activeItemIndex + 1);
    }

    private get prevDisabled() {
        return this.activeItemIndex === 0;
    }

    private get nextDisabled() {
        return this.items && this.activeItemIndex === this.items.length - 1;
    }

    private get activeItem(): CarouselItem {
        if (this.items && this.items.length > 0) {
            return this.items[this.activeItemIndex];
        } else {
            return {
                url: '',
                title: '',
                description: '',
                source: ''
            };
        }
    }
}

const CarouselPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(CAROUSEL_NAME, MCarousel);
    }
};

export default CarouselPlugin;
