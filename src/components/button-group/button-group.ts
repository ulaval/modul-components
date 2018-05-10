import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Model } from 'vue-property-decorator';
import WithRender from './button-group.html?style=./button-group.scss';
import { BUTTON_GROUP_NAME } from '../component-names';
import RadioPlugin, { MRadioPosition, BaseButtonGroup, ButtonGroup } from '../radio/radio';
import uuid from '../../utils/uuid/uuid';

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
            value == MRadioPosition.Left ||
            value == MRadioPosition.Right
    })
    public position: MRadioPosition;

    public stateIsError: boolean = false;
    public stateIsValid: boolean = false;

    public name: string = uuid.generate();
    private internalValue: string = '';

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
        return this.value == undefined ? this.internalValue : this.value;
    }

    private set model(value: string) {
        this.internalValue = value;
        this.$emit('change', value);
    }
}

const ButtonGroupPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.warn(BUTTON_GROUP_NAME + ' is not ready for production');
        v.use(RadioPlugin);
        v.component(BUTTON_GROUP_NAME, MButtonGroup);
    }
};

export default ButtonGroupPlugin;
