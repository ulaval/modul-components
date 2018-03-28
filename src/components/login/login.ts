import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import WithRender from './login.html';
import { Prop, Watch } from 'vue-property-decorator';
import ButtonPlugin from '../button/button';
import IconButtonPlugin from '../icon-button/icon-button';
import TextFieldPlugin from '../textfield/textfield';

const LOGIN_NAME: string = 'm-login';
export type LoginFn = (username: string, password: string) => Promise<any>;

@WithRender
@Component
export class MLogin extends Vue {
    @Prop()
    public loginFn: LoginFn;

    private user: string = '';
    private password: string = '';
    private lastError: string = '';

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
        v.use(ButtonPlugin);
        v.use(IconButtonPlugin);
        v.use(TextFieldPlugin);
        v.component(LOGIN_NAME, MLogin);
    }
};

export default LoginPlugin;
