import Vue from 'vue';
import '../../utils/polyfills';
import CheckboxPlugin, { MCheckbox, MCheckboxPosition } from './checkbox';
import { InputStateMixin } from '../../mixins/input-state/input-state';
import SpritesHelper from '../../../tests/helpers/sprites';
import LangHelper from '../../../tests/helpers/lang';

const POSITION_LEFT_CSS: string = 'm--is-checkbox-left';
const POSITION_RIGHT_CSS: string = 'm--is-checkbox-right';
const CHECKED_CSS: string = 'm--is-checked';
const FOCUS_CSS: string = 'm--is-focus';
const DISABLED_CSS: string = 'm--is-disabled';
const HAS_ERROR_CSS: string = 'm--has-error';
const IS_VALID_CSS: string = 'm--is-valid';

const VALIDATION_MESSAGE_CLASS: string = '.m-validation-message';

let checkbox: MCheckbox;

describe('MCheckboxPosition', () => {
    it('validates enum', () => {
        expect(MCheckboxPosition.Left).toEqual('left');
        expect(MCheckboxPosition.Right).toEqual('right');
    });
});

describe('checkbox', () => {
    beforeEach(() => {
        Vue.use(CheckboxPlugin);
        Vue.use(SpritesHelper);
        Vue.use(LangHelper);
    });

    it('css class for checkbox are not present', () => {
        checkbox = new MCheckbox().$mount();
        expect(checkbox.$el.classList.contains(CHECKED_CSS)).toBeFalsy();
        expect(checkbox.$el.classList.contains(FOCUS_CSS)).toBeFalsy();
        expect(checkbox.$el.classList.contains(DISABLED_CSS)).toBeFalsy();
        expect(checkbox.$el.classList.contains(HAS_ERROR_CSS)).toBeFalsy();
        expect(checkbox.$el.classList.contains(IS_VALID_CSS)).toBeFalsy();

        expect(checkbox.$el.querySelector(VALIDATION_MESSAGE_CLASS)).toBeFalsy();
    });

    it('checkboxID on the input and label elements', () => {
        checkbox = new MCheckbox().$mount();
        let input: HTMLInputElement | null = checkbox.$el.querySelector('input');
        let label: HTMLLabelElement | null = checkbox.$el.querySelector('label');
        expect(input).toBeTruthy();
        expect(label).toBeTruthy();
        if (input && label) {
            expect(input.id).toEqual(label.htmlFor);
        }
    });

    it('position prop left', () => {
        checkbox = new MCheckbox().$mount();
        expect(checkbox.$el.classList.contains(POSITION_LEFT_CSS)).toBeTruthy();
        expect(checkbox.$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();

        checkbox.position = MCheckboxPosition.Left;
        Vue.nextTick(() => {
            expect(checkbox.$el.classList.contains(POSITION_LEFT_CSS)).toBeTruthy();
            expect(checkbox.$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();
        });
    });

    it('position prop right', () => {
        checkbox = new MCheckbox().$mount();
        expect(checkbox.$el.classList.contains(POSITION_LEFT_CSS)).toBeTruthy();
        expect(checkbox.$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();

        checkbox.position = MCheckboxPosition.Right;
        Vue.nextTick(() => {
            expect(checkbox.$el.classList.contains(POSITION_LEFT_CSS)).toBeFalsy();
            expect(checkbox.$el.classList.contains(POSITION_RIGHT_CSS)).toBeTruthy();
        });
    });

    it('value prop', () => {
        checkbox = new MCheckbox().$mount();
        let input: HTMLInputElement | null = checkbox.$el.querySelector('input');
        expect(input).toBeTruthy();
        if (input) {
            expect(input.checked).toBeFalsy();
            checkbox.value = true;
            Vue.nextTick(() => {
                if (input) {
                    expect(input.checked).toBeTruthy();
                }
            });
        }
    });

    it('disabled prop', () => {
        checkbox = new MCheckbox().$mount();
        let input: HTMLInputElement | null = checkbox.$el.querySelector('input');
        expect(input).toBeTruthy();
        if (input) {
            expect(input.disabled).toBeFalsy();
            ((checkbox as any) as InputStateMixin).disabled = true;
            Vue.nextTick(() => {
                if (input) {
                    expect(input.disabled).toBeTruthy();
                }
            });
        }
    });

    it('v-model', () => {
        let vm = new Vue({
            data: {
                model: false
            },
            template: `
            <div>
                <m-checkbox ref="a" :value="model"></m-checkbox>
            </div>`
        }).$mount();

        let element: HTMLElement = (vm.$refs.a as Vue).$el as HTMLElement;

        expect(element.classList.contains(CHECKED_CSS)).toBeFalsy();
        (vm as any).model = true;
        Vue.nextTick(() => {
            expect(element.classList.contains(CHECKED_CSS)).toBeTruthy();
        });
    });

    it('label', () => {
        const LABEL: string = '.m-checkbox__label';

        let vm = new Vue({
            data: {
                label: 'label'
            },
            template: `
            <div>
                <m-checkbox ref="a">{{label}}</m-checkbox>
            </div>`
        }).$mount();

        let element: HTMLElement = (vm.$refs.a as Vue).$el as HTMLElement;

        expect(element.querySelector(LABEL)).toBeTruthy();
        (vm as any).label = undefined;
        Vue.nextTick(() => {
            expect(element.querySelector(LABEL)).toBeFalsy();
        });
    });

    it('click event', () => {
        let clickSpy = jasmine.createSpy('clickSpy');
        let vm = new Vue({
            data: {
                model: false
            },
            template: `
            <div>
                <m-checkbox ref="a" @click="onClick" value="model"></m-checkbox>
            </div>`,
            methods: {
                onClick: clickSpy
            }
        }).$mount();

        let input: HTMLInputElement | null = (vm.$refs.a as Vue).$el.querySelector('input');

        let e: any = document.createEvent('HTMLEvents');
        e.initEvent('click', true, true);

        if (input) {
            input.dispatchEvent(e);
        }
        Vue.nextTick(() => {
            expect(clickSpy).toHaveBeenCalledWith(e);
        });
    });

    describe('validation message', () => {
        let vm: Vue;
        beforeEach(() => {
            vm = new Vue({
                data: {
                    error: 'error',
                    valid: 'valid',
                    helper: 'helper',
                    disabled: false
                },
                template: `
            <div>
                <m-checkbox ref="a" :error-message="error" :valid-message="valid" :helper-message="helper" :disabled="disabled"></m-checkbox>
            </div>`
            }).$mount();
        });

        it('error message', () => {
            expect(vm.$el.querySelector(VALIDATION_MESSAGE_CLASS)).toBeTruthy();
            expect((((vm.$refs.a as Vue).$refs.validation as any) as InputStateMixin).errorMessage).toEqual((vm as any).error);
        });

        it('valid message', () => {
            (vm as any).error = undefined;
            Vue.nextTick(() => {
                expect(vm.$el.querySelector(VALIDATION_MESSAGE_CLASS)).toBeTruthy();
                expect((((vm.$refs.a as Vue).$refs.validation as any) as InputStateMixin).validMessage).toEqual((vm as any).valid);
            });
        });

        it('helper message', () => {
            (vm as any).error = undefined;
            (vm as any).valid = undefined;
            Vue.nextTick(() => {
                expect(vm.$el.querySelector(VALIDATION_MESSAGE_CLASS)).toBeTruthy();
                expect((((vm.$refs.a as Vue).$refs.validation as any) as InputStateMixin).helperMessage).toEqual((vm as any).helper);
            });
        });

        it('disabled', () => {
            (vm as any).disabled = true;
            Vue.nextTick(() => {
                expect(vm.$el.querySelector(VALIDATION_MESSAGE_CLASS)).toBeFalsy();
            });
        });
    });
});
