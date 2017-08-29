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
    Telephone = 'tel'
}

const ICON_NAME_PASSWORD_VISIBLE = 'default';
const ICON_NAME_PASSWORD_HIDDEN = 'default';

@WithRender
@Component({
    mixins: [
        InputState
    ]
})
export class MTextField extends ModulVue {

    @Prop({ default: MTextFieldType.Text })
    public type: MTextFieldType;
    @Prop({ default: '' })
    public value: string;
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

    private propValue: string = '';
    private propIconName: string;
    private propIconDescription: string = '';
    private typeIsPassword: boolean = false;
    private isDefaultTextEmpty: boolean = false;
    private focusActive: boolean = false;
    private isUpdating: number;

    private iconDescriptionPasswordShow: string = this.$i18n.translate('m-text-field:password-show');
    private iconDescriptionPasswordHide: string = this.$i18n.translate('m-text-field:password-hide');

    protected beforeMount(): void {
        this.propValue = this.value;
    }

    @Watch('value')
    private valueChanged(value: string): void {
        this.propValue = this.value;
    }

    @Watch('propValue')
    private propValueChanged(value: string): void {
        // Delayed $emit to limit event fired
        if (this.isUpdating) {
            clearTimeout(this.isUpdating);
        }

        this.isUpdating = window.setTimeout(
            () => this.$emit('valueChanged', this.propValue)
            , 300);
    }

    private onFocus(event): void {
        this.focusActive = !this.as<InputStateMixin>().isDisabled;
        if (!this.as<InputStateMixin>().isDisabled && !this.forceFocus) {
            (this.$refs.input as HTMLElement).focus();
            this.$emit('focus', event, this.propValue);
        }
    }

    private onBlur(event): void {
        this.focusActive = this.as<InputStateMixin>().isDisabled;
        if (!this.as<InputStateMixin>().isDisabled && !this.forceFocus) {
            this.$emit('blur', event, this.propValue);
        }
    }

    private onKeyup(event): void {
        if (!this.as<InputStateMixin>().isDisabled) {
            this.$emit('keyup', event, this.propValue);
        }
    }

    private onClick(event): void {
        if (!this.as<InputStateMixin>().isDisabled) {
            this.$emit('click', event, this.propValue);
        }
    }

    private onClickIcon(event): void {
        this.focusActive = !this.as<InputStateMixin>().isDisabled;
        if (this.editable) {
            (this.$refs.input as HTMLElement).focus();
        }
        if (this.propType == MTextFieldType.Password) {
            if (this.typeIsPassword) {
                this.setType(MTextFieldType.Text);
                this.typeIsPassword = false;
                this.propIconDescription = this.iconDescriptionPasswordHide;
                this.propIconName = ICON_NAME_PASSWORD_HIDDEN;
            } else {
                this.setType(MTextFieldType.Password);
                this.typeIsPassword = true;
                this.propIconDescription = this.iconDescriptionPasswordShow;
                this.propIconName = ICON_NAME_PASSWORD_VISIBLE;
            }
        }
    }

    private onChange(event) {
        this.$emit('change', event, this.propValue);
    }

    private get valueIsEmpty(): boolean {
        return String(this.propValue).length == 0;
    }

    private get hasDefaultText(): boolean {
        return this.defaultText == '' || this.defaultText == undefined || !this.valueIsEmpty ? false : true;
    }

    private get isDefaultTextVisible(): boolean {
        return this.isFocus;
    }

    private get isFocus(): boolean {
        let focus: boolean = this.forceFocus ? true : this.focusActive;
        if (focus) {
            this.$emit('focus');
        } else {
            this.$emit('blur');
        }
        return focus;
    }

    private setType(type: string): void {
        if (this.editable) {
            // Set attribute type on input ref
            this.$nextTick(() => {
                (this.$refs.input as HTMLElement).setAttribute('type', type);
            });
        }
    }

    private get propType(): MTextFieldType {
        let type: MTextFieldType = this.type == MTextFieldType.Password || this.type == MTextFieldType.EMail || this.type == MTextFieldType.Url ||
                this.type == MTextFieldType.Telephone ? this.type : MTextFieldType.Text;
        if (type == MTextFieldType.Password) {
            this.typeIsPassword = true;
            this.propIconDescription = this.iconDescriptionPasswordShow;
        }
        this.setType(type);
        return type;
    }

    private get hasLabel(): boolean {
        return this.label == '' || this.label == undefined ? false : true;
    }

    private get hasIcon(): boolean {
        this.propIconName = this.propType == MTextFieldType.Password ? ICON_NAME_PASSWORD_VISIBLE : this.iconName;
        return this.propIconName != '';
    }
}

const TextFieldPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(TEXT_FIELD_NAME, MTextField);
    }
};

export default TextFieldPlugin;
