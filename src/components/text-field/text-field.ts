import Vue from 'vue';
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

@WithRender
@Component({
    mixins: [
        InputState
    ]
})
export class MTexteField extends Vue implements InputStateMixin {

    @Prop({ default: TYPE_TEXT })
    public type: string;
    @Prop({ default: '' })
    public value: string;
    @Prop({ default: '' })
    public defaultText: string;
    @Prop({ default: true })
    public isEditable: boolean;
    @Prop({ default: '' })
    public iconName: string;
    @Prop({ default: false })
    public isForceFocus: boolean;

    public componentName: string = TEXT_FIELD_NAME;

    public isDisabled: boolean;
    public hasError: boolean;
    public isValid: boolean;

    private propsValue: string = '';
    private propsDefaultText: string;
    private hasIcon: boolean;
    private isEmptyValue: boolean = false;
    private isDefaultTextEmpty: boolean = false;
    private isFocusActive: boolean = false;
    private isUpdating: number;

    @Watch('value')
    private valueChanged(value: string): void {
        this.propsValue = this.value;
        this.checkHasValue();
    }

    @Watch('propsValue')
    private propsValueChanged(value: string): void {
        // Delayed $emit to limit event fired
        if (this.isUpdating) {
            clearTimeout(this.isUpdating);
        }

        this.isUpdating = window.setTimeout(
            () => this.$emit('valueChanged', this.propsValue)
        , 300);
    }

    private beforeMount(): void {
        this.propsValue = this.value;
        this.propsDefaultText = this.defaultText;
        this.hasIcon = this.iconName != '';
        this.checkHasValue();
        this.checkHasDefaultText();
    }

    private mounted() {
        if (this.propsIsEditable) {
            // Set attribute type on input refs
            this.$refs.input['type'] = this.propsType;
        }
    }

    private onFocus(event): void {
        this.isFocusActive = this.isDisabled ? false : true;
        if (!this.isDisabled && !this.isForceFocus) {
            this.$refs.input['focus']();
            this.checkHasValue();
            this.checkHasDefaultText();
            this.$emit('focus', event, this.propsValue);
        }
    }

    private onBlur(event): void {
        this.isFocusActive = this.isDisabled ? true : false;
        if (!this.isDisabled && !this.isForceFocus) {
            this.checkHasValue();
            this.checkHasDefaultText();
            this.$emit('blur', event, this.propsValue);
        }
    }

    private onKeyup(event): void {
        if (!this.isDisabled) {
            this.checkHasValue();
            this.checkHasDefaultText();
            this.$emit('keyup', event, this.propsValue);
        }
    }

    private onClick(event): void {
        if (!this.isDisabled) {
            this.$emit('click', event, this.propsValue);
        }
        event.preventDefault();
    }

    private checkHasValue(): void {
        this.isEmptyValue = String(this.propsValue).length == 0 ? true : false;
    }

    private checkHasDefaultText() {
        if (this.propsDefaultText == '' || this.propsDefaultText == undefined) {
            this.isDefaultTextEmpty = true;
        } else if (this.isEmptyValue && this.isFocusActive) {
            this.isDefaultTextEmpty = false;
        } else {
            this.isDefaultTextEmpty = true;
        }
    }

    private get propsType(): string {
        return this.type == TYPE_PASSWORD || this.type == TYPE_EMAIL || this.type == TYPE_URL || this.type == TYPE_TEL ? this.type : TYPE_TEL;
    }

    private get propsIsEditable(): boolean {
        return this.isEditable;
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }
}

const TextFieldPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(TEXT_FIELD_NAME, MTexteField);
    }
};

export default TextFieldPlugin;
