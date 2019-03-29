import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent } from '../../../tests/helpers/render';
import ValidationMessagePlugin, { MValidationMessage } from '../validation-message/validation-message';


describe('MValidationMessage', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(ValidationMessagePlugin);
        addMessages(localVue, [
            'components/validation-message/validation-message.lang.en.json'
        ]);
    });

    it('should render nothing when there is no validation message', () => {
        const valMsg: Wrapper<MValidationMessage> = mount(MValidationMessage, {
            localVue: localVue
        });

        expect(renderComponent(valMsg.vm)).resolves.toEqual('');
    });

    it('should render nothing when it is disabled', () => {
        const valMsg: Wrapper<MValidationMessage> = mount(MValidationMessage, {
            localVue: localVue,
            propsData: {
                disabled: true
            }
        });

        expect(renderComponent(valMsg.vm)).resolves.toEqual('');
    });

    it('should render nothing when it is waiting', () => {
        const valMsg: Wrapper<MValidationMessage> = mount(MValidationMessage, {
            localVue: localVue,
            propsData: {
                waiting: true
            }
        });

        expect(renderComponent(valMsg.vm)).resolves.toEqual('');
    });

    it('should render nothing when it is disabled', () => {
        const valMsg: Wrapper<MValidationMessage> = mount(MValidationMessage, {
            localVue: localVue,
            propsData: {
                disabled: true
            }
        });

        expect(renderComponent(valMsg.vm)).resolves.toEqual('');
    });

    it('should render helper message when prop is set', () => {
        const valMsg: Wrapper<MValidationMessage> = mount(MValidationMessage, {
            localVue: localVue,
            propsData: {
                helperMessage: 'help'
            }
        });

        return expect(renderComponent(valMsg.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when it is valid', () => {
        const valMsg: Wrapper<MValidationMessage> = mount(MValidationMessage, {
            localVue: localVue,
            propsData: {
                validMessage: 'valid'
            }
        });

        return expect(renderComponent(valMsg.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when it is in error', () => {
        const valMsg: Wrapper<MValidationMessage> = mount(MValidationMessage, {
            localVue: localVue,
            propsData: {
                errorMessage: 'error'
            }
        });

        return expect(renderComponent(valMsg.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when it is in error', () => {
        const valMsg: Wrapper<MValidationMessage> = mount(MValidationMessage, {
            localVue: localVue,
            propsData: {
                errorMessage: 'error'
            }
        });

        return expect(renderComponent(valMsg.vm)).resolves.toMatchSnapshot();
    });

    it('should render error message even if there is a valid message', () => {
        const valMsg: Wrapper<MValidationMessage> = mount(MValidationMessage, {
            localVue: localVue,
            propsData: {
                validMessage: 'valid',
                errorMessage: 'error'
            }
        });

        return expect(renderComponent(valMsg.vm)).resolves.toMatchSnapshot();
    });

    it('should emit click event when clicked', () => {
        const valMsg: Wrapper<MValidationMessage> = mount(MValidationMessage, {
            localVue: localVue,
            propsData: {
                validMessage: 'valid',
                errorMessage: 'error'
            }
        });

        valMsg.trigger('click');

        expect(valMsg.emitted('click')).toBeTruthy();
    });
});
