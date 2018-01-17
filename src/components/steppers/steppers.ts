import { ModulVue } from '../../utils/vue/vue';
import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './steppers.html?style=./steppers.scss';
import { STEPPERS_NAME } from '../component-names';
import NavBarItemPlugin, { BaseSteppers, MSteppersItemState } from '../steppers-item/steppers-item';
import { ElementQueries } from '../../mixins/element-queries/element-queries';

@WithRender
@Component({
    mixins: [ElementQueries]
})
export class MSteppers extends BaseSteppers {

    private isAnimActive: boolean = false;
    private overflowWrapperWidth: string;

    public setLineWidth(): void {
        let defaultLineEL: HTMLElement = this.$refs.defaultLine as HTMLElement;
        let selectedLineEL: HTMLElement = this.$refs.selectedLine as HTMLElement;
        let wrapItem: HTMLElement = this.$refs.wrapItem as HTMLElement;
        let leftSpacing: number;
        let rightSpacing: number;
        this.$children.forEach((child, index, arr) => {
            if (index == 0 && arr.length >= 1) {
                leftSpacing = child.$el.clientWidth / 2;
            }
            if (arr.length - 1 === index && arr.length > 1) {
                rightSpacing = child.$el.clientWidth / 2;
            }
            if (child.$props.state == MSteppersItemState.InProgress || child.$props.state == MSteppersItemState.Completed) {
                let parentWidth = wrapItem.clientWidth;
                let childWidth = child.$el.clientWidth;
                let childOffset = child.$el.offsetLeft;
                let lineWidth = ((childOffset - leftSpacing + (childWidth / 2)) / parentWidth) * 100;
                selectedLineEL.style.width = lineWidth + '%';
                selectedLineEL.style.left = leftSpacing + 'px';
            }
            if (child.$props.state == MSteppersItemState.InProgress) {
                this.scrollElement(child.$el);
            }
            defaultLineEL.style.left = leftSpacing + 'px';
            defaultLineEL.style.right = rightSpacing + 'px';
        });
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

    protected mounted() {
        this.setMinWidth();
        this.setHiddenHeight();
        this.setLineWidth();
        // this.$children.forEach((child, index, arr) => {
        //     if (child.$props.state == MSteppersItemState.InProgress) {
        //         this.centeringElement(child.$el);
        //     }
        // });
        this.as<ElementQueries>().$on('resizeDone', this.setLineWidth);
    }

    private setMinWidth() {
        let wrapItem: HTMLElement = this.$refs.wrapItem as HTMLElement;
        wrapItem.style.opacity = '0';
        wrapItem.style.display = 'block';
        let childsWidth: number = 0;
        this.$children.forEach((child, index, arr) => {
            childsWidth += child.$el.clientWidth;
        });
        let minWidth: number;
        let numberOfChild = this.$children.length;
        minWidth = childsWidth + ((numberOfChild - 1) * 24);
        wrapItem.style.minWidth = minWidth + 'px';
        wrapItem.style.display = 'flex';
        wrapItem.style.opacity = '1';
    }

    private setHiddenHeight() {
        let overflowWrapper: HTMLElement = this.$refs.overflowWrapper as HTMLElement;
        let wrapItem: HTMLElement = this.$refs.wrapItem as HTMLElement;
        let initHeight = wrapItem.clientHeight;
        this.$el.style.height = initHeight + 'px';
        overflowWrapper.style.height = initHeight + 40 + 'px';
    }

    private centeringElement(element) {
        (this.$refs.overflowWrapper as HTMLElement).scrollLeft = element.offsetLeft - ((this.$el.clientWidth / 2) - (element.clientWidth / 2));
    }

    private scrollElement(element) {
        (this.$refs.overflowWrapper as HTMLElement).scrollLeft = element.offsetLeft;
    }
}

const SteppersPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(STEPPERS_NAME, MSteppers);
    }
};

export default SteppersPlugin;
