import Vue from 'vue';
import '../../utils/polyfills';
import MenuPlugin, { MOptionsMenu } from './options-menu';

const DISABLED_CSS: string = 'm--is-disabled';

let menu: MOptionsMenu;

describe('optionsMenu', () => {
    beforeEach(() => {
        Vue.use(MenuPlugin);
        menu = new MOptionsMenu().$mount();
    });

    it('disabled prop', () => {
        let button = menu.$el.querySelector('button');
        if (button) {
            expect(button.classList.contains(DISABLED_CSS)).toBeFalsy();
        }
        menu.disabled = true;
        Vue.nextTick(() => {
            if (button) {
                expect(button.classList.contains(DISABLED_CSS)).toBeTruthy();
            }
            menu.disabled = false;
            Vue.nextTick(() => {
                if (button) {
                    expect(button.classList.contains(DISABLED_CSS)).toBeFalsy();
                }
            });
        });
    });

    // Todo: This test needs to be fixed
    // it('open event', () => {
    //     let clickSpy = jasmine.createSpy('clickSpy');
    //     let vm = new Vue({
    //         data: {
    //         },
    //         template: `
    //         <div>
    //             <m-options-menu ref="a" @open="onClick"></m-options-menu>
    //         </div>`,
    //         methods: {
    //             onClick: clickSpy
    //         }
    //     }).$mount();

    //     let element: HTMLElement | null = (vm.$refs.a as Vue).$el;

    //     let e: any = document.createEvent('HTMLEvents');
    //     e.initEvent('click', true, true);

    //     if (element) {
    //         element.dispatchEvent(e);
    //     }
    //     Vue.nextTick(() => {
    //         expect(clickSpy).toHaveBeenCalledWith(e);
    //     });
    // });

});
