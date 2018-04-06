import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import WithRender from './login.html';
import { Prop, Watch } from 'vue-property-decorator';
import ButtonPlugin from '../button/button';
import IconButtonPlugin from '../icon-button/icon-button';
import TextFieldPlugin from '../textfield/textfield';
import { ModulVue } from '../../utils/vue/vue';
import I18nPlugin from '../i18n/i18n';

const LOGIN_NAME: string = 'm-login';
export type LoginFn = (username: string, password: string) => Promise<any>;

@WithRender
@Component
export class MLogin extends ModulVue {
    @Prop()
    public loginFn: LoginFn;

    private user: string = '';
    private password: string = '';
    private lastError: string = '';

    private labelUser: string = this.$i18n.translate('m-login:user');
    private labelPassword: string = this.$i18n.translate('m-login:password');

    private login(): void {
        this.lastError = '';

        if (this.loginFn) {
            this.loginFn(this.user, this.password).then(() => {
                this.$emit('login');
            }, error => this.lastError = error);
        } else {
            console.warn('No login function provided (login-fn prop is undefined)');
        }
    }
}

const LoginPlugin: PluginObject<any> = {
    install(v, options): void {
        console.debug(LOGIN_NAME, 'plugin.install');
        v.use(I18nPlugin);
        v.use(ButtonPlugin);
        v.use(IconButtonPlugin);
        v.use(TextFieldPlugin);
        v.component(LOGIN_NAME, MLogin);
    }
};

export default LoginPlugin;
