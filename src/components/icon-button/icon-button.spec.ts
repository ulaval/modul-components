import Vue from 'vue';
import '../../utils/polyfills';
import IconButtonPlugin, { MIconButton, MIconButtonSkin } from './icon-button';

const SKIN_LIGHT_CSS: string = 'm--is-skin-light';
const SKIN_DARK_CSS: string = 'm--is-skin-dark';
const SKIN_PRIMARY_CSS: string = 'm--is-skin-primary';
const SKIN_SECONDARY_CSS: string = 'm--is-skin-secondary';
const STATE_DISABLED_CSS: string = 'm--is-disabled';

let iconButton: MIconButton;

describe('MButtonSkin', () => {
    it('validates enum', () => {
        expect(MIconButtonSkin.Light).toEqual('light');
        expect(MIconButtonSkin.Dark).toEqual('dark');
        expect(MIconButtonSkin.Primary).toEqual('primary');
        expect(MIconButtonSkin.Secondary).toEqual('secondary');
    });
});

describe('icon-button', () => {
    beforeEach(() => {
        Vue.use(IconButtonPlugin);
        iconButton = new MIconButton().$mount();
    });

    it('css class for icon-button are present', () => {
        expect(iconButton.$el.classList.contains(SKIN_LIGHT_CSS)).toBeTruthy();
    });

    it('css class for icon-button are not present', () => {
        expect(iconButton.$el.classList.contains(SKIN_DARK_CSS)).toBeFalsy();
        expect(iconButton.$el.classList.contains(SKIN_PRIMARY_CSS)).toBeFalsy();
        expect(iconButton.$el.classList.contains(SKIN_SECONDARY_CSS)).toBeFalsy();
        expect(iconButton.$el.classList.contains(STATE_DISABLED_CSS)).toBeFalsy();
    });

    it('skin prop', () => {
        expect(iconButton.$el.classList.contains(SKIN_LIGHT_CSS)).toBeTruthy();
        expect(iconButton.$el.classList.contains(SKIN_DARK_CSS)).toBeFalsy();
        expect(iconButton.$el.classList.contains(SKIN_PRIMARY_CSS)).toBeFalsy();
        expect(iconButton.$el.classList.contains(SKIN_SECONDARY_CSS)).toBeFalsy();

        iconButton.skin = MIconButtonSkin.Dark;
        Vue.nextTick(() => {
            expect(iconButton.$el.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();
            expect(iconButton.$el.classList.contains(SKIN_DARK_CSS)).toBeTruthy();
            expect(iconButton.$el.classList.contains(SKIN_PRIMARY_CSS)).toBeFalsy();
            expect(iconButton.$el.classList.contains(SKIN_SECONDARY_CSS)).toBeFalsy();

            iconButton.skin = MIconButtonSkin.Primary;
            Vue.nextTick(() => {
                expect(iconButton.$el.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();
                expect(iconButton.$el.classList.contains(SKIN_DARK_CSS)).toBeFalsy();
                expect(iconButton.$el.classList.contains(SKIN_PRIMARY_CSS)).toBeTruthy();
                expect(iconButton.$el.classList.contains(SKIN_SECONDARY_CSS)).toBeFalsy();

                iconButton.skin = MIconButtonSkin.Secondary;
                Vue.nextTick(() => {
                    expect(iconButton.$el.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();
                    expect(iconButton.$el.classList.contains(SKIN_DARK_CSS)).toBeFalsy();
                    expect(iconButton.$el.classList.contains(SKIN_PRIMARY_CSS)).toBeFalsy();
                    expect(iconButton.$el.classList.contains(SKIN_SECONDARY_CSS)).toBeTruthy();
                });
            });
        });
    });

    it('buttonSize prop default value', () => {
        expect(iconButton.$el.clientWidth).toEqual(44);

        iconButton.buttonSize = '58px';
        Vue.nextTick(() => {
            expect(iconButton.$el.clientWidth).toEqual(58);

            iconButton.buttonSize = '64px';
            Vue.nextTick(() => {
                expect(iconButton.$el.clientWidth).toEqual(64);
            });
        });
    });

    it('icon-name prop default value', () => {
        expect(iconButton.iconName).toEqual('default');
    });

    it('icon-size prop', () => {
        expect(iconButton.iconSize).toEqual('16px');

        iconButton.iconSize = '20px';
        Vue.nextTick(() => {
            expect(iconButton.iconSize).toEqual('20px');

            iconButton.iconSize = '30px';
            Vue.nextTick(() => {
                expect(iconButton.iconSize).toEqual('30px');
            });
        });
    });

    it('click event', () => {
        let clickSpy = jasmine.createSpy('clickSpy');
        let vm = new Vue({
            data: {
            },
            template: `
            <div>
                <m-icon-button ref="a" @click="onClick"></m-icon-button>
            </div>`,
            methods: {
                onClick: clickSpy
            }
        }).$mount();

        let element: HTMLElement | null = (vm.$refs.a as Vue).$el;

        let e: any = document.createEvent('HTMLEvents');
        e.initEvent('click', true, true);

        if (element) {
            element.dispatchEvent(e);
        }
        Vue.nextTick(() => {
            expect(clickSpy).toHaveBeenCalledWith(e);
        });
    });

});
