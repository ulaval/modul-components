import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Model, Watch } from 'vue-property-decorator';
import { InputStateMixin } from '../../mixins/input-state/input-state';
import { KeyCode } from '../../utils/keycode/keycode';

@Component
export class InputManagement extends ModulVue {
    @Prop()
    @Model('input')
    public value: string;
    @Prop()
    public label: string;
    @Prop()
    public iconName: string;
    @Prop()
    public placeholder: string;
    @Prop()
    public readonly: boolean;
    @Prop()
    public asterisk: boolean;

    public internalValue: string = '';
    private internalIsFocus: boolean = false;

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
            this.$emit('focus', event);
        }
    }

    private onBlur(event: Event): void {
        this.internalIsFocus = false;
        this.$emit('blur', event);
    }

    private onKeyup(event): void {
        if (!this.as<InputStateMixin>().isDisabled) {
            this.$emit('keyup', event, this.model);
        }
    }

    private onChange(event): void {
        this.$emit('change', this.model);
    }

    @Watch('value')
    private onValueChange(value: string): void {
        this.internalValue = value;
    }

    private set model(value: string) {
        this.internalValue = value;
        this.$emit('input', value);
    }

    private get model(): string {
        return this.value == undefined ? this.internalValue : this.value;
    }

    private get hasValue(): boolean {
        return this.model != '';
    }

    private get isEmpty(): boolean {
        return this.isFocus || this.hasValue ? false : true;
    }

    private get isFocus(): boolean {
        return this.internalIsFocus;
    }

    private get hasLabel(): boolean {
        return !!this.label;
    }

    private get hasIcon(): boolean {
        return !!this.iconName && !this.as<InputStateMixin>().isDisabled;
    }
}
