import { Component, Emit, Prop } from 'vue-property-decorator';
import { ModulVue } from '../../../utils/vue/vue';
import WithRender from './calendar-button.html?style=./calendar-button.scss';


@WithRender
@Component
export class MCalendarButton extends ModulVue {

    @Prop()
    public disabled: boolean;

    @Prop()
    public today: boolean;

    @Prop()
    public selected: boolean;

    @Emit('click')
    public onClick(event: Event): void { }

    @Emit('keyup')
    public onKeyup(event: Event): void { }

    @Emit('mouseenter')
    public onMouseenter(event: Event): void { }

    @Emit('mouseleave')
    public onMouseleave(event: Event): void { }

}
