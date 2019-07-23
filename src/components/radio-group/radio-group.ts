import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Model, Prop, Watch } from 'vue-property-decorator';
import { InputState } from '../../mixins/input-state/input-state';
import uuid from '../../utils/uuid/uuid';
import { RADIO_GROUP_NAME } from '../component-names';
import InputGroupPlugin from '../input-group/input-group';
import RadioPlugin, { BaseRadioGroup, MRadioPosition, MRadioVerticalAlignement, RadioGroup } from '../radio/radio';
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
    public radiosPosition: MRadioPosition;
    @Prop()
    public inline: boolean;
    @Prop()
    public label: string;
    @Prop()
    public requiredMarker: boolean;
    @Prop({
        default: MRadioVerticalAlignement.Top,
        validator: value =>
            value === MRadioVerticalAlignement.Top ||
            value === MRadioVerticalAlignement.Center
    })
    public radiosVerticalAlign: MRadioVerticalAlignement;
    @Prop()
    public radiosMarginTop: string;

    public name: string = uuid.generate();
    private internalValue: any | undefined = '';

    @Emit('change')
    onChange(value: any): void { }

    @Emit('focus')
    onFocus(event: Event): void { }

    @Emit('blur')
    onBlur(event: Event): void { }

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

    public get idLabel(): string | undefined {
        return this.hasLabel ? uuid.generate() : undefined;
    }

    private get idValidationMessage(): string | undefined {
        return this.as<InputState>().errorMessage || this.as<InputState>().validMessage || this.as<InputState>().helperMessage ? uuid.generate() : undefined;
    }

    private set model(value: any) {
        this.internalValue = value;
        this.onChange(value);
    }
}

const RadioGroupPlugin: PluginObject<any> = {
    install(v, options): void {

        v.use(RadioPlugin);
        v.use(InputGroupPlugin);
        v.component(RADIO_GROUP_NAME, MRadioGroup);
    }
};

export default RadioGroupPlugin;
