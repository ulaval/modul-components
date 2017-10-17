import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Model } from 'vue-property-decorator';
import WithRender from './radio.html?style=./radio.scss';
import { RADIO_NAME } from '../component-names';
import IconPlugin from '../icon/icon';
import uuid from '../../utils/uuid/uuid';
import { InputState, InputStateMixin } from '../../mixins/input-state/input-state';
import ValidationMessagePlugin from '../validation-message/validation-message';
import RadioStylePlugin from '../radio-style/radio-style';

export enum MRadioPosition {
    Left = 'left',
    Right = 'right'
}

export interface RadioGroup {
    name: string;
    position: MRadioPosition;
    disabled: boolean;
    inline: boolean;
    fullWidth: boolean;
    getValue(): string;
    updateValue(value: string): void;
}

export interface ButtonGroup extends RadioGroup {
    fullWidth: boolean;
}

export abstract class BaseRadioGroup extends ModulVue {
}

export abstract class BaseButtonGroup extends BaseRadioGroup {
}

@WithRender
@Component({
    mixins: [InputState]
})
export class MRadio extends ModulVue {

    @Prop()
    @Model('change')
    public modelValue: string;
    @Prop()
    public value: string;
    @Prop()
    public name: string;
    @Prop({
        default: MRadioPosition.Left,
        validator: value => value == MRadioPosition.Left || value == MRadioPosition.Right
    })
    public position: MRadioPosition;
    @Prop({ default: false })
    public disabled: boolean;
    @Prop({ default: false })
    public demo: boolean;
    // ----- For Button Group -----
    @Prop()
    public iconName: string;
    @Prop({
        default: MRadioPosition.Left,
        validator: value => value == MRadioPosition.Left || value == MRadioPosition.Right
    })
    public iconPosition: MRadioPosition;
    @Prop({ default: false })
    public fullWidth: boolean;
    // ---------------------------
    public radioID: string = uuid.generate();

    private hasFocus: boolean = false;
    private hasParentGroup: boolean | undefined = undefined;
    private parentGroup: RadioGroup;

    public get propPosition(): MRadioPosition {
        return this.isGroup() ? this.parentGroup.position : this.position;
    }

    public get propDisabled(): boolean {
        let result: boolean = this.disabled;
        let groupDisabled: boolean = this.isGroup() ? this.parentGroup.disabled : true;

        return groupDisabled && result;
    }

    public get propName(): string {
        return this.isGroup() ? this.parentGroup.name : this.name;
    }

    public get propInline(): boolean {
        return this.isGroup() ? this.parentGroup.inline : false;
    }

    public get propFullWidth(): boolean {
        return this.isGroup() ? this.parentGroup.fullWidth : this.fullWidth;
    }

    protected get model(): string {
        return this.isGroup() ? this.parentGroup.getValue() : this.modelValue;
    }

    protected set model(value: string) {
        if (this.isGroup()) {
            this.parentGroup.updateValue(value);
        } else {
            this.$emit('change', value);
        }
    }

    private isGroup(): boolean {
        if (this.hasParentGroup === undefined) {
            let parentGroup: BaseRadioGroup | undefined = this.getParent<BaseRadioGroup>(p => p instanceof BaseRadioGroup);
            if (parentGroup) {
                this.parentGroup = (parentGroup as any) as RadioGroup;
                this.hasParentGroup = true;
            } else {
                this.hasParentGroup = false;
            }
        }
        return !!this.hasParentGroup;
    }

    private isButton(): boolean {
        return this.isGroup() && this.parentGroup instanceof BaseButtonGroup;
    }

    private onFocus(): void {
        this.hasFocus = true;
    }

    private onBlur(): void {
        this.hasFocus = false;
    }

    private hasIcon(): boolean {
        return !!this.iconName;
    }

    private hasIconLeft(): boolean {
        return this.iconPosition == MRadioPosition.Left;
    }
}

const RadioPlugin: PluginObject<any> = {
    install(v, options) {
        v.use(RadioStylePlugin);
        v.use(IconPlugin);
        v.use(ValidationMessagePlugin);
        v.component(RADIO_NAME, MRadio);
    }
};

export default RadioPlugin;
