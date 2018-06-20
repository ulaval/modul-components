import Component from 'vue-class-component';
import { Model, Prop, Watch } from 'vue-property-decorator';

import { InputStateMixin } from '../../mixins/input-state/input-state';
import { ModulVue } from '../../utils/vue/vue';

export interface InputManagementProps {
    value: string;
    placeholder: string;
    readonly: boolean;
    focus: boolean;
}

export interface InputManagementData {
    internalValue: string;
}

export enum InputManagementAutocomplete {
    Off = 'off',
    On = 'on'
}
@Component
export class InputManagement extends ModulVue
    implements InputManagementProps, InputManagementData {
    @Prop()
    @Model('input')
    public value: string;
    @Prop()
    public placeholder: string;
    @Prop()
    public readonly: boolean;
    @Prop({
        default: undefined,
        validator: value =>
        value === InputManagementAutocomplete.Off ||
        value === InputManagementAutocomplete.On ||
        value === undefined
    })
    public autocomplete: string;
    @Prop()
    public focus: boolean;

    public internalValue: string = '';
    public trimWordWrap: boolean = false;
    private internalIsFocus: boolean = false;

    private beforeMount(): void {
        this.model = this.value ? this.value : '';
    }

    private mounted(): void {
        if (this.focus) {
            this.focusChanged(this.focus);
        }
    }

    @Watch('focus')
    private focusChanged(focus: boolean): void {
        this.internalIsFocus = focus && !this.as<InputStateMixin>().isDisabled;
        let inputEl: HTMLElement = this.$refs.input as HTMLElement;
        if (inputEl) {
            if (this.internalIsFocus) {
                inputEl.focus();
            } else {
                inputEl.blur();
            }
        }
    }

    private onClick(event: MouseEvent): void {
        this.internalIsFocus = !this.as<InputStateMixin>().isDisabled;
        let inputEl: HTMLElement = this.$refs.input as HTMLElement;
        if (this.internalIsFocus && inputEl) {
            inputEl.focus();
        }
        this.$emit('click');
    }

    private onFocus(event: FocusEvent): void {
        this.internalIsFocus = !this.as<InputStateMixin>().isDisabled;
        if (this.internalIsFocus) {
            this.$emit('focus', event);
        }
    }

    private onBlur(event: Event): void {
        this.internalIsFocus = false;
        this.$emit('blur', event);
    }

    private onKeyup(event: Event): void {
        if (!this.as<InputStateMixin>().isDisabled) {
            this.$emit('keyup', event, this.model);
        }
    }

    private onKeydown(event: Event): void {
        if (!this.as<InputStateMixin>().isDisabled) {
            this.$emit('keydown', event);
        }
    }

    private onChange(event: Event): void {
        this.$emit('change', this.model);
    }

    private onPaste(event: Event): void {
        this.$emit('paste', event);
    }

    @Watch('value')
    private onValueChange(value: string): void {
        this.model = value;
    }

    private set model(value: string) {
        this.internalValue = value;
        this.$emit('input', value);
    }

    private get model(): string {
        if (this.trimWordWrap) {
            this.internalValue = this.internalValue.replace(/\n/g, '');
        }
        return this.internalValue;
    }

    private get hasValue(): boolean {
        return this.model !== '';
    }

    private get isEmpty(): boolean {
        return this.isFocus || this.hasValue ? false : true;
    }

    private get isFocus(): boolean {
        return this.internalIsFocus;
    }
}
