import Vue from 'vue';
import '../../utils/polyfills';
import NavbarPlugin, { MNavbar, MNavbarSkin } from './navbar';

const SKIN_REGULAR_CSS: string = 'm--is-skin-regular';
const SKIN_LIGHT_CSS: string = 'm--is-skin-light';
const SKIN_DARK_CSS: string = 'm--is-skin-dark';
const SKIN_PLAIN_CSS: string = 'm--is-skin-plain';
const SKIN_ARROW_CSS: string = 'm--is-skin-arrow';
const ACTIVE_CSS: string = 'm--is-anim-active';

let navbar: MNavbar;

describe('MNavbarSkin', () => {
    it('validates enum', () => {
        expect(MNavbarSkin.Regular).toEqual('regular');
        expect(MNavbarSkin.Light).toEqual('light');
        expect(MNavbarSkin.Dark).toEqual('dark');
        expect(MNavbarSkin.Plain).toEqual('plain');
        expect(MNavbarSkin.Arrow).toEqual('arrow');
    });
});

describe('navbar', () => {
    beforeEach(() => {
        Vue.use(NavbarPlugin);
        navbar = new MNavbar().$mount();
    });

    it('css class for navbar are present', () => {
        expect(navbar.$el.classList.contains(SKIN_DARK_CSS)).toBeTruthy();
        expect(navbar.$el.classList.contains(SKIN_REGULAR_CSS)).toBeTruthy();
    });

    it('css class for navbar are not present', () => {
        expect(navbar.$el.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();
        expect(navbar.$el.classList.contains(SKIN_PLAIN_CSS)).toBeFalsy();
        expect(navbar.$el.classList.contains(SKIN_ARROW_CSS)).toBeFalsy();
    });

    it('skin prop', () => {
        expect(navbar.$el.classList.contains(SKIN_DARK_CSS)).toBeTruthy();
        expect(navbar.$el.classList.contains(SKIN_REGULAR_CSS)).toBeTruthy();
        expect(navbar.$el.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();
        expect(navbar.$el.classList.contains(SKIN_PLAIN_CSS)).toBeFalsy();
        expect(navbar.$el.classList.contains(SKIN_ARROW_CSS)).toBeFalsy();

        navbar.skin = MNavbarSkin.Regular;
        Vue.nextTick(() => {
            expect(navbar.$el.classList.contains(SKIN_REGULAR_CSS)).toBeTruthy();
            expect(navbar.$el.classList.contains(SKIN_DARK_CSS)).toBeFalsy();

            navbar.skin = MNavbarSkin.Light;
            Vue.nextTick(() => {
                expect(navbar.$el.classList.contains(SKIN_LIGHT_CSS)).toBeTruthy();
                expect(navbar.$el.classList.contains(SKIN_REGULAR_CSS)).toBeFalsy();

                navbar.skin = MNavbarSkin.Plain;
                Vue.nextTick(() => {
                    expect(navbar.$el.classList.contains(SKIN_PLAIN_CSS)).toBeTruthy();
                    expect(navbar.$el.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();

                    navbar.skin = MNavbarSkin.Arrow;
                    Vue.nextTick(() => {
                        expect(navbar.$el.classList.contains(SKIN_ARROW_CSS)).toBeTruthy();
                        expect(navbar.$el.classList.contains(SKIN_PLAIN_CSS)).toBeFalsy();
                    });
                });
            });
        });
    });

    it('line prop', () => {
        navbar.skin = MNavbarSkin.Light;
        expect(navbar.$el.querySelector('.m-navbar__line')).toBeFalsy();
        Vue.nextTick(() => {
            expect(navbar.$el.querySelector('.m-navbar__line')).toBeTruthy();
            navbar.line = false;
            Vue.nextTick(() => {
                expect(navbar.$el.querySelector('.m-navbar__line')).toBeFalsy();
                Vue.nextTick(() => {
                    navbar.skin = MNavbarSkin.Arrow;
                    navbar.line = true;
                    expect(navbar.$el.querySelector('.m-navbar__arrow')).toBeFalsy();
                    Vue.nextTick(() => {
                        expect(navbar.$el.querySelector('.m-navbar__arrow')).toBeTruthy();
                        navbar.line = false;
                        Vue.nextTick(() => {
                            expect(navbar.$el.querySelector('.m-navbar__arrow')).toBeFalsy();
                        });
                    });
                });
            });
        });
    });

    // Todo: Need to be finish
    // it('click event', () => {
    //     let clickSpy = jasmine.createSpy('clickSpy');
    //     let vm = new Vue({
    //         template: `
    //             <m-navbar @click="onClick($event)"></m-navbar>
    //         `,
    //         methods: {
    //             onClick: clickSpy
    //         }
    //     }).$mount();

    //     let element = vm.$el.querySelector('.m-navbar-item');
    //     Vue.prototype.$log.log(vm.$el);

    //     if (element) {
    //         (element as any).click();
    //     }

    //     Vue.nextTick(() => {
    //         expect(clickSpy).toHaveBeenCalled();
    //     });
    // });

});
