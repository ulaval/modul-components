import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
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


    it('should should have the indeterminated prop when indeterminated', () => {
        const chkbox: Wrapper<MCheckbox> = mount(MCheckbox, {
            localVue: localVue,
            propsData: {
                'indeterminate': true
            }
        });

        return expect((chkbox.find('input').element as any).indeterminate).toBeTruthy(); // TODO: Add prop to linter?
    });

    it('should flow down InputState mixin props to m-validation-message', () => {
        const valMsgProps: any = {
            disabled: false,
            error: false,
            errorMessage: 'error-message',
            validMessage: 'valid-message',
            helperMessage: 'helper-message',
            readonly: undefined,
            tagStyle: 'default',
            transition: true,
            valid: undefined,
            waiting: undefined
        };

        const chkbox: Wrapper<MCheckbox> = mount(MCheckbox, {
            localVue: localVue,
            propsData: valMsgProps,
            computed: {
                hasError(): boolean {
                    return false;
                },
                isDisabled(): boolean {
                    return false;
                }
            }
        });

        expect(chkbox.find(MValidationMessage).props()).toEqual(valMsgProps);
    });
});
