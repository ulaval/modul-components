import { PluginObject } from 'vue';
import Component from 'vue-class-component';

import { Emit, Model, Prop } from 'vue-property-decorator';
import uuid from '../../utils/uuid/uuid';
import { BUTTON_GROUP_NAME } from '../component-names';
import RadioPlugin, { BaseButtonGroup, ButtonGroup, MRadioPosition, MRadioVerticalAlignement } from '../radio/radio';
import WithRender from './button-group.html?style=./button-group.scss';


@WithRender
@Component
export class MButtonGroup extends BaseButtonGroup implements ButtonGroup {

    @Model('change')
    @Prop()
    public value: string;
    @Prop()
    public disabled: boolean;
    @Prop()
    public fullSize: boolean;
    @Prop({ default: true })
    public inline: boolean;
    @Prop({
        default: MRadioPosition.Left,
        validator: value =>
            value === MRadioPosition.Left ||
            value === MRadioPosition.Right
    })
    public radiosPosition: MRadioPosition;
    @Prop({
        default: MRadioVerticalAlignement.Top,
        validator: value =>
            value === MRadioVerticalAlignement.Top ||
            value === MRadioVerticalAlignement.Center
    })
    public radiosVerticalAlign: MRadioVerticalAlignement;
    @Prop()
    public radiosMarginTop: string;
    @Prop({
        default: false
    })
    public readOnly: boolean;

    public stateIsError: boolean = false;
    public stateIsValid: boolean = false;

    public name: string = uuid.generate();
    private internalValue: string = '';

    @Emit('focus')
    onFocus(event: Event): void { }

    @Emit('blur')
    onBlur(event: Event): void { }

    public getValue(): string {
        return this.model;
    }

    public get stateIsDisabled(): boolean {
        return this.disabled;
    }

    public updateValue(value: string): void {
        this.model = value;
    }

    private get model(): string {
        return this.value === undefined ? this.internalValue : this.value;
    }

    private set model(value: string) {
        this.internalValue = value;
        this.$emit('change', value);
    }
}

const ButtonGroupPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.error('MButtonGroup will be deprecated in modul v.1.0');
        v.use(RadioPlugin);
        v.component(BUTTON_GROUP_NAME, MButtonGroup);
    }
};

export default ButtonGroupPlugin;
