
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Model, Watch } from 'vue-property-decorator';
import WithRender from './textfield.html?style=./textfield.scss';
import { TEXTFIELD_NAME } from '../component-names';
import { InputState } from '../../mixins/input-state/input-state';
import { InputManagement } from '../../mixins/input-management/input-management';
import { KeyCode } from '../../utils/keycode/keycode';
import InputStyle from '../input-style/input-style';
import ValidationMesagePlugin from '../validation-message/validation-message';
import ButtonPlugin from '../button/button';

export enum MTextfieldType {
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
    mixins: [
        InputState,
        InputManagement
    ]
})
export class MTextfield extends ModulVue {

    @Prop({
        default: MTextfieldType.Text,
        validator: value =>
            value == MTextfieldType.EMail ||
            value == MTextfieldType.Password ||
            value == MTextfieldType.Telephone ||
            value == MTextfieldType.Text ||
            value == MTextfieldType.Url
    })
    public type: MTextfieldType;
    @Prop({ default: true })
    public passwordIcon: boolean;
    @Prop()
    public asterisk: boolean;

    private passwordAsText: boolean = false;

    private iconDescriptionShowPassword: string = this.$i18n.translate('m-textfield:show-password');
    private iconDescriptionHidePassword: string = this.$i18n.translate('m-textfield:hide-password');

    protected mounted(): void {
        (this.$refs.input as HTMLElement).setAttribute('type', this.inputType);
    }

    @Watch('type')
    private typeChanged(type: MTextfieldType): void {
        console.warn('<' + TEXTFIELD_NAME + '>: Change of property "type" is not supported');
        (this.$refs.input as HTMLElement).setAttribute('type', this.inputType);
    }

    private togglePasswordVisibility(event): void {
        this.passwordAsText = !this.passwordAsText;
    }

    private get inputType(): MTextfieldType {
        let type: MTextfieldType = MTextfieldType.Text;
        if (this.type == MTextfieldType.Password && this.passwordAsText) {
            type = MTextfieldType.Text;
        } else if (this.type == MTextfieldType.Password || this.type == MTextfieldType.EMail || this.type == MTextfieldType.Url ||
            this.type == MTextfieldType.Telephone) {
            type = this.type;
        }
        this.$nextTick(() => {
            let inputEl: HTMLElement = this.$refs.input as HTMLElement;
            if (inputEl) {
                inputEl.setAttribute('type', type);
            }
        });
        return type;
    }

    private get iconNamePassword() {
        return this.passwordAsText ? ICON_NAME_PASSWORD_HIDDEN : ICON_NAME_PASSWORD_VISIBLE;
    }

    private get iconDescriptionPassword() {
        return this.passwordAsText ? this.iconDescriptionHidePassword : this.iconDescriptionShowPassword;
    }

    private get propPasswordIcon(): boolean {
        return this.passwordIcon && this.type == MTextfieldType.Password && this.as<InputState>().active;
    }
}

const TextfieldPlugin: PluginObject<any> = {
    install(v, options) {
        v.use(InputStyle);
        v.use(ValidationMesagePlugin);
        v.use(ButtonPlugin);
        v.component(TEXTFIELD_NAME, MTextfield);
    }
};

export default TextfieldPlugin;
