import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Model, Watch } from 'vue-property-decorator';
import WithRender from './textarea.html?style=./textarea.scss';
import { TEXTAREA_NAME } from '../component-names';
import { InputState, InputStateMixin } from '../../mixins/input-state/input-state';
import { KeyCode } from '../../utils/keycode/keycode';
import InputStyle from '../input-style/input-style';
import ValidationMesagePlugin from '../validation-message/validation-message';

@WithRender
@Component({
    mixins: [InputState]
})
export class MTextarea extends ModulVue {
    @Prop()
    @Model('change')
    public value: string;
    @Prop({ default: false })
    public forceFocus: boolean;
    @Prop({ default: true })
    public passwordIcon: boolean;
    @Prop()
    public label: string;
    @Prop()
    public iconName: string;
    @Prop()
    public placeholder: string;
    @Prop({ default: false })
    public waiting: boolean;

    private internalValue: string = '';
    private passwordAsText: boolean = false;
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

    @Watch('value')
    private onValueChange(value: string): void {
        this.internalValue = value;
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
        return this.isFocus || this.hasValue ? false : true;
    }

    private get isFocus(): boolean {
        return this.forceFocus ? true : this.internalIsFocus;
    }

    private get hasLabel(): boolean {
        return !!this.label;
    }

    private get hasIcon(): boolean {
        return !!this.iconName && !this.as<InputStateMixin>().isDisabled;
    }
}

const TextareaPlugin: PluginObject<any> = {
    install(v, options) {
        v.use(InputStyle);
        v.use(ValidationMesagePlugin);
        v.component(TEXTAREA_NAME, MTextarea);
    }
};

export default TextareaPlugin;
