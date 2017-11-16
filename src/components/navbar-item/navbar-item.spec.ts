import Vue from 'vue';
import '../../utils/polyfills';
import NavBarItemPlugin, { MNavBarItem } from './navbar-item';

const SELECTED_CSS: string = 'm--is-selected';

let navbaritem: MNavBarItem;

describe('navbar-item', () => {
    beforeEach(() => {
        Vue.use(NavBarItemPlugin);
        navbaritem = new MNavBarItem().$mount();
    });

    it('selected prop', () => {
        expect(navbaritem.$el.classList.contains(SELECTED_CSS)).toBeFalsy();

        navbaritem.selected = true;
        Vue.nextTick(() => {
            expect(navbaritem.$el.classList.contains(SELECTED_CSS)).toBeTruthy();

            navbaritem.selected = false;
            Vue.nextTick(() => {
                expect(navbaritem.$el.classList.contains(SELECTED_CSS)).toBeFalsy();
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
