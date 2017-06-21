import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './radio.html?style=./radio.scss';
import { RADIO_NAME } from '../component-names';

export interface MRadioData {
    value: string;
    label: string;
}

@WithRender
@Component
export class MRadio extends Vue {

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
    public radioValues: MRadioData[];
    @Prop({ default: 'radio' })
    public name: string;
    @Prop({ default: false })
    public isChecked: boolean;
    @Prop({ default: true })
    public hasLabel: boolean;

    private propsIsChecked = true;
    private propsHasLabel = true;
    private valueChecked: string = '';

    public mounted(): void {
        this.propsIsChecked = this.isChecked;
        this.propsHasLabel = this.hasLabel;
    }
}

const RadioPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(RADIO_NAME, MRadio);
    }
};

export default RadioPlugin;
