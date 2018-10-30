import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';

import { ElementQueries } from '../../mixins/element-queries/element-queries';
import { STEPPERS_NAME } from '../component-names';
import NavBarItemPlugin, { BaseSteppers, MSteppersItemState } from '../steppers-item/steppers-item';
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

        for (let i: number = 0 ; i <= this.$children.length - 1; i++) {
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
                let childWidth: number = this.$children[i].$el.clientWidth;
                let childOffset: number = this.$children[i].$el.offsetLeft;
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
        this.setMinWidth();
        this.setHiddenHeight();
        this.setLineWidth();
        this.as<ElementQueries>().$on('resizeDone', this.setLineWidth);
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

    private setHiddenHeight(): void {
        let overflowWrapper: HTMLElement = this.$refs.overflowWrapper as HTMLElement;
        let wrapItem: HTMLElement = this.$refs.wrapItem as HTMLElement;
        let initHeight: number = wrapItem.clientHeight;
        this.$el.style.height = initHeight + 'px';
        overflowWrapper.style.height = initHeight + 40 + 'px';
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
        v.component(STEPPERS_NAME, MSteppers);
    }
};

export default SteppersPlugin;
