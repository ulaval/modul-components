import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Model, Watch } from 'vue-property-decorator';
import WithRender from './text-field.html?style=./text-field.scss';
import { TEXT_FIELD_NAME } from '../component-names';
import { InputState, InputStateMixin } from '../../mixins/input-state/input-state';

export enum MTextFieldType {
    Text = 'text',
    Password = 'password',
    EMail = 'email',
    Url = 'url',
    Telephone = 'tel'
}

const ICON_NAME_PASSWORD_VISIBLE: string = 'default';
const ICON_NAME_PASSWORD_HIDDEN: string = 'default';

@WithRender
@Component({
    mixins: [InputState]
})
export class MTextField extends ModulVue {

    @Prop({
        default: MTextFieldType.Text,
        validator: value => value == MTextFieldType.EMail || value == MTextFieldType.Password ||
            value == MTextFieldType.Telephone || value == MTextFieldType.Text || value == MTextFieldType.Url
    })
    public type: MTextFieldType;
    @Prop()
    @Model('change')
    public value: string;
    @Prop({ default: false })
    public forceFocus: boolean;
    @Prop({ default: true })
    public iconPassword: boolean;
    @Prop()
    public label: string;
    @Prop()
    public iconName: string;
    @Prop()
    public iconDescription: string;
    @Prop()
    public placeholder: string;
    @Prop({ default: false })
    public waiting: boolean;

    private internalValue: string = '';
    private passwordAsText: boolean = false;
    private internalIsFocus: boolean = false;

    private iconDescriptionShowPassword: string = this.$i18n.translate('m-text-field:show-password');
    private iconDescriptionHidePassword: string = this.$i18n.translate('m-text-field:hide-password');

    @Watch('type')
    private typeChanged(type: MTextFieldType): void {
        console.warn('MTextField - Change of property "type" is not supported');
    }

    private onClick(event: MouseEvent): void {
        this.internalIsFocus = !this.as<InputStateMixin>().isDisabled;
        if (this.internalIsFocus) {
            (this.$refs.input as HTMLElement).focus();
        }
        this.$emit('click');
    }

    private onFocus(event: FocusEvent): void {
        this.internalIsFocus = !this.as<InputStateMixin>().isDisabled;
        if (this.internalIsFocus) {
            this.$emit('focus');
        }
    }

    private onBlur(event): void {
        this.internalIsFocus = false;
        this.$emit('blur');
    }

    private onKeyup(event): void {
        if (!this.as<InputStateMixin>().isDisabled) {
            this.$emit('keyup', event, this.model);
        }
    }

    private togglePasswordVisibility(event): void {
        this.passwordAsText = !this.passwordAsText;
    }

    private get hasPlaceholder(): boolean {
        return !!this.placeholder || this.placeholder != '';
    }

    private get inputType(): MTextFieldType {
        let type: MTextFieldType = MTextFieldType.Text;
        if (this.type == MTextFieldType.Password && this.passwordAsText) {
            type = MTextFieldType.Text;
        } else if (this.type == MTextFieldType.Password || this.type == MTextFieldType.EMail || this.type == MTextFieldType.Url ||
            this.type == MTextFieldType.Telephone) {
            type = this.type;
        }
        this.$nextTick(() => {
            (this.$refs.input as HTMLElement).setAttribute('type', type);
        });
        return type;
    }

    private set model(value: string) {
        this.internalValue = value;
        this.$emit('change', value);
    }

    private get model(): string {
        return this.value == undefined ? this.internalValue : this.value;
    }

    private get hasValue(): boolean {
        return this.model != '';
    }

    private get isEmpty(): boolean {
        let empty: boolean = true;
        if (this.isFocus) {
            empty = false;
        } else if (this.hasValue || this.hasPlaceholder) {
            empty = false;
        }
        return empty;
    }

    private get isFocus(): boolean {
        return this.forceFocus ? true : this.internalIsFocus;
    }

    private get iconNamePassword() {
        return this.passwordAsText ? ICON_NAME_PASSWORD_HIDDEN : ICON_NAME_PASSWORD_VISIBLE;
    }

    private get iconDescriptionPassword() {
        return this.passwordAsText ? this.iconDescriptionHidePassword : this.iconDescriptionShowPassword;
    }

    private get propIconPassword(): boolean {
        return this.iconPassword && this.type == MTextFieldType.Password && !this.as<InputStateMixin>().isDisabled;
    }

    private get hasLabel(): boolean {
        return !!this.label;
    }

    private get hasIcon(): boolean {
        return !!this.iconName && !this.as<InputStateMixin>().isDisabled;
    }
}

const TextFieldPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(TEXT_FIELD_NAME, MTextField);
    }
};

export default TextFieldPlugin;
