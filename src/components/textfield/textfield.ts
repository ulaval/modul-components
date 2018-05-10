import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import { InputLabel } from '../../mixins/input-label/input-label';
import { InputManagement } from '../../mixins/input-management/input-management';
import { InputState } from '../../mixins/input-state/input-state';
import { InputWidth } from '../../mixins/input-width/input-width';
import { ModulVue } from '../../utils/vue/vue';
import ButtonPlugin from '../button/button';
import { TEXTFIELD_NAME } from '../component-names';
import InputStyle from '../input-style/input-style';
import ValidationMesagePlugin from '../validation-message/validation-message';
import WithRender from './textfield.html?style=./textfield.scss';

export enum MTextfieldType {
    Text = 'text',
    Password = 'password',
    EMail = 'email',
    Url = 'url',
    Telephone = 'tel'
}

const ICON_NAME_PASSWORD_VISIBLE: string = 'show-password';
const ICON_NAME_PASSWORD_HIDDEN: string = 'hidden-password';

@WithRender
@Component({
    mixins: [
        InputState,
        InputManagement,
        InputWidth,
        InputLabel
    ]
})
export class MTextfield extends ModulVue {

    @Prop({
        default: MTextfieldType.Text,
        validator: value =>
            value === MTextfieldType.EMail ||
            value === MTextfieldType.Password ||
            value === MTextfieldType.Telephone ||
            value === MTextfieldType.Text ||
            value === MTextfieldType.Url
    })
    public type: MTextfieldType;
    @Prop({ default: true })
    public passwordIcon: boolean;

    private passwordAsText: boolean = false;

    private iconDescriptionShowPassword: string = this.$i18n.translate('m-textfield:show-password');
    private iconDescriptionHidePassword: string = this.$i18n.translate('m-textfield:hide-password');

    protected created(): void {
        if (!this.$i18n) {
            throw new Error('<m-text-field> -> this.$i18n is undefined, you must install the i18n plugin.');
        }
    }

    protected mounted(): void {
        (this.$refs.input as HTMLElement).setAttribute('type', this.inputType);
    }

    @Watch('type')
    private typeChanged(type: MTextfieldType): void {
        this.$log.warn('<' + TEXTFIELD_NAME + '>: Change of property "type" is not supported');
        (this.$refs.input as HTMLElement).setAttribute('type', this.inputType);
    }

    private togglePasswordVisibility(event): void {
        this.passwordAsText = !this.passwordAsText;
    }

    private get inputType(): MTextfieldType {
        let type: MTextfieldType = MTextfieldType.Text;
        if (this.type === MTextfieldType.Password && this.passwordAsText) {
            type = MTextfieldType.Text;
        } else if (this.type === MTextfieldType.Password || this.type === MTextfieldType.EMail || this.type === MTextfieldType.Url ||
            this.type === MTextfieldType.Telephone) {
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

    private get iconNamePassword(): string {
        return this.passwordAsText ? ICON_NAME_PASSWORD_HIDDEN : ICON_NAME_PASSWORD_VISIBLE;
    }

    private get iconDescriptionPassword(): string {
        return this.passwordAsText ? this.iconDescriptionHidePassword : this.iconDescriptionShowPassword;
    }

    private get propPasswordIcon(): boolean {
        return this.passwordIcon && this.type === MTextfieldType.Password && this.as<InputState>().active;
    }
}

const TextfieldPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(InputStyle);
        v.use(ValidationMesagePlugin);
        v.use(ButtonPlugin);
        v.component(TEXTFIELD_NAME, MTextfield);
    }
};

export default TextfieldPlugin;
