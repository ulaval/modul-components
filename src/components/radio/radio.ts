import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Model } from 'vue-property-decorator';
import WithRender from './radio.html?style=./radio.scss';
import { RADIO_NAME, RADIO_GROUP_NAME } from '../component-names';
import { MRadioGroup } from '../radio-group/radio-group';
import uuid from '../../utils/uuid/uuid';

export enum MRadioPosition {
    LEFT = 'left',
    RIGHT = 'right'
}

@WithRender
@Component
export class MRadio extends ModulVue {

    @Prop({ default: true })
    public label: boolean;
    @Prop()
    public value: string;
    @Prop({ default: MRadioPosition.LEFT })
    public position: string;
    @Prop({ default: true })
    public hasLabel: boolean;

    public componentName: string = RADIO_NAME;
    public radioID: string = uuid.generate();
    public name: string;

    private propLabel: boolean = true;
    private propPosition: string = MRadioPosition.LEFT;
    private isFocus: boolean = false;
    private radioGroup: any = '';
    private radioGroupName: string = RADIO_GROUP_NAME;
    private internalValue: string;

    protected mounted(): void {
        this.propLabel = this.hasLabel;
        this.propPosition = this.position;
    }

    protected get model(): string {
        return this.isGroup() && this.radioGroup.$props.value != undefined ? this.radioGroup.$props.value : this.internalValue;
    }

    protected set model(val: string) {
        if (this.isGroup) {
            if (this.radioGroup) {
                this.radioGroup.updateValue(val);
            }
        } else {
            this.$emit('input', val);
        }
    }

    private isGroup(): boolean {
        let parent = this.$parent;
        while (parent) {
            if (parent.$options['_componentTag'] !== RADIO_GROUP_NAME) {
                parent = parent.$parent;
            } else {
                this.radioGroup = parent;
                return true;
            }
        }
        return false;
    }

    private onClick(event): void {
        this.$emit('input', this.value);
    }
}

const RadioPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(RADIO_NAME, MRadio);
    }
};

export default RadioPlugin;
