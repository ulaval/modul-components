import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './radio-group.html?style=./radio-group.scss';
import { RADIO_NAME, RADIO_GROUP_NAME } from '../component-names';
import { MRadio } from '../radio/radio';
import uuid from '../../utils/uuid/uuid';

export enum MRadioGroupPosition {
    LEFT = 'left',
    RIGHT = 'right'
}

@WithRender
@Component
export class MRadioGroup extends Vue {

    @Prop({ default: true })
    public label: boolean;
    @Prop({ default: MRadioGroupPosition.LEFT })
    public position: string;
    @Prop()
    public value: string;
    @Prop({ default: false })
    public disabled: boolean;

    public componentName: string = RADIO_GROUP_NAME;
    private nbRadio: number = 0;
    private radioName: string = uuid.generate();

    private hasError: boolean = false;
    private errorDefaultMesage: string = 'ERROR in <' + RADIO_GROUP_NAME + '> : ';
    private errorMessage: string = '';

    public updateValue(val): void {
        this.value = val;
        this.$emit('input', val);
    }

    protected mounted(): void {
        for (let i = 0; i < this.$children.length; i++) {
            if (this.checkRadio(i)) {
                let radio: MRadio = this.$children[i] as MRadio;
                radio.name = this.radioName;
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
