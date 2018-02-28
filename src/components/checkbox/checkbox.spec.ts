import { createLocalVue, mount } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { renderComponent } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import { MValidationMessage } from '../validation-message/validation-message';
import MCheckboxPlugin, { MCheckbox, MCheckboxPosition } from './checkbox';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('MCheckbox', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(MCheckboxPlugin);
    });

    it('should render correctly', () => {
        const chkbox = mount(MCheckbox, {
            localVue: localVue
        });

        return expect(renderComponent(chkbox.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when position prop is right', () => {
        const chkbox = mount(MCheckbox, {
            localVue: localVue,
            propsData: {
                position: MCheckboxPosition.Right
            }
        });

        return expect(renderComponent(chkbox.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when value prop is true', () => {
        const chkbox = mount(MCheckbox, {
            localVue: localVue,
            propsData: {
                value: true
            }
        });

        return expect(renderComponent(chkbox.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when disabled', () => {
        const chkbox = mount(MCheckbox, {
            localVue: localVue,
            propsData: {
                disabled: true
            }
        });

        return expect(renderComponent(chkbox.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when a label is provided', () => {
        const chkbox = mount(MCheckbox, {
            localVue: localVue,
            slots: { default: 'label' }
        });

        return expect(renderComponent(chkbox.vm)).resolves.toMatchSnapshot();
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
                hasError(): void {
                    return false;
                },
                isDisabled(): void {
                    return false;
                }
            }
        });

        expect(chkbox.find(MValidationMessage).props()).toEqual(valMsgProps);
    });
});
