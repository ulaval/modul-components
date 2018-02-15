import Vue from 'vue';
import '../../utils/polyfills';
import FlexTemplatePlugin, { MFlexTemplate, MFlexTemplateOrigin } from './flex-template';

const MENU_OPEN_CSS: string = 'm--is-menu-open';
const MENU_RIGHT_CSS: string = 'm--is-menu-right';
const NO_HEADER_CSS: string = 'm--no-header';
const HEADER_FIXE_CSS: string = 'm--is-header-fixe';
const MENU_FIXE_FAKE_CSS: string = 'm--is-menu-fixe-fake';
const MENU_FIXE_CSS: string = 'm--is-menu-fixe';
const MENU_ANIM_CSS: string = 'm--has-menu-anim';
const MENU_SMALL_CSS: string = 'm--is-small-menu';
const EQ_MAX_S_CSS: string = 'm--is-eq-max-s';

let flex: MFlexTemplate;
let flexTemplate: Vue;

describe('MFlexTemplateOrigin', () => {
    it('validates enum', () => {
        expect(MFlexTemplateOrigin.Left).toEqual('left');
        expect(MFlexTemplateOrigin.Right).toEqual('right');
    });
});

describe('flex-template', () => {
    beforeEach(() => {
        Vue.use(FlexTemplatePlugin);
        flex = new MFlexTemplate().$mount();
        flexTemplate = new Vue({
            template: `
                <m-flex-template :headerFixe="headerFixe" :menuFixe="menuFixe" :menuOrigin="menuOrigin" :menuOpen="menuOpen" :smallMenu="smallMenu" :smallMenuWidth="smallMenuWidth" :pageMinHeight="pageMinHeight">
                    <span slot="header" ref="menu">header</span>
                    <span slot="menu">menu</span>
                    body
                    <span slot="footer">footer</span>
                </m-flex-template>`,
            data: {
                headerFixe: true,
                menuFixe: true,
                menuOrigin: MFlexTemplateOrigin.Left,
                menuOpen: false,
                smallMenu : false,
                smallMenuWidth : '44px',
                pageMinHeight : '100vh'
            }
        }).$mount();
    });

    it('css class for flex-template are present', () => {
        expect(flex.$el.classList.contains(NO_HEADER_CSS)).toBeTruthy();
    });

    it('css class for flex-template are not present', () => {
        expect(flex.$el.classList.contains(MENU_OPEN_CSS)).toBeFalsy();
        expect(flex.$el.classList.contains(MENU_RIGHT_CSS)).toBeFalsy();
        expect(flex.$el.classList.contains(HEADER_FIXE_CSS)).toBeFalsy();
        expect(flex.$el.classList.contains(MENU_FIXE_FAKE_CSS)).toBeFalsy();
        expect(flex.$el.classList.contains(MENU_FIXE_CSS)).toBeFalsy();
        expect(flex.$el.classList.contains(MENU_ANIM_CSS)).toBeFalsy();
        expect(flex.$el.classList.contains(MENU_SMALL_CSS)).toBeFalsy();
        expect(flex.$el.classList.contains(EQ_MAX_S_CSS)).toBeFalsy();
    });

    it('headerFixe prop', () => {
        expect(flexTemplate.$el.classList.contains(HEADER_FIXE_CSS)).toBeTruthy();
        (flexTemplate as any).headerFixe = false;
        Vue.nextTick(() => {
            expect(flexTemplate.$el.classList.contains(HEADER_FIXE_CSS)).toBeFalsy();
            (flexTemplate as any).headerFixe = true;
            Vue.nextTick(() => {
                expect(flexTemplate.$el.classList.contains(HEADER_FIXE_CSS)).toBeTruthy();
            });
        });
    });

    it('menuFixe prop', () => {
        expect(flexTemplate.$el.classList.contains(MENU_FIXE_CSS)).toBeTruthy();
        (flexTemplate as any).menuFixe = false;
        Vue.nextTick(() => {
            expect(flexTemplate.$el.classList.contains(MENU_FIXE_CSS)).toBeFalsy();
            (flexTemplate as any).menuFixe = true;
            Vue.nextTick(() => {
                expect(flexTemplate.$el.classList.contains(MENU_FIXE_CSS)).toBeTruthy();
            });
        });
    });

    it('menuOrigin prop', () => {
        expect(flexTemplate.$el.classList.contains(MENU_RIGHT_CSS)).toBeFalsy();
        (flexTemplate as any).menuOrigin = MFlexTemplateOrigin.Right;
        Vue.nextTick(() => {
            expect(flexTemplate.$el.classList.contains(MENU_RIGHT_CSS)).toBeTruthy();
            (flexTemplate as any).menuOrigin = MFlexTemplateOrigin.Left;
            Vue.nextTick(() => {
                expect(flexTemplate.$el.classList.contains(MENU_RIGHT_CSS)).toBeFalsy();
            });
        });
    });

    it('menuOpen prop', () => {
        expect(flexTemplate.$el.classList.contains(MENU_ANIM_CSS)).toBeFalsy();
        expect(flexTemplate.$el.classList.contains(MENU_OPEN_CSS)).toBeFalsy();
        (flexTemplate as any).menuOpen = true;
        Vue.nextTick(() => {
            expect(flexTemplate.$el.classList.contains(MENU_ANIM_CSS)).toBeTruthy();
        });
    });

    it('smallMenu prop', () => {
        expect(flexTemplate.$el.classList.contains(MENU_SMALL_CSS)).toBeFalsy();
        (flexTemplate as any).smallMenu = true;
        Vue.nextTick(() => {
            expect(flexTemplate.$el.classList.contains(MENU_SMALL_CSS)).toBeTruthy();
            (flexTemplate as any).smallMenu = false;
            Vue.nextTick(() => {
                expect(flexTemplate.$el.classList.contains(MENU_SMALL_CSS)).toBeFalsy();
            });
        });
    });

});
