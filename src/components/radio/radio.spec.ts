import Vue from 'vue';
import '../../utils/polyfills';
import RadioPlugin, { MRadio, MRadioPosition } from './radio';

const DISABLED_CSS: string = 'm--is-disabled';
const POSITION_RIGHT_CSS: string = 'm--is-input-right';
const CHECKED_CSS: string = 'm--is-checked';
const MODE_BUTTON_CSS: string = 'm--is-mode-button';
const FULLSIZE_CSS: string = 'm--is-full-size';
const INLINE_CSS: string = 'm--is-inline';

let radio: MRadio;

describe('MRadioPosition', () => {
    it('validates enum', () => {
        expect(MRadioPosition.Left).toEqual('left');
        expect(MRadioPosition.Right).toEqual('right');
    });
});

describe('radio', () => {
    beforeEach(() => {
        Vue.use(RadioPlugin);
        radio = new MRadio().$mount();
    });

    it('css class for button group are not present', () => {
        expect(radio.$el.classList.contains(MODE_BUTTON_CSS)).toBeFalsy();
        expect(radio.$el.classList.contains(FULLSIZE_CSS)).toBeFalsy();
        expect(radio.$el.classList.contains(INLINE_CSS)).toBeFalsy();
    });

    it('iconname prop is ignored if not in button group', () => {
        let svg: SVGSVGElement | null = radio.$el.querySelector('svg');
        expect(svg).toBeFalsy();
        radio.iconName = 'chip-error';
        Vue.nextTick(() => {
            svg = radio.$el.querySelector('svg');
            expect(svg).toBeFalsy();
        });
    });

    it('radioID on the input and label elements', () => {
        let input: HTMLInputElement | null = radio.$el.querySelector('input');
        let label: HTMLLabelElement | null = radio.$el.querySelector('label');
        expect(input).toBeTruthy();
        expect(label).toBeTruthy();
        if (input) {
            expect(input.id).toEqual(radio.radioID);
        }
        if (label) {
            expect(label.htmlFor).toEqual(radio.radioID);
        }
    });

    it('disabled prop', () => {
        expect(radio.$el.classList.contains(DISABLED_CSS)).toBeFalsy();

        radio.disabled = true;
        Vue.nextTick(() => {
            expect(radio.$el.classList.contains(DISABLED_CSS)).toBeTruthy();

            radio.disabled = false;
            Vue.nextTick(() => {
                expect(radio.$el.classList.contains(DISABLED_CSS)).toBeFalsy();
            });
        });
    });

    it('name prop', () => {
        let input: HTMLInputElement | null = radio.$el.querySelector('input');
        expect(input).toBeTruthy();
        if (input) {
            expect(input.name).toEqual('');
            radio.name = 'name';
            Vue.nextTick(() => {
                if (input) {
                    expect(input.name).toEqual('name');
                }
            });
        }
    });

    it('position prop left', () => {
        expect(radio.$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();
        radio.position = MRadioPosition.Left;
        Vue.nextTick(() => {
            expect(radio.$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();
        });
    });

    it('position prop right', () => {
        expect(radio.$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();
        radio.position = MRadioPosition.Right;
        Vue.nextTick(() => {
            expect(radio.$el.classList.contains(POSITION_RIGHT_CSS)).toBeTruthy();
        });
    });

    it('value prop', () => {
        let input: HTMLInputElement | null = radio.$el.querySelector('input');
        expect(input).toBeTruthy();
        if (input) {
            expect(input.value).toEqual('');
            radio.value = 'value';
            Vue.nextTick(() => {
                if (input) {
                    expect(input.value).toEqual('value');
                }
            });
        }
    });

    it('v-model', () => {
        let vm = new Vue({
            data: {
                model: 'radio2'
            },
            template: `
            <div>
                <m-radio ref="a" value="radio1" name="radio" v-model="model"></m-radio>
                <m-radio ref="b" value="radio2" name="radio" v-model="model"></m-radio>
            </div>`
        }).$mount();

        let li1: HTMLLIElement = (vm.$refs.a as Vue).$el as HTMLLIElement;
        let li2: HTMLLIElement = (vm.$refs.b as Vue).$el as HTMLLIElement;

        expect(li1.classList.contains(CHECKED_CSS)).toBeFalsy();
        expect(li2.classList.contains(CHECKED_CSS)).toBeTruthy();
        (vm as any).model = 'radio1';
        Vue.nextTick(() => {
            expect(li1.classList.contains(CHECKED_CSS)).toBeTruthy();
            expect(li2.classList.contains(CHECKED_CSS)).toBeFalsy();
        });
    });

    it('change event', () => {
        let changeSpy = jasmine.createSpy('changeSpy');
        let vm = new Vue({
            data: {
                model: 'radio2'
            },
            template: `
            <div>
                <m-radio ref="a" @change="onChange" value="radio1" name="radio" v-model="model"></m-radio>
                <m-radio ref="b" @change="onChange" value="radio2" name="radio" v-model="model"></m-radio>
            </div>`,
            methods: {
                onChange: changeSpy
            }
        }).$mount();
        let input: HTMLInputElement | null = (vm.$refs.a as Vue).$el.querySelector('input');

        let e: any = document.createEvent('HTMLEvents');
        e.initEvent('change', true, true);

        if (input) {
            input.dispatchEvent(e);
        }
        Vue.nextTick(() => {
            expect(changeSpy).toHaveBeenCalledWith('radio1');
        });
    });
});
