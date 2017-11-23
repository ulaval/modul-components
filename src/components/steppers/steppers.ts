import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './steppers.html?style=./steppers.scss';
import { STEPPERS_NAME } from '../component-names';
import NavBarItemPlugin, { BaseSteppers, MSteppersItemState } from '../steppers-item/steppers-item';

@WithRender
@Component
export class MSteppers extends BaseSteppers {

    public setLineWidth(): void {
        let lineEL: HTMLElement = this.$refs.line as HTMLElement;
        this.$children.forEach((child) => {
            if (child.$props.state == MSteppersItemState.InProgress) {
                let parentWidth = this.$el.clientWidth;
                let childWidth = child.$el.offsetLeft;
                let width = (childWidth / parentWidth) * 100;
                lineEL.style.width = width + '%';
            }
        });
    }

    protected mounted() {
        this.setLineWidth();
        this.$modul.event.$on('resizeDone', this.setLineWidth);
    }
}

const SteppersPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(STEPPERS_NAME, MSteppers);
    }
};

export default SteppersPlugin;
