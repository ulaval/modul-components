import Component from 'vue-class-component';
import { Model, Prop, Watch } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { InputStateMixin } from '../input-state/input-state';


export interface InputManagementProps {
    value: string;
    placeholder: string;
    focus: boolean;
}

export interface InputManagementData {
    internalValue: string;
}

export interface InputManagementFocusable {
    focusInput(): void;
}

@Component
export class InputManagement extends ModulVue
    implements InputManagementProps, InputManagementData, InputManagementFocusable {

    @Prop()
    @Model('input')
    public value: string;
    @Prop()
    public placeholder: string;
    @Prop()
    public autocomplete: string;
    @Prop()
    public focus: boolean;

    public trimWordWrap: boolean = false;

    public internalValue: string = '';

    public internalIsFocus: boolean = false;

    private mounted(): void {
        if (this.focus) {
            this.focusChanged(this.focus);
        }
    }

    public focusInput(): void {
        let inputEl: HTMLElement | undefined = this.as<InputStateMixin>().getInput();
        if (inputEl) {
            inputEl.focus();
        }
    }

    public get hasValue(): boolean {
        return !!(this.model || '').toString().trim();
    }

    onClick(event: MouseEvent): void {
        this.internalIsFocus = this.as<InputStateMixin>().active;
        let inputEl: HTMLElement | undefined = this.as<InputStateMixin>().getInput();
        if (this.internalIsFocus && inputEl) {
            inputEl.focus();
        }
        this.$emit('click');
    }

    onFocus(event: FocusEvent): void {
        this.internalIsFocus = this.as<InputStateMixin>().active;
        if (this.internalIsFocus) {
            this.$emit('focus', event);
        }
    }

    onBlur(event: Event): void {
        this.internalIsFocus = false;
        this.$emit('blur', event);
    }

    onKeyup(event: Event): void {
        if (this.as<InputStateMixin>().active) {
            this.$emit('keyup', event, this.model);
        }
    }

    onKeydown(event: Event): void {
        if (this.as<InputStateMixin>().active) {
            this.$emit('keydown', event);
        }
    }

    onChange(event: Event): void {
        this.$emit('change', this.model);
    }

    onPaste(event: Event): void {
        this.$emit('paste', event);
    }

    getTrimValue(value: string): string {
        return /\n/g.test(value) && this.trimWordWrap ? value.replace(/\n/g, '') : value;
    }

    set model(value: string) {
        this.internalValue = this.getTrimValue(value);
        this.$emit('input', this.internalValue);
    }

    get model(): string {
        return this.internalValue;
    }

    get isEmpty(): boolean {
        return this.isFocus || this.hasValue ? false : true;
    }

    get isFocus(): boolean {
        return this.internalIsFocus;
    }

    @Watch('value', { immediate: true })
    private onValueChange(value: string): void {
        this.internalValue = this.getTrimValue(this.value || '');
    }

    @Watch('focus')
    private focusChanged(focus: boolean): void {
        this.internalIsFocus = focus && this.as<InputStateMixin>().active;
        let inputEl: HTMLElement | undefined = this.as<InputStateMixin>().getInput();
        if (inputEl) {
            if (this.internalIsFocus) {
                inputEl.focus();
            } else {
                inputEl.blur();
            }
        }
    }
}
