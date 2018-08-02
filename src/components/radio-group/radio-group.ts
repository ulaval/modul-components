import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Model, Prop, Watch } from 'vue-property-decorator';

import { InputState } from '../../mixins/input-state/input-state';
import uuid from '../../utils/uuid/uuid';
import { RADIO_GROUP_NAME } from '../component-names';
import RadioPlugin, { BaseRadioGroup, MRadioPosition, MRadioVerticalAlignement, RadioGroup } from '../radio/radio';
import ValidationMessagePlugin from '../validation-message/validation-message';
import WithRender from './radio-group.html?style=./radio-group.scss';

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
            value === MRadioPosition.Left ||
            value === MRadioPosition.Right
    })
    public radioPosition: MRadioPosition;
    @Prop()
    public inline: boolean;
    @Prop()
    public label: string;
    @Prop({
        default: MRadioVerticalAlignement.Top,
        validator: value =>
            value === MRadioVerticalAlignement.Top ||
            value === MRadioVerticalAlignement.Center
    })
    public radioVerticalAlign: MRadioVerticalAlignement;
    @Prop()
    public radioMarginTop: string;

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

    protected created(): void {
        this.internalValue = undefined;
    }

    @Watch('value')
    private onValueChange(value: any): void {
        this.internalValue = value;
    }

    private get model(): any {
        return this.value === undefined ? this.internalValue : this.value;
    }

    private get hasLabel(): boolean {
        return !!this.label;
    }

    private set model(value: any) {
        this.internalValue = value;
        this.$emit('change', value);
    }
}

const RadioGroupPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(RADIO_GROUP_NAME, 'plugin.install');
        v.use(RadioPlugin);
        v.use(ValidationMessagePlugin);
        v.component(RADIO_GROUP_NAME, MRadioGroup);
    }
};

export default RadioGroupPlugin;
