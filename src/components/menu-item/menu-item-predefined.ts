import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import WithRender from './menu-item-predefined.html';

@Component
@WithRender
export class MMenuItemPredefined extends ModulVue {
    @Prop()
    public disabled: boolean;

    protected get iconName(): string {
        throw new Error('not implemented');
    }

    protected get label(): string {
        throw new Error('not implemented');
    }

    private onClick(event: Event): void {
        this.$emit('click', event);
    }
}
