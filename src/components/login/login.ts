import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import ButtonPlugin from '../button/button';
import I18nPlugin from '../i18n/i18n';
import IconButtonPlugin from '../icon-button/icon-button';
import TextFieldPlugin from '../textfield/textfield';
import WithRender from './login.html';

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
            this.$log.warn('No login function provided (login-fn prop is undefined)');
        }
    }
}

const LoginPlugin: PluginObject<any> = {
    install(v): void {
        v.prototype.$log.error('MLogin will be deprecated in modul v.1.0');

        v.use(I18nPlugin);
        v.use(ButtonPlugin);
        v.use(IconButtonPlugin);
        v.use(TextFieldPlugin);
        v.component(LOGIN_NAME, MLogin);
    }
};

export default LoginPlugin;
