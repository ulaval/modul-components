import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Model } from 'vue-property-decorator';
import WithRender from './radio.html?style=./radio.scss';
import { RADIO_NAME, RADIO_GROUP_NAME, BUTTON_GROUP_NAME } from '../component-names';
import { MRadioGroup } from '../radio-group/radio-group';
import uuid from '../../utils/uuid/uuid';

export enum MRadioPosition {
    Left = 'left',
    Right = 'right'
}

@WithRender
@Component
export class MRadio extends ModulVue {

    @Prop()
    public value: string;
    @Prop({ default: MRadioPosition.Left })
    public position: string;
    @Prop({ default: false })
    public disabled: boolean;
    // ----- For Button Group -----
    @Prop({ default: MRadioPosition.Left })
    public iconPosition: string;
    @Prop()
    public iconName: string;
    // ---------------------------

    public componentName: string = RADIO_NAME;
    public radioID: string = uuid.generate();
    public name: string;
    public propPosition: string = MRadioPosition.Left;
    public propDisabled: boolean = false;
    // ----- For Button Group -----
    public propIconPosition: string = MRadioPosition.Left;
    public propIconName: string;
    public firstChild: boolean = false;
    public lastChild: boolean = false;
    public inline: boolean = false;
    public fullSize: boolean = false;
     // ---------------------------

    private isFocus: boolean = false;
    private radioGroup: any;
    private internalValue: string;

    protected mounted(): void {
        this.propPosition = this.position;
        this.propDisabled = this.disabled;

        // ----- For Button Group -----
        this.propIconPosition = this.iconPosition;
        this.propIconName = this.iconName;
        // ---------------------------
    }

    protected get model(): string {
        return this.isGroup() && this.radioGroup.$props.value != undefined ? this.radioGroup.$props.value : this.internalValue;
    }

    protected set model(value: string) {
        if (this.isGroup) {
            if (this.radioGroup) {
                this.radioGroup.updateValue(value);
            }
        } else {
            this.internalValue = value;
            this.$emit('input', value);
        }
    }

    private isGroup(): boolean {
        let parent = this.$parent;
        while (parent) {
            if (parent['componentName'] !== RADIO_GROUP_NAME && parent['componentName'] !== BUTTON_GROUP_NAME) {
                parent = parent.$parent;
            } else {
                this.radioGroup = parent;
                return true;
            }
        }
        return false;
    }

    private get isParentButtonGroup(): boolean {
        return this.$parent['componentName'] == BUTTON_GROUP_NAME;
    }

    private onClick(event): void {
        this.$emit('input', this.value);
    }

    private get hasIcon(): boolean {
        return this.iconName == undefined || this.iconName == '' ? false : true;
    }

    private get hasIconLeft(): boolean {
        return this.iconPosition == MRadioPosition.Left;
    }
}

const RadioPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(RADIO_NAME, MRadio);
    }
};

export default RadioPlugin;
