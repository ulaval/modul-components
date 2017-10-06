import Vue from 'vue';
import '../../utils/polyfills';
import DropdownPlugin, { MDropdown } from './dropdown';

const DISABLED_CSS: string = 'm--is-disabled';
const WAITING_CSS: string = 'm--is-waiting';
const SELECTED_CSS: string = 'm--is-selected';

let dropdown: MDropdown;

describe('dropdown', () => {
    beforeEach(() => {
        Vue.use(DropdownPlugin);
        dropdown = new MDropdown().$mount();
    });

    it('css class for dropdown are not present', () => {
        expect(dropdown.$el.classList.contains(DISABLED_CSS)).toBeFalsy();
        expect(dropdown.$el.classList.contains(WAITING_CSS)).toBeFalsy();
    });

    // it('iconname prop is ignored if not in button group', () => {
    //     let svg: SVGSVGElement | null = radio.$el.querySelector('svg');
    //     expect(svg).toBeFalsy();
    //     radio.iconName = 'chip-error';
    //     Vue.nextTick(() => {
    //         svg = radio.$el.querySelector('svg');
    //         expect(svg).toBeFalsy();
    //     });
    // });

    // it('radioID on the input and label elements', () => {
    //     let input: HTMLInputElement | null = radio.$el.querySelector('input');
    //     let label: HTMLLabelElement | null = radio.$el.querySelector('label');
    //     expect(input).toBeTruthy();
    //     expect(label).toBeTruthy();
    //     if (input) {
    //         expect(input.id).toEqual(radio.radioID);
    //     }
    //     if (label) {
    //         expect(label.htmlFor).toEqual(radio.radioID);
    //     }
    // });

    it('enabled prop disabled', () => {
        expect(dropdown.$el.classList.contains(DISABLED_CSS)).toBeFalsy();

        dropdown.disabled = true;
        Vue.nextTick(() => {
            expect(dropdown.$el.classList.contains(DISABLED_CSS)).toBeTruthy();

            dropdown.disabled = false;
            Vue.nextTick(() => {
                expect(dropdown.$el.classList.contains(DISABLED_CSS)).toBeFalsy();
            });
        });
    });

    it('enabled prop waiting', () => {
        expect(dropdown.$el.classList.contains(WAITING_CSS)).toBeFalsy();

        dropdown.waiting = true;
        Vue.nextTick(() => {
            expect(dropdown.$el.classList.contains(WAITING_CSS)).toBeTruthy();

            dropdown.waiting = false;
            Vue.nextTick(() => {
                expect(dropdown.$el.classList.contains(WAITING_CSS)).toBeFalsy();
            });
        });
    });

    // it('name prop', () => {
    //     let input: HTMLInputElement | null = radio.$el.querySelector('input');
    //     expect(input).toBeTruthy();
    //     if (input) {
    //         expect(input.name).toEqual('');
    //         radio.name = 'name';
    //         Vue.nextTick(() => {
    //             if (input) {
    //                 expect(input.name).toEqual('name');
    //             }
    //         });
    //     }
    // });

    // it('position prop left', () => {
    //     expect(radio.$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();
    //     radio.position = MRadioPosition.Left;
    //     Vue.nextTick(() => {
    //         expect(radio.$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();
    //     });
    // });

    // it('position prop right', () => {
    //     expect(radio.$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();
    //     radio.position = MRadioPosition.Right;
    //     Vue.nextTick(() => {
    //         expect(radio.$el.classList.contains(POSITION_RIGHT_CSS)).toBeTruthy();
    //     });
    // });

    // it('value prop', () => {
    //     let input: HTMLInputElement | null = radio.$el.querySelector('input');
    //     expect(input).toBeTruthy();
    //     if (input) {
    //         expect(input.value).toEqual('');
    //         radio.value = 'value';
    //         Vue.nextTick(() => {
    //             if (input) {
    //                 expect(input.value).toEqual('value');
    //             }
    //         });
    //     }
    // });

    it('v-model', () => {
        let vm = new Vue({
            data: {
                model: 'Item B'
            },
            template: `
                <m-dropdown v-model="model">
                    <m-dropdown-item ref="a" value="Item A" label="Item A*"></m-dropdown-item>
                    <m-dropdown-item ref="b" value="Item B" label="Item B*"></m-dropdown-item>
                    <m-dropdown-item ref="c" value="Item C" label="Item C*"></m-dropdown-item>
                    <m-dropdown-item ref="d" value="Item D" label="Item D*"></m-dropdown-item>
                    <m-dropdown-item ref="e" value="Item E" label="Item E*"></m-dropdown-item>
                </m-dropdown>`
        }).$mount();

        let li1: HTMLElement = (vm.$refs.a as Vue).$el as HTMLElement;
        let li2: HTMLElement = (vm.$refs.b as Vue).$el as HTMLElement;

        expect(li1.classList.contains(SELECTED_CSS)).toBeFalsy();
        expect(li2.classList.contains(SELECTED_CSS)).toBeTruthy();

        (vm as any).model = 'Item A';
        Vue.nextTick(() => {
            expect(li1.classList.contains(SELECTED_CSS)).toBeTruthy();
            expect(li2.classList.contains(SELECTED_CSS)).toBeFalsy();
        });
    });

    // it('change event', () => {
    //     let changeSpy = jasmine.createSpy('changeSpy');
    //     let vm = new Vue({
    //         data: {
    //             model: 'radio2'
    //         },
    //         template: `
    //         <div>
    //             <m-radio ref="a" @change="onChange" value="radio1" name="radio" v-model="model"></m-radio>
    //             <m-radio ref="b" @change="onChange" value="radio2" name="radio" v-model="model"></m-radio>
    //         </div>`,
    //         methods: {
    //             onChange: changeSpy
    //         }
    //     }).$mount();
    //     let input: HTMLInputElement | null = (vm.$refs.a as Vue).$el.querySelector('input');

    //     let e: any = document.createEvent('HTMLEvents');
    //     e.initEvent('change', true, true);

    //     if (input) {
    //         input.dispatchEvent(e);
    //     }
    //     Vue.nextTick(() => {
    //         expect(changeSpy).toHaveBeenCalledWith('radio1');
    //     });
    // });
});
