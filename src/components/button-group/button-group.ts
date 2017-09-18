import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './button-group.html?style=./button-group.scss';
import { BUTTON_GROUP_NAME, RADIO_NAME } from '../component-names';
import { MRadio, MRadioPosition, BaseButtonGroup, ButtonGroup } from '../radio/radio';
import uuid from '../../utils/uuid/uuid';

@WithRender
@Component
export class MButtonGroup extends BaseButtonGroup implements ButtonGroup {

    @Prop()
    public value: string;
    @Prop({ default: true })
    public enabled: boolean;
    @Prop({ default: false })
    public fullSize: boolean;
    @Prop({ default: true })
    public inline: boolean;
    @Prop({ default: MRadioPosition.Left })
    public position: MRadioPosition;

    public name: string = uuid.generate();
    private internalValue: string = '';
    private internalWidth: number = 0;

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

const ButtonGroupPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(BUTTON_GROUP_NAME, MButtonGroup);
    }
};

export default ButtonGroupPlugin;
