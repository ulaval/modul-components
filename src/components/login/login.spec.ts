import { mount, shallowMount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import LoginPlugin, { MLogin } from './login';


jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('MLogin', () => {

    describe('when login', () => {
        it('should render correctly', () => {
            Vue.use(LoginPlugin);
            addMessages(Vue, ['components/login/login.lang.en.json']);

            const login: Wrapper<MLogin> = shallowMount(MLogin);

            return expect(renderComponent(login.vm)).resolves.toMatchSnapshot();
        });

        it('should call the login function with the provided credentials', () => {
            let loginMock: jest.Mock<Promise<void>> = jest.fn((user, password) => Promise.resolve());

            let wrapper: Wrapper<MLogin> = shallowMount(MLogin, {
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
