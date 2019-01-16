import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Model, Prop, Watch } from 'vue-property-decorator';

import { InputState } from '../../mixins/input-state/input-state';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { SWITCH_NAME } from '../component-names';
import ValidationMessagePlugin from '../validation-message/validation-message';
import WithRender from './switch.html?style=./switch.scss';
import { ENGLISH, FRENCH, Messages } from '../../utils/i18n/i18n';

export enum MSwitchPosition {
    Left = 'left',
    Right = 'right'
}

@WithRender
@Component({
    mixins: [InputState]
})
export class MSwitch extends ModulVue {

    @Model('change')
    @Prop()
    public value: boolean;
    @Prop({
        default: MSwitchPosition.Left,
        validator: value =>
            value === MSwitchPosition.Left ||
            value === MSwitchPosition.Right
    })
    public position: string;
    @Prop({ default: true })
    public stateText: boolean;

    private internalValue: boolean = false;
    private isFocus = false;
    private id: string = `switch${uuid.generate()}`;

    @Watch('value')
    private onValueChange(value: boolean): void {
        this.internalValue = value;
    }

    private get propChecked(): boolean {
        return this.value !== undefined ? this.value : this.internalValue;
    }

    private set propChecked(value: boolean) {
        this.$emit('change', value);
        this.internalValue = value;
    }

    private onClick(event): void {
        this.$emit('click', event);
        this.$refs['switch']['blur']();
    }

    public get hasSwitchLeft(): boolean {
        return ((this.position === MSwitchPosition.Right) ? false : true);
    }

    public get label(): boolean {
        return !!this.$slots.default;
    }
}

const SwitchPlugin: PluginObject<any> = {
    install(v, options): void {
        const i18n: Messages = (v.prototype as any).$i18n;
        if (i18n) {
            i18n.addMessages(FRENCH, require('./switch.lang.fr.json'));
            i18n.addMessages(ENGLISH, require('./switch.lang.en.json'));
        }

        v.use(ValidationMessagePlugin);
        v.component(SWITCH_NAME, MSwitch);
    }
};

export default SwitchPlugin;
