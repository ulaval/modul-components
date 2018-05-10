import Vue from 'vue';
import { mount, Wrapper } from '@vue/test-utils';
import LoginPlugin, { MLogin } from './login';
import { renderComponent } from '../../../tests/helpers/render';
import { addMessages } from '../../../tests/helpers/lang';

describe('MLogin', () => {

    describe('when login', () => {
        it('should render correctly', () => {
            Vue.use(LoginPlugin);
            addMessages(Vue, ['components/login/login.lang.en.json']);

            const login: Wrapper<MLogin> = mount(MLogin, {
                localVue: Vue
            });

            return expect(renderComponent(login.vm)).resolves.toMatchSnapshot();
        });

        it('should call the login function with the provided credentials', () => {
            let loginMock = jest.fn((user, password) => Promise.resolve());

            let wrapper: Wrapper<MLogin> = mount(MLogin, {
                localVue: Vue,
                propsData: {
                    loginFn: loginMock
                },
                data: {
                    user: 'username',
                    password: 'pwd'
                }
            });

            let form: Wrapper<Vue> = wrapper.find('form');
            form.trigger('submit');

            expect(loginMock).toHaveBeenCalledWith('username', 'pwd');
        });

        it('should warn when the login function is undefined', () => {
            jest.spyOn(Vue.prototype.$log, 'warn');

            let wrapper: Wrapper<MLogin> = mount(MLogin, {
                localVue: Vue
            });

            let form: Wrapper<Vue> = wrapper.find('form');
            form.trigger('submit');

            expect(Vue.prototype.$log.warn).toHaveBeenCalledWith('No login function provided (login-fn prop is undefined)');
        });
    });
});
