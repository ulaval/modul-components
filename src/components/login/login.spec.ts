import Vue from 'vue';
import { mount, Wrapper } from '@vue/test-utils';
import { resetModulPlugins } from '../../../tests/helpers/component';
import { MLogin } from './login';

describe('MLogin', () => {

    beforeEach(() => {
        resetModulPlugins();
    });

    describe('when login', () => {
        it('should call the login function with the provided credentials', () => {
            let loginMock = jest.fn((user, password) => Promise.resolve());

            let wrapper: Wrapper<MLogin> = mount(MLogin, {
                localVue: Vue,
                propsData: {
                    loginFn: loginMock
                }
            });

            wrapper.setData({
                user: 'username',
                password: 'pwd'
            });
            let form: Wrapper<Vue> = wrapper.find('form');
            form.trigger('submit');

            expect(loginMock).toHaveBeenCalledWith('username', 'pwd');
        });

        it('should warn when the login function is undefined', () => {
            jest.spyOn(console, 'warn');

            let wrapper: Wrapper<MLogin> = mount(MLogin, {
                localVue: Vue
            });

            let form: Wrapper<Vue> = wrapper.find('form');
            form.trigger('submit');

            expect(console.warn).toHaveBeenCalledWith('No login function provided (login-fn prop is undefined)');
        });
    });
});
