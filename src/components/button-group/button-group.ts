import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './button-group.html?style=./button-group.scss';
import { BUTTON_GROUP_NAME, RADIO_NAME } from '../component-names';
import { MRadio } from '../radio/radio';
import uuid from '../../utils/uuid/uuid';

const ICON_POSITION_LEFT: string = 'left';

export interface MButtonGroupListData {
    value: string;
    label: string;
    active: boolean;
    iconName: string;
}

export enum MRadioGroupPosition {
    LEFT = 'left',
    RIGHT = 'right'
}

@WithRender
@Component
export class MButtonGroup extends Vue {

    @Prop()
    public value: string;
    @Prop({ default: MRadioGroupPosition.LEFT })
    public position: string;
    @Prop({ default: false })
    public disabled: boolean;
    @Prop({ default: false })
    public fullSize: boolean;
    @Prop({ default: false })
    public icon: boolean;
    @Prop({ default: MRadioGroupPosition.LEFT })
    public iconPosition: string;

    public componentName: string = BUTTON_GROUP_NAME;
    private nbRadio: number = 0;
    private radioName: string = uuid.generate();

    private hasError: boolean = false;
    private errorDefaultMesage: string = 'ERROR in <' + BUTTON_GROUP_NAME + '> : ';
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
                radio.propPosition = this.position;
                radio.fullSize = this.fullSize;
                radio.icon = this.icon;
                radio.iconPosition = this.iconPosition;
                if (this.disabled != false) {
                    radio.propDisabled = this.disabled;
                }
                if (i == 0) {
                    radio.firstChild = true;
                }
                if (i == this.$children.length - 1) {
                    radio.lastChild = true;
                }
                this.nbRadio++;
            }
        }
        if (this.nbRadio == 0) {
            this.hasError = true;
            this.errorMessage = this.errorDefaultMesage + 'No <' + RADIO_NAME + '> found in <' + BUTTON_GROUP_NAME + '>';
            console.error(this.errorMessage);
        }
    }

    private checkRadio(index: number): boolean {
        return (this.$children[index] as MRadio).componentName == RADIO_NAME ? true : false;
    }
}

const ButtonGroupPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(BUTTON_GROUP_NAME, MButtonGroup);
    }
};

export default ButtonGroupPlugin;
