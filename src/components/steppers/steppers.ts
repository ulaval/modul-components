import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { ElementQueries } from '../../mixins/element-queries/element-queries';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import { STEPPERS_ITEM_NAME, STEPPERS_NAME } from '../component-names';
import IconPlugin from '../icon/icon';
import { BaseSteppers, MSteppersItem, MSteppersItemState } from './steppers-item/steppers-item';
import WithRender from './steppers.html?style=./steppers.scss';


@WithRender
@Component({
    mixins: [ElementQueries]
})
export class MSteppers extends BaseSteppers {

    private isAnimActive: boolean = false;
    private overflowWrapperWidth: string;
    private lineWidth: number;

    public setLineWidth(): void {
        let defaultLineEL: HTMLElement = this.$refs.defaultLine as HTMLElement;
        let selectedLineEL: HTMLElement = this.$refs.selectedLine as HTMLElement;
        let wrapItem: HTMLElement = this.$refs.wrapItem as HTMLElement;
        let parentWidth: number = wrapItem.clientWidth;
        let leftSpacing: number = 0;
        let rightSpacing: number = 0;
        let hasFindFirst: Boolean = false;

        for (let i: number = 0; i <= this.$children.length - 1; i++) {
            if (i === 0 && this.$children.length >= 1) {
                leftSpacing = this.$children[i].$el.clientWidth / 2;
            }
            if (this.$children.length - 1 === i && this.$children.length > 1) {
                rightSpacing = this.$children[i].$el.clientWidth / 2;
            }
            if (this.$children[i].$props.state === MSteppersItemState.InProgress) {
                this.scrollElement(this.$children[i].$el);
            }
        }

        for (let i: number = this.$children.length - 1; i >= 0; i--) {
            if (hasFindFirst === false && this.$children[i].$props.state === MSteppersItemState.InProgress || hasFindFirst === false && this.$children[i].$props.state === MSteppersItemState.Visited) {
                let childWidth: number = (this.$children[i].$el as HTMLElement).clientWidth;
                let childOffset: number = (this.$children[i].$el as HTMLElement).offsetLeft;
                this.lineWidth = ((childOffset - leftSpacing + (childWidth / 2)) / parentWidth) * 100;
                hasFindFirst = true;
            }
        }

        defaultLineEL.style.left = leftSpacing + 'px';
        defaultLineEL.style.right = rightSpacing + 'px';
        selectedLineEL.style.width = this.lineWidth + '%';
        selectedLineEL.style.left = leftSpacing + 'px';
    }

    public setAnim(value): void {
        if (value === true) {
            this.isAnimActive = value;
        } else {
            setTimeout(() => {
                this.isAnimActive = value;
            }, 1000);
        }
    }

    protected mounted(): void {
        this.initWidthAndHeightOfSteppers();
    }

    private initWidthAndHeightOfSteppers(): void {
        this.setLineWidth();
        this.as<ElementQueries>().$on('resizeDone', this.setLineWidth);
        let overflowWrapperStyleHeight: any = (this.$refs.overflowWrapper as HTMLElement).style.height;
        let elStyleHeight: any = (this.$el as HTMLElement).style.height;
        let wrapItem: HTMLElement = this.$refs.wrapItem as HTMLElement;
        let initHeight: number = wrapItem.clientHeight;
        let scrollbarSpace: number = 40;

        if (document.readyState === 'complete' || initHeight > 0) {
            elStyleHeight = initHeight + 'px';
            overflowWrapperStyleHeight = initHeight + scrollbarSpace + 'px';
            this.setMinWidth();
        } else {
            let intervalForDomReady: any = setInterval(() => {
                // The document is ready when the clientHeight is larger than 0
                if (wrapItem.clientHeight > 0) {
                    initHeight = wrapItem.clientHeight;
                    elStyleHeight = initHeight + 'px';
                    overflowWrapperStyleHeight = initHeight + scrollbarSpace + 'px';
                    this.setMinWidth();
                    this.setLineWidth();
                    window.clearInterval(intervalForDomReady);
                }
            }, 100);
        }
    }

    private setMinWidth(): void {
        let wrapItem: HTMLElement = this.$refs.wrapItem as HTMLElement;
        wrapItem.style.opacity = '0';
        wrapItem.style.display = 'block';
        let childsWidth: number = 0;
        this.$children.forEach((child, index, arr) => {
            childsWidth += child.$el.clientWidth;
        });
        let minWidth: number;
        let numberOfChild: number = this.$children.length;
        minWidth = childsWidth + ((numberOfChild - 1) * 24);
        wrapItem.style.minWidth = minWidth + 'px';
        wrapItem.style.display = 'flex';
        wrapItem.style.opacity = '1';
    }

    private centeringElement(element): void {
        (this.$refs.overflowWrapper as HTMLElement).scrollLeft = element.offsetLeft - ((this.$el.clientWidth / 2) - (element.clientWidth / 2));
    }

    private scrollElement(element): void {
        (this.$refs.overflowWrapper as HTMLElement).scrollLeft = element.offsetLeft;
    }
}

const SteppersPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(MediaQueriesPlugin);
        v.use(IconPlugin);
        v.component(STEPPERS_ITEM_NAME, MSteppersItem);
        v.component(STEPPERS_NAME, MSteppers);
    }
};

export default SteppersPlugin;
