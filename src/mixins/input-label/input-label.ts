import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { InputStateMixin } from '../../mixins/input-state/input-state';
import { ModulVue } from '../../utils/vue/vue';

@Component
export class InputLabel extends ModulVue {
    @Prop()
    public label: string;
    @Prop()
    public iconName: string;
    @Prop()
    public requiredMarker: boolean;

    private get hasLabel(): boolean {
        return !!this.label;
    }

    private get hasIcon(): boolean {
        return !!this.iconName && !this.as<InputStateMixin>().isDisabled && !this.as<InputStateMixin>().isWaiting;
    }
}
