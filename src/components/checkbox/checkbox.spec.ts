import Vue from 'vue';
import '../../utils/polyfills';
import CheckboxPlugin, { MCheckbox, MCheckboxPosition } from './checkbox';

const POSITION_LEFT_CSS: string = 'm--is-checkbox-left';
const POSITION_RIGHT_CSS: string = 'm--is-checkbox-right';
const CHECKED_CSS: string = 'm--is-checked';
const FOCUS_CSS: string = 'm--is-focus';

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
        checkbox = new MCheckbox().$mount();
    });

    it('css class for checkbox are present', () => {
        expect(checkbox.$el.classList.contains(POSITION_LEFT_CSS || POSITION_RIGHT_CSS)).toBeTruthy();
    });

    it('css class for checkbox are not present', () => {
        expect(checkbox.$el.classList.contains(CHECKED_CSS)).toBeFalsy();
        expect(checkbox.$el.classList.contains(FOCUS_CSS)).toBeFalsy();
    });

    it('checkboxID on the input and label elements', () => {
        let input: HTMLInputElement | null = checkbox.$el.querySelector('input');
        let label: HTMLLabelElement | null = checkbox.$el.querySelector('label');
        expect(input).toBeTruthy();
        expect(label).toBeTruthy();
        if (input && label) {
            expect(input.id).toEqual(label.htmlFor);
        }
    });

    it('position prop left', () => {
        expect(checkbox.$el.classList.contains(POSITION_LEFT_CSS)).toBeTruthy();
        checkbox.position = MCheckboxPosition.Left;
        Vue.nextTick(() => {
            expect(checkbox.$el.classList.contains(POSITION_LEFT_CSS)).toBeTruthy();
        });
    });

    it('position prop right', () => {
        expect(checkbox.$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();
        checkbox.position = MCheckboxPosition.Right;
        Vue.nextTick(() => {
            expect(checkbox.$el.classList.contains(POSITION_RIGHT_CSS)).toBeTruthy();
        });
    });

    it('value prop', () => {
        let input: HTMLInputElement | null = checkbox.$el.querySelector('input');
        expect(input).toBeTruthy();
        if (input) {
            expect(input.checked ).toBeFalsy();
            checkbox.value = true;
            Vue.nextTick(() => {
                if (input) {
                    expect(input.checked).toBeTruthy();
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

        let li: HTMLLIElement = (vm.$refs.a as Vue).$el as HTMLLIElement;

        expect(li.classList.contains(CHECKED_CSS)).toBeFalsy();
        (vm as any).model = true;
        Vue.nextTick(() => {
            expect(li.classList.contains(CHECKED_CSS)).toBeTruthy();
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

});
