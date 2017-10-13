import Vue from 'vue';
import '../../utils/polyfills';
import DropdownPlugin, { MDropdown } from './dropdown';

const DISABLED_CSS: string = 'm--is-disabled';
const WAITING_CSS: string = 'm--is-waiting';
const SELECTED_CSS: string = 'm--is-selected';
const INACTIF_CSS: string = 'm--is-inactif';

let dropdown: MDropdown;

describe('dropdown', () => {
    beforeEach(() => {
        Vue.use(DropdownPlugin);
        dropdown = new MDropdown().$mount();
        spyOn(dropdown, 'toggleDropdown');
    });

    it('css class for dropdown are not present', () => {
        expect(dropdown.$el.classList.contains(DISABLED_CSS)).toBeFalsy();
        expect(dropdown.$el.classList.contains(WAITING_CSS)).toBeFalsy();
    });

    it('enabled prop editable', () => {
        let vm = new Vue({
            data: {
                editable: false
            },
            template: `
            <m-dropdown class="dd" :editable="editable">
                <m-dropdown-item value="item A" label="*item A*"></m-dropdown-item>
                <m-dropdown-item value="item B" label="*item B*"></m-dropdown-item>
            </m-dropdown>`
        }).$mount();

        expect(vm.$el.querySelector('input.m-text-field__input')).toBeNull();

        (vm as any).editable = true;

        Vue.nextTick(() => {
            expect(vm.$el.querySelector('input.m-text-field__input')).not.toBeNull();
        });
    });

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

    it('v-model change', () => {
        let vm = new Vue({
            data: {
                model: 'item B'
            },
            template: `
            <m-dropdown>
                <m-dropdown-item ref="a" class="a" value="item A" label="*item A*"></m-dropdown-item>
                <m-dropdown-item ref="b" class="b" value="item B" label="*item B*"></m-dropdown-item>
            </m-dropdown>`
        }).$mount();

        let li1 = vm.$el.querySelector('.a');
        let li2 = vm.$el.querySelector('.b');

        if (li1 && li2) {
            expect(li1.classList.contains(SELECTED_CSS)).toBeFalsy();
            expect(li2.classList.contains(SELECTED_CSS)).toBeTruthy();
        }

        (vm as any).model = 'Item A';

        Vue.nextTick(() => {
            if (li1 && li2) {
                expect(li1.classList.contains(SELECTED_CSS)).toBeTruthy();
                expect(li1.classList.contains(SELECTED_CSS)).toBeFalsy();
            }
        });

    });

    // it('toggle dropdown/ Emit Open and Close', () => {
    //     let clickSpyOpen = jasmine.createSpy('clickSpyOpen');
    //     let clickSpyClose = jasmine.createSpy('clickSpyClose');

    //     let vm = new Vue({
    //         template: `
    //             <m-dropdown @open="onOpen" @close="onClose" :editable="true">
    //                 <m-dropdown-item value="item A" label="*item A*"></m-dropdown-item>
    //                 <m-dropdown-item value="item B" label="*item B*"></m-dropdown-item>
    //             </m-dropdown>
    //         `,
    //         methods: {
    //             onOpen: clickSpyOpen,
    //             onClose: clickSpyClose
    //         }
    //     }).$mount();

    //     let input = vm.$el.querySelector('.m-text-field__input-container');

    //     if (input) {
    //         // dropdown.toggleDropdown(true);
    //         (input as HTMLElement).click();
    //     }

    //     Vue.nextTick(() => {
    //         expect(clickSpyOpen.calls.any()).toEqual(true);
    //         // expect(dropdown.toggleDropdown.calls.count()).toEqual(1);
    //         // expect(clickSpyOpen).toHaveBeenCalled();

    //         if (input) {
    //             (input as HTMLElement).click();
    //         }

    //         Vue.nextTick(() => {
    //             expect(clickSpyClose.calls.any()).toEqual(true);
    //             // expect(dropdown.toggleDropdown.calls.count()).toEqual(2);
    //             // expect(clickSpyClose).toHaveBeenCalled();
    //         });
    //     });

    // });

    // En attente d'un changement pour Portal
    // it('0 items', () => {
    //     let vm = new Vue({
    //         template: `<m-dropdown ref="dd"></m-dropdown>`
    //     }).$mount();

    //     let items = (vm.$refs.dd as Vue).$el.querySelectorAll('.m-dropdown__list li');
    //     expect(items.length == 1).toBeTruthy();

    //     if (items[1]) {
    //         expect(items[1].classList.contains(INACTIF_CSS)).toBeTruthy();
    //     }
    // });

    // En attente d'un changement pour Portal
    // it('Filtering', () => {
    //     let vm = new Vue({
    //         template: `
    //             <m-dropdown ref="dd" :editable="true">
    //                 <m-dropdown-item value="item A" label="*item A*"></m-dropdown-item>
    //                 <m-dropdown-item value="item B" label="*item B*"></m-dropdown-item>
    //                 <m-dropdown-item value="item C" label="*item C*"></m-dropdown-item>
    //                 <m-dropdown-item value="item A2" label="*item A2*"></m-dropdown-item>
    //             </m-dropdown>`
    //     }).$mount();

    //     let input: Element | null = vm.$el.querySelector('.m-text-field__input');

    //     // let eKeyboard = new KeyboardEvent('keypress', {code: '65'});

    //     // let e: any = document.createEvent('HTMLEvents');
    //     // e.initEvent('change', true, true);

    //     // if (input) {
    //     //     input.dispatchEvent(eKeyboard);
    //     //     input.dispatchEvent(e);
    //     // }
    //     //     eKeyboard.initKeyEvent()

    //     if (input) {
    //         // (vm as MDropdown).filterDropdown('A');
    //         (input as HTMLInputElement).value = 'A';
    //         let evt = document.createEvent('HTMLEvents');
    //         evt.initEvent('change', false, true);
    //         input.dispatchEvent(evt);
    //     }
    //     let items;

    //     Vue.nextTick(() => {
    //         items = (vm.$refs.dd as Vue).$el.querySelectorAll('.m-dropdown__list li');
    //         console.log('*1*', items.length);
    //         expect(items.length == 2).toBeTruthy();

    //         if (input) {
    //             // (vm as MDropdown).filterDropdown('c');
    //             (input as HTMLInputElement).value = 'c';
    //         }

    //         items = (vm.$refs.dd as Vue).$el.querySelectorAll('.m-dropdown__list li');
    //         console.log('*2*', items);
    //         expect(items.length == 1).toBeTruthy();

    //         if (input) {
    //             // (vm as MDropdown).filterDropdown('E');
    //             (input as HTMLInputElement).value = 'E';
    //         }

    //         items = (vm.$refs.dd as Vue).$el.querySelectorAll('.m-dropdown__list li');
    //         console.log('*3*', items);
    //         expect(items.length == 1).toBeTruthy();
    //         expect(items[1].classList.contains(INACTIF_CSS)).toBeTruthy();

    //         if (input) {
    //             // (vm as MDropdown).filterDropdown('');
    //             (input as HTMLInputElement).value = '';
    //         }

    //         items = (vm.$refs.dd as Vue).$el.querySelectorAll('.m-dropdown__list li');
    //         expect(items.length == 4).toBeTruthy();
    //     });
    // });

    // En attente d'un changement pour Portal
    // it('emit change/Item selected', () => {
    //     let clickSpy = jasmine.createSpy('clickSpy');

    //     let vm = new Vue({
    //         template: `
    //             <m-dropdown ref="dd" @change="onChange">
    //                 <m-dropdown-item ref="a" value="item A" label="*item A*"></m-dropdown-item>
    //                 <m-dropdown-item ref="b" value="item B" label="*item B*"></m-dropdown-item>
    //                 <m-dropdown-item ref="c" value="item C" label="*item C*"></m-dropdown-item>
    //                 <m-dropdown-item ref="d" value="item D" label="*item D*"></m-dropdown-item>
    //             </m-dropdown>`,
    //         methods: {
    //             onChange: clickSpy
    //         }
    //     }).$mount();

    //     let item: Vue = vm.$refs.c as Vue;
    //     item.$el.click();
    //     expect(clickSpy).toHaveBeenCalled();
    // });
});
