import { createLocalVue, mount } from '@vue/test-utils';
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
        const valMsg = mount(MValidationMessage, {
            localVue: localVue
        });

        expect(renderComponent(valMsg.vm)).resolves.toEqual('');
    });

    it('should render nothing when it is disabled', () => {
        const valMsg = mount(MValidationMessage, {
            localVue: localVue,
            propsData: {
                disabled: true
            }
        });

        expect(renderComponent(valMsg.vm)).resolves.toEqual('');
    });

    it('should render nothing when it is waiting', () => {
        const valMsg = mount(MValidationMessage, {
            localVue: localVue,
            propsData: {
                waiting: true
            }
        });

        expect(renderComponent(valMsg.vm)).resolves.toEqual('');
    });

    it('should render nothing when it is disabled', () => {
        const valMsg = mount(MValidationMessage, {
            localVue: localVue,
            propsData: {
                disabled: true
            }
        });

        expect(renderComponent(valMsg.vm)).resolves.toEqual('');
    });

    it('should render helper message when prop is set', () => {
        const valMsg = mount(MValidationMessage, {
            localVue: localVue,
            propsData: {
                helperMessage: 'help'
            }
        });

        expect(renderComponent(valMsg.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when it is valid', () => {
        const valMsg = mount(MValidationMessage, {
            localVue: localVue,
            propsData: {
                validMessage: 'valid'
            }
        });

        expect(renderComponent(valMsg.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when it is in error', () => {
        const valMsg = mount(MValidationMessage, {
            localVue: localVue,
            propsData: {
                errorMessage: 'error'
            }
        });

        expect(renderComponent(valMsg.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when it is in error', () => {
        const valMsg = mount(MValidationMessage, {
            localVue: localVue,
            propsData: {
                errorMessage: 'error'
            }
        });

        expect(renderComponent(valMsg.vm)).resolves.toMatchSnapshot();
    });

    it('should render error message even if there is a valid message', () => {
        const valMsg = mount(MValidationMessage, {
            localVue: localVue,
            propsData: {
                validMessage: 'valid',
                errorMessage: 'error'
            }
        });

        expect(renderComponent(valMsg.vm)).resolves.toMatchSnapshot();
    });

    it('should emit click event when clicked', () => {
        const valMsg = mount(MValidationMessage, {
            localVue: localVue,
            propsData: {
                validMessage: 'valid',
                errorMessage: 'error'
            }
        });

        valMsg.find('div').trigger('click');

        expect(valMsg.emitted('click')).toBeTruthy();
    });

    /*
    it('should render correctly when position prop is right', () => {
        const valMsg = mount(MCheckbox, {
            localVue: localVue,
            propsData: {
                position: MCheckboxPosition.Right
            }
        });

        expect(renderComponent(valMsg.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when value prop is true', () => {
        const chkbox = mount(MCheckbox, {
            localVue: localVue,
            propsData: {
                value: true
            }
        });

        expect(renderComponent(chkbox.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when disabled', () => {
        const chkbox = mount(MCheckbox, {
            localVue: localVue,
            propsData: {
                disabled: true
            }
        });

        expect(renderComponent(chkbox.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when a label is provided', () => {
        const chkbox = mount(MCheckbox, {
            localVue: localVue,
            slots: { default: 'label' }
        });

        expect(renderComponent(chkbox.vm)).resolves.toMatchSnapshot();
    });

    it('should emit click event when clicked', () => {
        const chkbox = mount(MCheckbox, {
            localVue: localVue
        });

        chkbox.find('input').trigger('click');

        expect(chkbox.emitted('click')).toBeTruthy();
    });

    it('should flow down InputState mixin props to m-validation-message', () => {
        const valMsgProps = {
            disabled: false,
            error: false,
            errorMessage: 'error-message',
            validMessage: 'valid-message',
            helperMessage: 'helper-message'
        };

        const chkbox = mount(MCheckbox, {
            localVue: localVue,
            propsData: valMsgProps,
            computed: {
                hasError() {
                    return false;
                },
                isDisabled() {
                    return false;
                }
            }
        });

        expect(chkbox.find(MValidationMessage).props()).toEqual(valMsgProps);
    }); */
});
