import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './text-field.html?style=./text-field.scss';
import { TEXT_FIELD_NAME } from '../component-names';
import { InputState, InputStateMixin } from '../../mixins/input-state/input-state';

export enum MTextFieldType {
    Text = 'text',
    Password = 'password',
    EMail = 'email',
    Url = 'url',
    Telephone = 'tel',
    Dropdown = 'dropdown'
}

export enum MTextFieldMode {
    Regular = 'text',
    Dropdown = 'dropdown'
}

const ICON_NAME_PASSWORD_VISIBLE: string = 'default';
const ICON_NAME_PASSWORD_HIDDEN: string = 'default';

@WithRender
@Component({
    mixins: [
        InputState
    ]
})
export class MTextField extends ModulVue {

    @Prop({ default: MTextFieldType.Text })
    public type: MTextFieldType;
    @Prop({ default: MTextFieldMode.Regular })
    public mode: MTextFieldMode;
    @Prop({ default: '' })
    public value: string;
    @Prop({ default: true })
    public iconPassword: boolean;
    @Prop()
    public label: string;
    @Prop({ default: '' })
    public defaultText: string;
    @Prop({ default: true })
    public editable: boolean;
    @Prop({ default: '' })
    public iconName: string;
    @Prop({ default: '' })
    public iconDescription: string;
    @Prop({ default: false })
    public forceFocus: boolean;
    @Prop()
    public placeholder: string;

    public componentName: string = TEXT_FIELD_NAME;

    private internalType: MTextFieldType;
    private internalValue: string = '';
    private iconNamePassword: string = '';
    private iconDescriptionPassword: string = '';
    private internalPasswordIsShow: boolean = false;
    private valueIsUpdating: number;
    private internalIsFocus: boolean = false;

    private iconDescriptionShowPassword: string = this.$i18n.translate('m-text-field:show-password');
    private iconDescriptionHidePassword: string = this.$i18n.translate('m-text-field:hide-password');

    protected beforeMount(): void {
        this.propType = this.type;
        this.propValue = this.value;
        this.passwordIsShow = this.internalPasswordIsShow;
    }

    @Watch('type')
    private typeChanged(type: MTextFieldType): void {
        this.propType = type;
    }

    @Watch('value')
    private valueChanged(value: string): void {
        this.propValue = this.value;
    }

    private onFocus(event): void {
        if (!this.isFocus) {
            this.isFocus = !this.isFocus;
        }
    }

    private onClick(event) {
        if (!this.isFocus) {
            this.isFocus = !this.isFocus;
        }
        if (this.isFocus) {
            (this.$refs.input as HTMLElement).focus();
        }
    }

    private onBlur(event): void {
        this.isFocus = false;
    }

    private onKeyup(event): void {
        if (!this.as<InputStateMixin>().isDisabled) {
            this.$emit('keyup', event, this.propValue);
        }
    }

    private togglePasswordVisibility(event): void {
        this.passwordIsShow = !this.passwordIsShow;
    }

    private set propType(type: MTextFieldType) {
        this.internalType = type == MTextFieldType.Password || type == MTextFieldType.EMail || type == MTextFieldType.Url ||
            type == MTextFieldType.Telephone ? type : MTextFieldType.Text;
        this.setType(this.internalType);
    }

    private get propType(): MTextFieldType {
        return this.internalType;
    }

    private setType(type: MTextFieldType): void {
        if (this.propEditable) {
            this.$nextTick(() => {
                (this.$refs.input as HTMLElement).setAttribute('type', type);
            });
        }
    }

    private set propValue(value: string) {
        this.internalValue = this.hasValueSlot && this.propType != MTextFieldType.Password ? 'hasValueSlot' : value;

        // Delayed $emit to limit event fired
        if (this.valueIsUpdating) {
            clearTimeout(this.valueIsUpdating);
        }

        this.valueIsUpdating = window.setTimeout(() => {
            this.$emit('valueChanged', this.internalValue);
        }, 300);
    }

    private get propValue(): string {
        return this.internalValue;
    }

    private get valueIsEmpty(): boolean {
        return String(this.propValue).length == 0;
    }

    private set isFocus(focus: boolean) {
        this.internalIsFocus = this.as<InputStateMixin>().isDisabled ? false : focus;
        if (this.internalIsFocus) {
            this.$emit('focus');
        } else {
            this.$emit('blur');
        }
    }

    private get isFocus(): boolean {
        return this.internalIsFocus;
    }

    private set passwordIsShow(show: boolean) {
        this.internalPasswordIsShow = show;
        if (this.type == MTextFieldType.Password) {
            if (this.internalPasswordIsShow) {
                this.iconDescriptionPassword = this.iconDescriptionHidePassword;
                this.iconNamePassword = ICON_NAME_PASSWORD_HIDDEN;
                this.setType(MTextFieldType.Text);
            } else {
                this.iconDescriptionPassword = this.iconDescriptionShowPassword;
                this.iconNamePassword = ICON_NAME_PASSWORD_VISIBLE;
                this.setType(MTextFieldType.Password);
            }
        }
    }

    private get passwordIsShow(): boolean {
        return this.internalPasswordIsShow;
    }

    private get hasDefaultText(): boolean {
        return this.defaultText == '' || this.defaultText == undefined || !this.valueIsEmpty ? false : true;
    }

    private get isDefaultTextVisible(): boolean {
        return this.isFocus;
    }

    private get modeIsDropdown(): boolean {
        if (this.mode == MTextFieldMode.Dropdown) {
            this.propType = MTextFieldType.Text;
            return true;
        }
        return false;
    }

    private get propIconPassword(): boolean {
        return this.propType == MTextFieldType.Password && !this.as<InputStateMixin>().isDisabled ? this.iconPassword : false;
    }

    private get propEditable(): boolean {
        return this.hasValueSlot && this.propType != MTextFieldType.Password ? false : this.editable;
    }

    private get hasValueSlot(): boolean {
        return !!this.$slots.value;
    }

    private get hasLabel(): boolean {
        return (this.label == '' || this.label == undefined ) && !this.as<InputStateMixin>().isDisabled ? false : true;
    }

    private get hasIcon(): boolean {
        return this.iconName != '' && !this.as<InputStateMixin>().isDisabled;
    }
}

const TextFieldPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(TEXT_FIELD_NAME, MTextField);
    }
};

export default TextFieldPlugin;
