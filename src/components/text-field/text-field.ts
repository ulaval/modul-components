import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './text-field.html?style=./text-field.scss';
import { TEXT_FIELD_NAME } from '../component-names';
import { InputState, InputStateMixin } from '../../mixins/input-state/input-state';

const TYPE_TEXT = 'text';
const TYPE_PASSWORD = 'password';
const TYPE_EMAIL = 'email';
const TYPE_URL = 'url';
const TYPE_TEL = 'tel';

const STATE_DEFAULT = 'default';
const STATE_DISABLED = 'disabled';
const STATE_ERROR = 'error';
const STATE_VALID = 'valid';

const ICON_NAME_PASSWORD_VISIBLE = 'default';
const ICON_NAME_PASSWORD_HIDDEN = 'default';

@WithRender
@Component({
    mixins: [
        InputState
    ]
})
export class MTexteField extends ModulVue implements InputStateMixin {

    @Prop({ default: TYPE_TEXT })
    public type: string;
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
    public error: string;
    @Prop()
    public placeholder: string;

    public componentName: string = TEXT_FIELD_NAME;

    public isDisabled: boolean;
    public hasError: boolean;
    public isValid: boolean;

    private propValue: string = '';
    private propDefaultText: string;
    private propErrorMessage: string = this.error;
    private propIconName: string = this.error;
    private propIconDescription: string = '';
    private typeIsPassword: boolean = false;
    private isEmptyValue: boolean = false;
    private isDefaultTextEmpty: boolean = false;
    private isFocusActive: boolean = false;
    private isUpdating: number;

    private iconDescriptionPasswordShow: string = this.$i18n.translate('m-text-field:password-show');
    private iconDescriptionPasswordHide: string = this.$i18n.translate('m-text-field:password-hide');

    protected beforeMount(): void {
        this.propValue = this.value;
        this.propDefaultText = this.defaultText;
        this.checkHasValue();
        this.checkHasDefaultText();
    }

    @Watch('value')
    private valueChanged(value: string): void {
        this.propValue = this.value;
        this.checkHasValue();
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
        this.isFocusActive = this.isDisabled ? false : true;
        if (!this.isDisabled && !this.forceFocus) {
            this.$refs.input['focus']();
            this.checkHasValue();
            this.checkHasDefaultText();
            this.$emit('focus', event, this.propValue);
        }
    }

    private onBlur(event): void {
        this.isFocusActive = this.isDisabled ? true : false;
        if (!this.isDisabled && !this.forceFocus) {
            this.checkHasValue();
            this.checkHasDefaultText();
            this.$emit('blur', event, this.propValue);
        }
    }

    private onKeyup(event): void {
        if (!this.isDisabled) {
            this.checkHasValue();
            this.checkHasDefaultText();
            this.$emit('keyup', event, this.propValue);
        }
    }

    private onClick(event): void {
        if (!this.isDisabled) {
            this.$emit('click', event, this.propValue);
        }
    }

    private onClickIcon(event): void {
        this.isFocusActive = this.isDisabled ? false : true;
        if (this.editable) {
            this.$refs.input['focus']();
        }
        if (this.propType == TYPE_PASSWORD) {
            if (this.typeIsPassword) {
                this.setType(TYPE_TEXT);
                this.typeIsPassword = false;
                this.propIconDescription = this.iconDescriptionPasswordHide;
                this.propIconName = ICON_NAME_PASSWORD_HIDDEN;
            } else {
                this.setType(TYPE_PASSWORD);
                this.typeIsPassword = true;
                this.propIconDescription = this.iconDescriptionPasswordShow;
                this.propIconName = ICON_NAME_PASSWORD_VISIBLE;
            }
        }
    }

    private onChange(event) {
        this.$emit('change', event, this.propValue);
    }

    private checkHasValue(): void {
        this.isEmptyValue = String(this.propValue).length == 0 ? true : false;
    }

    private checkHasDefaultText() {
        if (this.propDefaultText == '' || this.propDefaultText == undefined) {
            this.isDefaultTextEmpty = true;
        } else if (this.isEmptyValue && this.isFocusActive) {
            this.isDefaultTextEmpty = false;
        } else {
            this.isDefaultTextEmpty = true;
        }
    }

    private setType(type: string): void {
        if (this.editable) {
            // Set attribute type on input refs
            ModulVue.nextTick(() => {
                this.$refs.input['type'] = type;
            });
        }
    }

    private get propType(): string {
        let type: string = this.type == TYPE_PASSWORD || this.type == TYPE_EMAIL || this.type == TYPE_URL || this.type == TYPE_TEL ? this.type : TYPE_TEXT;
        if (type == TYPE_PASSWORD) {
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
        this.propIconName = this.propType == TYPE_PASSWORD ? ICON_NAME_PASSWORD_VISIBLE : this.iconName;
        return this.propIconName != '';
    }
}

const TextFieldPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(TEXT_FIELD_NAME, MTexteField);
    }
};

export default TextFieldPlugin;
