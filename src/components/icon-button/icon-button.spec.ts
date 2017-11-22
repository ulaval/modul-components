import Vue from 'vue';
import '../../utils/polyfills';
import IconButtonPlugin, { MIconButton, MIconButtonSkin } from './icon-button';
import { MIcon } from '../icon/icon';
import SpritesHelper from '../../../tests/helpers/sprites';

export const ICON_BUTTON_CLASS: string = '.m-icon-button';

describe('MButtonSkin', () => {
    it('validates enum', () => {
        expect(MIconButtonSkin.Light).toEqual('light');
        expect(MIconButtonSkin.Dark).toEqual('dark');
        expect(MIconButtonSkin.Primary).toEqual('primary');
        expect(MIconButtonSkin.Secondary).toEqual('secondary');
    });
});

describe('icon-button', () => {
    const SKIN_LIGHT_CSS: string = 'm--is-skin-light';
    const SKIN_DARK_CSS: string = 'm--is-skin-dark';
    const SKIN_PRIMARY_CSS: string = 'm--is-skin-primary';
    const SKIN_SECONDARY_CSS: string = 'm--is-skin-secondary';
    const STATE_DISABLED_CSS: string = 'm--is-disabled';

    let iconButton: MIconButton;

    beforeEach(() => {
        spyOn(console, 'error');

        Vue.use(IconButtonPlugin);
        Vue.use(SpritesHelper);
    });

    afterEach(() => {
        Vue.nextTick(() => {
            expect(console.error).not.toHaveBeenCalled();
        });
    });

    it('css class for icon-button are present', () => {
        iconButton = new MIconButton().$mount();
        expect(iconButton.$el.classList.contains(SKIN_LIGHT_CSS)).toBeTruthy();
    });

    it('css class for icon-button are not present', () => {
        iconButton = new MIconButton().$mount();
        expect(iconButton.$el.classList.contains(SKIN_DARK_CSS)).toBeFalsy();
        expect(iconButton.$el.classList.contains(SKIN_PRIMARY_CSS)).toBeFalsy();
        expect(iconButton.$el.classList.contains(SKIN_SECONDARY_CSS)).toBeFalsy();
        expect(iconButton.$el.classList.contains(STATE_DISABLED_CSS)).toBeFalsy();
    });

    describe('skin prop', () => {
        beforeEach(() => {
            iconButton = new MIconButton().$mount();
        });

        it('light', () => {
            iconButton.skin = MIconButtonSkin.Light;
            Vue.nextTick(() => {
                expect(iconButton.$el.classList.contains(SKIN_LIGHT_CSS)).toBeTruthy();
                expect(iconButton.$el.classList.contains(SKIN_DARK_CSS)).toBeFalsy();
                expect(iconButton.$el.classList.contains(SKIN_PRIMARY_CSS)).toBeFalsy();
                expect(iconButton.$el.classList.contains(SKIN_SECONDARY_CSS)).toBeFalsy();
            });
        });

        it('dark', () => {
            iconButton.skin = MIconButtonSkin.Dark;
            Vue.nextTick(() => {
                expect(iconButton.$el.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();
                expect(iconButton.$el.classList.contains(SKIN_DARK_CSS)).toBeTruthy();
                expect(iconButton.$el.classList.contains(SKIN_PRIMARY_CSS)).toBeFalsy();
                expect(iconButton.$el.classList.contains(SKIN_SECONDARY_CSS)).toBeFalsy();
            });
        });

        it('primary', () => {
            iconButton.skin = MIconButtonSkin.Primary;
            Vue.nextTick(() => {
                expect(iconButton.$el.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();
                expect(iconButton.$el.classList.contains(SKIN_DARK_CSS)).toBeFalsy();
                expect(iconButton.$el.classList.contains(SKIN_PRIMARY_CSS)).toBeTruthy();
                expect(iconButton.$el.classList.contains(SKIN_SECONDARY_CSS)).toBeFalsy();
            });
        });

        it('secondary', () => {
            iconButton.skin = MIconButtonSkin.Secondary;
            Vue.nextTick(() => {
                expect(iconButton.$el.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();
                expect(iconButton.$el.classList.contains(SKIN_DARK_CSS)).toBeFalsy();
                expect(iconButton.$el.classList.contains(SKIN_PRIMARY_CSS)).toBeFalsy();
                expect(iconButton.$el.classList.contains(SKIN_SECONDARY_CSS)).toBeTruthy();
            });
        });
    });

    it('button-size prop', () => {
        iconButton = new MIconButton().$mount();
        expect(iconButton.$el.style.width).toEqual('44px');
        expect(iconButton.$el.style.height).toEqual('44px');

        iconButton.buttonSize = '58px';
        Vue.nextTick(() => {
            expect(iconButton.$el.style.width).toEqual('58px');
            expect(iconButton.$el.style.height).toEqual('58px');
        });
    });

    it('icon-name prop', () => {
        iconButton = new MIconButton().$mount();
        let element: Vue = (iconButton.$refs.icon as Vue);
        expect((element as MIcon).name).toEqual('default');

        iconButton.iconName = 'clock';
        Vue.nextTick(() => {
            expect((element as MIcon).name).toEqual('clock');
        });
    });

    it('icon-size prop', () => {
        iconButton = new MIconButton().$mount();
        expect(iconButton.$el.style.fontSize).toEqual('16px');

        iconButton.iconSize = '20px';
        Vue.nextTick(() => {
            expect(iconButton.$el.style.fontSize).toEqual('20px');
        });
    });

    it('click event', () => {
        let clickSpy = jasmine.createSpy('clickSpy');
        let vm = new Vue({
            template: `<m-icon-button @click="onClick"></m-icon-button>`,
            methods: {
                onClick: clickSpy
            }
        }).$mount();

        let e: any = document.createEvent('HTMLEvents');
        e.initEvent('click', true, true);

        vm.$el.dispatchEvent(e);

        Vue.nextTick(() => {
            expect(clickSpy).toHaveBeenCalledWith(e);
        });
    });
});
