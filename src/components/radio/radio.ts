import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Model } from 'vue-property-decorator';
import WithRender from './radio.html?style=./radio.scss';
import { RADIO_NAME } from '../component-names';
import IconPlugin from '../icon/icon';
import uuid from '../../utils/uuid/uuid';

export enum MRadioPosition {
    Left = 'left',
    Right = 'right'
}

export interface RadioGroup {
    name: string;
    position: MRadioPosition;
    enabled: boolean;
    inline: boolean;
    getValue(): string;
    updateValue(value: string): void;
}

export interface ButtonGroup extends RadioGroup {
    fullsize: boolean;
}

export abstract class BaseRadioGroup extends ModulVue {
}

export abstract class BaseButtonGroup extends BaseRadioGroup {
}

@WithRender
@Component
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
    @Prop({ default: true })
    public enabled: boolean;
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
    // ---------------------------
    public radioID: string = uuid.generate();

    private hasFocus: boolean = false;
    private hasParentGroup: boolean | undefined = undefined;
    private parentGroup: RadioGroup;

    public get propPosition(): MRadioPosition {
        return this.isGroup() ? this.parentGroup.position : this.position;
    }

    public get propEnabled(): boolean {
        let result: boolean = this.enabled;
        let groupEnabled: boolean = this.isGroup() ? this.parentGroup.enabled : true;

        return groupEnabled && result;
    }

    public get propName(): string {
        return this.isGroup() ? this.parentGroup.name : this.name;
    }

    public get propInline(): boolean {
        return this.isGroup() ? this.parentGroup.inline : false;
    }

    public get propFullsize(): boolean {
        return this.isGroup() ? (this.parentGroup as ButtonGroup).fullsize : false;
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
        v.use(IconPlugin);
        v.component(RADIO_NAME, MRadio);
    }
};

export default RadioPlugin;
