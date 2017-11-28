import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
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

    public setLineWidth(): void {
        let defaultLineEL: HTMLElement = this.$refs.defaultLine as HTMLElement;
        let selectedLineEL: HTMLElement = this.$refs.selectedLine as HTMLElement;
        let leftSpacing: number;
        let rightSpacing: number;
        this.$children.forEach((child, index, arr) => {
            if (index == 0 && arr.length >= 1) {
                leftSpacing = child.$el.clientWidth / 2;
            }
            if (arr.length - 1 === index && arr.length > 1) {
                rightSpacing = child.$el.clientWidth / 2;
            }
            if (child.$props.state == MSteppersItemState.InProgress) {
                let parentWidth = this.$el.clientWidth;
                let childWidth = child.$el.clientWidth;
                let childOffset = child.$el.offsetLeft;
                let lineWidth = ((childOffset - leftSpacing + (childWidth / 2)) / parentWidth) * 100;
                selectedLineEL.style.width = lineWidth + '%';
                selectedLineEL.style.left = leftSpacing + 'px';
            }
            defaultLineEL.style.left = leftSpacing + 'px';
            defaultLineEL.style.right = rightSpacing + 'px';
        });
    }

    protected mounted() {
        this.setLineWidth();
        this.as<ElementQueries>().$on('resizeDone', this.setLineWidth);
    }
}

const SteppersPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(STEPPERS_NAME, MSteppers);
    }
};

export default SteppersPlugin;
