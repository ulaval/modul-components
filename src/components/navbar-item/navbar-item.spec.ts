import Vue from 'vue';
import '../../utils/polyfills';
import NavBarItemPlugin, { MNavbarItem } from './navbar-item';

const DISABLED_CSS: string = 'm--is-disabled';

let navbaritem: MNavbarItem;

describe('navbar-item', () => {
    beforeEach(() => {
        Vue.use(NavBarItemPlugin);
        navbaritem = new MNavbarItem().$mount();
    });

    it('disabled prop', () => {
        expect(navbaritem.$el.classList.contains(DISABLED_CSS)).toBeFalsy();

        navbaritem.disabled = true;
        Vue.nextTick(() => {
            expect(navbaritem.$el.classList.contains(DISABLED_CSS)).toBeTruthy();

            navbaritem.disabled = false;
            Vue.nextTick(() => {
                expect(navbaritem.$el.classList.contains(DISABLED_CSS)).toBeFalsy();
            });
        });
    });

    it('click event', () => {
        let clickSpy = jasmine.createSpy('clickSpy');
        let vm = new Vue({
            template: `
                <m-navbar-item @click="onClick($event)"></m-navbar-item>
            `,
            methods: {
                onClick: clickSpy
            }
        }).$mount();

        let element = vm.$el;

        if (element) {
            (element as any).click();
        }

        Vue.nextTick(() => {
            expect(clickSpy).toHaveBeenCalled();
        });
    });

});
