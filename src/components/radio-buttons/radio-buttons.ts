import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './radio-buttons.html?style=./radio-buttons.scss';
import { RADIO_BUTTONS_NAME } from '../component-names';

const POSITION_LEFT: string = 'left';

export interface MRadioData {
    value: string;
    label: string;
    checked: boolean;
}

@WithRender
@Component
export class MRadioButtons extends Vue {

    @Prop({
        default: () => {
            return [
                {
                    'value': 'radio-1',
                    'label': 'Radio 1'
                },
                {
                    'value': 'radio-2',
                    'label': 'Radio 2'
                },
                {
                    'value': 'radio-3',
                    'label': 'Radio 3',
                    'checked': true
                },
                {
                    'value': 'radio-4',
                    'label': 'Radio 4'
                }
            ];
        }
    })
    public radioValues: MRadioData[];
    @Prop({ default: 'radio' })
    public name: string;
    @Prop({ default: true })
    public hasLabel: boolean;
    @Prop({ default: POSITION_LEFT })
    public position: string;

    public componentName: string = RADIO_BUTTONS_NAME;
    private propsHasLabel = true;
    private propsPosition = POSITION_LEFT;
    private isFocus = false;
    private checkedValue: string = '';
    private defaultCheckedValue = this.findChecked();

    private mounted(): void {
        this.propsHasLabel = this.hasLabel;
        this.propsPosition = this.position;
        if (this.defaultCheckedValue != '') {
            this.checkedValue = this.defaultCheckedValue;
        }
    }

    private findChecked(): any {
        for (let i = 0; i < this.radioValues.length; i++) {
            if (this.radioValues[i].checked == true) {
                return this.radioValues[i].value;
            }
        }
    }

    private onClick(event): void {
        this.$emit('click');
        this.$refs['radio-button']['blur']();
    }
}

const RadioButtonsPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(RADIO_BUTTONS_NAME, MRadioButtons);
    }
};

export default RadioButtonsPlugin;
