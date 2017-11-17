import Vue from 'vue';
import '../../utils/polyfills';
import ValidationMessagePlugin, { MValidationMessage } from './validation-message';
import { InputStateMixin } from '../../mixins/input-state/input-state';
import SpritesHelper from '../../../tests/helpers/sprites';
import LangHelper from '../../../tests/helpers/lang';

let validationMessage: MValidationMessage;

describe('validation-message', () => {
    const HELPER_CLASS: string = '.m-validation-message__helper';
    const VALID_CLASS: string = '.m-validation-message__valid';
    const ERROR_CLASS: string = '.m-validation-message__error';

    beforeEach(() => {
        Vue.use(ValidationMessagePlugin);
        Vue.use(SpritesHelper);
        Vue.use(LangHelper);
        validationMessage = new MValidationMessage().$mount();
    });

    it('displays nothing if no message', () => {
        expect(validationMessage.$el.querySelector).toBeFalsy(); // element not even rendered
    });

    it('helper message', () => {
        expect(validationMessage.$el.querySelector).toBeFalsy();

        ((validationMessage as any) as InputStateMixin).helperMessage = 'help';
        Vue.nextTick(() => {
            expect(validationMessage.$el.querySelector(HELPER_CLASS)).toBeTruthy();

            expect(validationMessage.$el.querySelector(VALID_CLASS)).toBeFalsy();
            expect(validationMessage.$el.querySelector(ERROR_CLASS)).toBeFalsy();
        });
    });
});
