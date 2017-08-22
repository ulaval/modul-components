import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './radio-group.html?style=./radio-group.scss';
import { RADIO_NAME, RADIO_GROUP_NAME } from '../component-names';
import { MRadio } from '../radio/radio';
import uuid from '../../utils/uuid/uuid';
import { MRadioPosition } from '../radio/radio';

@WithRender
@Component
export class MRadioGroup extends Vue {

    @Prop()
    public value: string;
    @Prop({ default: MRadioPosition.Left })
    public position: string;
    @Prop({ default: false })
    public inline: boolean;
    @Prop({ default: false })
    public disabled: boolean;

    public componentName: string = RADIO_GROUP_NAME;
    public internalPropValue: string;
    private nbRadio: number = 0;
    private radioName: string = uuid.generate();

    private hasError: boolean = false;
    private errorDefaultMesage: string = 'ERROR in <' + RADIO_GROUP_NAME + '> : ';
    private errorMessage: string = '';

    public updateValue(value: string): void {
        this.value = value;
        this.$emit('input', value);
    }

    private get propValue(): string {
        return this.value != undefined ? this.value : this.internalPropValue;
    }

    private set propValue(value: string) {
        this.$emit('input', value);
        this.internalPropValue = value;
    }

    protected mounted(): void {
        for (let i = 0; i < this.$children.length; i++) {
            if (this.checkRadio(i)) {
                let radio: MRadio = this.$children[i] as MRadio;
                radio.name = this.radioName;
                radio.propPosition = this.position == MRadioPosition.Left ? MRadioPosition.Left : MRadioPosition.Right;
                if (this.disabled != false) {
                    radio.propDisabled = this.disabled;
                }
                this.nbRadio++;
            }
        }
        if (this.nbRadio == 0) {
            this.hasError = true;
            this.errorMessage = this.errorDefaultMesage + 'No <' + RADIO_NAME + '> found in <' + RADIO_GROUP_NAME + '>';
            console.error(this.errorMessage);
        }
    }

    private checkRadio(index: number): boolean {
        return (this.$children[index] as MRadio).componentName == RADIO_NAME ? true : false;
    }
}

const RadioGroupPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(RADIO_GROUP_NAME, MRadioGroup);
    }
};

export default RadioGroupPlugin;
