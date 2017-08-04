import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './radio-buttons.html?style=./radio-buttons.scss';
import { RADIO_BUTTONS_NAME } from '../component-names';

const POSITION_LEFT: string = 'left';

export interface MRadioListData {
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
                    'label': 'Radio 1',
                    'checked': true
                },
                {
                    'value': 'radio-2',
                    'label': 'Radio 2'
                },
                {
                    'value': 'radio-3',
                    'label': 'Radio 3'
                },
                {
                    'value': 'radio-4',
                    'label': 'Radio 4'
                }
            ];
        }
    })
    public listData: MRadioListData[];
    @Prop({ default: 'radio' })
    public name: string;
    @Prop({ default: true })
    public label: boolean;
    @Prop({ default: POSITION_LEFT })
    public position: string;

    public componentName: string = RADIO_BUTTONS_NAME;
    private propsLabel: boolean = true;
    private propsPosition: string = POSITION_LEFT;
    private isFocus: boolean = false;
    private checkedValue: string = '';
    private defaultCheckedValue: string = this.findChecked();

    protected mounted(): void {
        this.propsLabel = this.label;
        this.propsPosition = this.position;
        if (this.defaultCheckedValue != '') {
            this.checkedValue = this.defaultCheckedValue;
        }
    }

    private findChecked(): any {
        for (let i = 0; i < this.listData.length; i++) {
            if (this.listData[i].checked == true) {
                return this.listData[i].value;
            }
        }
    }

    private onClick(event): void {
        this.$emit('click', this.checkedValue);
    }
}

const RadioButtonsPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(RADIO_BUTTONS_NAME, MRadioButtons);
    }
};

export default RadioButtonsPlugin;
