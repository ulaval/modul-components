import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Model, Watch } from 'vue-property-decorator';
import WithRender from './radio-group.html?style=./radio-group.scss';
import { RADIO_GROUP_NAME } from '../component-names';
import RadioPlugin, { MRadioPosition, BaseRadioGroup, RadioGroup } from '../radio/radio';
import uuid from '../../utils/uuid/uuid';
import { InputState, InputStateMixin } from '../../mixins/input-state/input-state';
import ValidationMessagePlugin from '../validation-message/validation-message';

@WithRender
@Component({
    mixins: [InputState]
})
export class MRadioGroup extends BaseRadioGroup implements RadioGroup {

    @Model('change')
    @Prop()
    public value: any;
    @Prop({
        default: MRadioPosition.Left,
        validator: value =>
            value == MRadioPosition.Left ||
            value == MRadioPosition.Right
    })
    public position: MRadioPosition;
    @Prop()
    public inline: boolean;

    public name: string = uuid.generate();
    private internalValue: any | undefined = '';

    public get stateIsDisabled(): boolean {
        return this.as<InputState>().isDisabled;
    }

    public get stateIsError(): boolean {
        return this.as<InputState>().hasError;
    }

    public get stateIsValid(): boolean {
        return this.as<InputState>().isValid;
    }

    public getValue(): any {
        return this.model;
    }

    public updateValue(value: any): void {
        this.model = value;
    }

    protected created() {
        this.internalValue = undefined;
    }

    @Watch('value')
    private onValueChange(value: any) {
        this.internalValue = value;
    }

    private get model(): any {
        return this.value == undefined ? this.internalValue : this.value;
    }

    private set model(value: any) {
        this.internalValue = value;
        this.$emit('change', value);
    }
}

const RadioGroupPlugin: PluginObject<any> = {
    install(v, options) {
        console.debug(RADIO_GROUP_NAME, 'plugin.install');
        v.use(RadioPlugin);
        v.use(ValidationMessagePlugin);
        v.component(RADIO_GROUP_NAME, MRadioGroup);
    }
};

export default RadioGroupPlugin;
