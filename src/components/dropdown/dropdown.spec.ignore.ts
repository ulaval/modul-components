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
    });

    it('css class for dropdown are not present', () => {
        expect(dropdown.$el.classList.contains(DISABLED_CSS)).toBeFalsy();
        expect(dropdown.$el.classList.contains(WAITING_CSS)).toBeFalsy();
    });

    it('enabled prop filterable', () => {
        let vm: Vue = new Vue({
            data: {
                filterable: false
            },
            template: `
            <m-dropdown class="dd" :filterable="filterable">
                <m-dropdown-item value="item A" label="*item A*"></m-dropdown-item>
                <m-dropdown-item value="item B" label="*item B*"></m-dropdown-item>
            </m-dropdown>`
        }).$mount();

        let input: any = vm.$el.querySelector('.m-textfield__input');

        expect((input as HTMLElement).attributes.getNamedItem('readonly')).toBeTruthy();

        (vm as any).filterable = true;

        Vue.nextTick(() => {
            expect((input as HTMLElement).attributes.getNamedItem('readonly')).toBeFalsy();
        });
    });

    it('has input to focus', () => {
        let input: any = (((dropdown.$refs as any).mDropdownTextField as Vue).$el.querySelector('input') as HTMLElement);
        expect(input).not.toBeNull();
    });

    it('v-model change', () => {
        let vm: Vue = new Vue({
            data: {
                model: 'item B'
            },
            template: `
            <m-dropdown>
                <m-dropdown-item ref="a" class="a" value="item A" label="*item A*"></m-dropdown-item>
                <m-dropdown-item ref="b" class="b" value="item B" label="*item B*"></m-dropdown-item>
            </m-dropdown>`
        }).$mount();

        let li1: Element | null = vm.$el.querySelector('.a');
        let li2: Element | null = vm.$el.querySelector('.b');

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

    it('toggle dropdown / Emit Open and Close', () => {
        let clickSpyOpen: jasmine.Spy = jasmine.createSpy('clickSpyOpen');
        let clickSpyClose: jasmine.Spy = jasmine.createSpy('clickSpyClose');

        let vm: Vue = new Vue({
            template: `
                <m-dropdown ref="dd" @open="onOpen" @close="onClose">
                    <m-dropdown-item value="item A" label="*item A*"></m-dropdown-item>
                    <m-dropdown-item value="item B" label="*item B*"></m-dropdown-item>
                </m-dropdown>`,
            methods: {
                onOpen: clickSpyOpen,
                onClose: clickSpyClose
            }
        }).$mount();

        let dd: any = vm.$refs.dd;

        (dd as MDropdown).open = true;

        Vue.nextTick(() => {
            expect(clickSpyOpen).toHaveBeenCalled();

            (dd as MDropdown).open = false;
            Vue.nextTick(() => {
                expect(clickSpyClose).toHaveBeenCalled();
            });
        });
    });

    it('change event - called once', () => {
        Vue.prototype.$log.log('TODO');
    });

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

    //     let input: Element | null = vm.$el.querySelector('.m-textfield__input');

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
    //         Vue.prototype.log('*1*', items.length);
    //         expect(items.length == 2).toBeTruthy();

    //         if (input) {
    //             // (vm as MDropdown).filterDropdown('c');
    //             (input as HTMLInputElement).value = 'c';
    //         }

    //         items = (vm.$refs.dd as Vue).$el.querySelectorAll('.m-dropdown__list li');
    //         Vue.prototype.log('*2*', items);
    //         expect(items.length == 1).toBeTruthy();

    //         if (input) {
    //             // (vm as MDropdown).filterDropdown('E');
    //             (input as HTMLInputElement).value = 'E';
    //         }

    //         items = (vm.$refs.dd as Vue).$el.querySelectorAll('.m-dropdown__list li');
    //         Vue.prototype.log('*3*', items);
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
