import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './radio-group.html?style=./radio-group.scss';
import { RADIO_NAME, RADIO_GROUP_NAME } from '../component-names';
import { MRadio, MRadioPosition, BaseRadioGroup, RadioGroup } from '../radio/radio';
import uuid from '../../utils/uuid/uuid';

@WithRender
@Component
export class MRadioGroup extends BaseRadioGroup implements RadioGroup {

    @Prop()
    public value: string;
    @Prop({ default: MRadioPosition.Left })
    public position: MRadioPosition;
    @Prop({ default: false })
    public inline: boolean;
    @Prop({ default: true })
    public enabled: boolean;
    @Prop({ default: false})
    public demo: boolean;

    public name: string = uuid.generate();
    private internalValue: string = '';

    public getValue(): string {
        return this.model;
    }

    public updateValue(value: string): void {
        this.model = value;
    }

    private get model(): string {
        return this.value == undefined ? this.internalValue : this.value;
    }

    private set model(value: string) {
        this.internalValue = value;
        this.$emit('input', value);
        this.$emit('change', value);
    }
}

const RadioGroupPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(RADIO_GROUP_NAME, MRadioGroup);
    }
};

export default RadioGroupPlugin;
