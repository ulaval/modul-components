import Vue from 'vue';
import '../../utils/polyfills';
import ValidationMessagePlugin, { MValidationMessage } from './validation-message';
import { InputStateMixin } from '../../mixins/input-state/input-state';
import SpritesHelper from '../../../tests/helpers/sprites';
import LangHelper from '../../../tests/helpers/lang';

let validationMessage: MValidationMessage;

describe('validation-message', () => {
    const VALIDATION_MESSAGE_CLASS: string = '.m-validation-message';
    const HELPER_CLASS: string = '.m-validation-message__helper';
    const VALID_CLASS: string = '.m-validation-message__valid';
    const ERROR_CLASS: string = '.m-validation-message__error';
    const MESSAGE_TEXT: string = '.m-validation-message__text';

    beforeEach(() => {
        spyOn(console, 'error');

        Vue.use(ValidationMessagePlugin);
        Vue.use(SpritesHelper);
        Vue.use(LangHelper);
    });

    afterEach(() => {
        Vue.nextTick(() => {
            expect(console.error).not.toHaveBeenCalled();
        });
    });

    it('displays nothing if no message', () => {
        validationMessage = new MValidationMessage().$mount();
        expect(validationMessage.$el.querySelector).toBeFalsy(); // element not even rendered
    });

    it('helper message', () => {
        validationMessage = new MValidationMessage().$mount();
        expect(validationMessage.$el.querySelector).toBeFalsy();

        ((validationMessage as any) as InputStateMixin).helperMessage = 'help';
        Vue.nextTick(() => {
            let text: Element | null = validationMessage.$el.querySelector(HELPER_CLASS);
            expect(text).toBeTruthy();
            if (text) {
                expect(text.textContent).toBe('help');
            }

            expect(validationMessage.$el.querySelector(VALID_CLASS)).toBeFalsy();
            expect(validationMessage.$el.querySelector(ERROR_CLASS)).toBeFalsy();
        });
    });

    it('valid message', () => {
        validationMessage = new MValidationMessage().$mount();
        expect(validationMessage.$el.querySelector).toBeFalsy();

        ((validationMessage as any) as InputStateMixin).validMessage = 'valid';
        Vue.nextTick(() => {
            expect(validationMessage.$el.querySelector(VALID_CLASS)).toBeTruthy();

            let text: Element | null = validationMessage.$el.querySelector(MESSAGE_TEXT);
            expect(text).toBeTruthy();
            if (text) {
                expect(text.textContent).toBe('valid');
            }

            expect(validationMessage.$el.querySelector(HELPER_CLASS)).toBeFalsy();
            expect(validationMessage.$el.querySelector(ERROR_CLASS)).toBeFalsy();
        });
    });

    it('error message', () => {
        validationMessage = new MValidationMessage().$mount();
        expect(validationMessage.$el.querySelector).toBeFalsy();

        ((validationMessage as any) as InputStateMixin).errorMessage = 'error';
        Vue.nextTick(() => {
            expect(validationMessage.$el.querySelector(ERROR_CLASS)).toBeTruthy();

            let text: Element | null = validationMessage.$el.querySelector(MESSAGE_TEXT);
            expect(text).toBeTruthy();
            if (text) {
                expect(text.textContent).toBe('error');
            }

            expect(validationMessage.$el.querySelector(HELPER_CLASS)).toBeFalsy();
            expect(validationMessage.$el.querySelector(VALID_CLASS)).toBeFalsy();
        });
    });

    describe('messages precedence', () => {
        let vm: Vue;
        beforeEach(() => {
            vm = new Vue({
                data: {
                    error: 'error',
                    valid: 'valid',
                    helper: 'help'
                },
                template: `<m-validation-message :error-message="error" :valid-message="valid" :helper-message="helper" ></m-validation-message>`
            }).$mount();
        });

        it('error message overrides helper & valid messages', () => {
            let text: Element | null = vm.$el.querySelector(MESSAGE_TEXT);
            expect(text).toBeTruthy();
            if (text) {
                expect(text.textContent).toBe('error');
            }

            (vm as any).valid = undefined;
            Vue.nextTick(() => {
                let text: Element | null = vm.$el.querySelector(MESSAGE_TEXT);
                expect(text).toBeTruthy();
                if (text) {
                    expect(text.textContent).toBe('error');
                }
            });
        });

        it('valid message overrides helper message', () => {
            (vm as any).error = undefined;
            Vue.nextTick(() => {
                let text: Element | null = vm.$el.querySelector(MESSAGE_TEXT);
                expect(text).toBeTruthy();
                if (text) {
                    expect(text.textContent).toBe('valid');
                }
            });
        });
    });

    describe('displays nothing when', () => {
        let vm: Vue;
        beforeEach(() => {
            vm = new Vue({
                data: {
                    error: 'error',
                    valid: 'valid',
                    helper: 'help',
                    disabled: false,
                    waiting: false
                },
                template: `
                    <div>
                        <m-validation-message :disabled="disabled" :waiting="waiting" :error-message="error" :valid-message="valid" :helper-message="helper" ></m-validation-message>
                    </div>`
            }).$mount();
        });

        it('disabled', () => {
            let element: Element | null = vm.$el.querySelector(VALIDATION_MESSAGE_CLASS);
            expect(element).toBeTruthy();

            (vm as any).disabled = true;
            Vue.nextTick(() => {
                element = vm.$el.querySelector(VALIDATION_MESSAGE_CLASS);
                expect(element).toBeFalsy();
            });
        });

        it('waiting', () => {
            let element: Element | null = vm.$el.querySelector(VALIDATION_MESSAGE_CLASS);
            expect(element).toBeTruthy();

            (vm as any).waiting = true;
            Vue.nextTick(() => {
                element = vm.$el.querySelector(VALIDATION_MESSAGE_CLASS);
                expect(element).toBeFalsy();
            });
        });
    });

    it('click event', () => {
        let clickSpy = jasmine.createSpy('clickSpy');
        let vm = new Vue({
            template: `<m-validation-message ref="a" @click="onClick" helper-message="helper" ></m-validation-message>`,
            methods: {
                onClick: clickSpy
            }
        }).$mount();

        let e: any = document.createEvent('HTMLEvents');
        e.initEvent('click', true, true);

        vm.$el.dispatchEvent(e);

        Vue.nextTick(() => {
            expect(clickSpy).toHaveBeenCalledWith(e);
        });
    });
});
