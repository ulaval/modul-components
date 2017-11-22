import Vue from 'vue';
import '../../utils/polyfills';
import IconPlugin, { MIcon } from './icon';
import SpritesHelper from '../../../tests/helpers/sprites';

export const ICON_CLASS: string = '.m-icon';

export function validateIconSize(el: Element, value: string): void {
    expect(el.getAttribute('width')).toEqual(value);
    expect(el.getAttribute('height')).toEqual(value);
}

export function validateIconSvg(el: Element, icon: string): void {
    let use: SVGUseElement | null = el.querySelector('use');
    expect(use).toBeTruthy();

    if (use) {
        expect(use.href.baseVal).toEqual('#' + icon);
    }
}

describe('icon', () => {
    const ICON_DEFAULT: string = 'default';
    const ICON_OPTIONS: string = 'options';

    let icon: MIcon;

    beforeEach(() => {
        spyOn(console, 'error');

        Vue.use(IconPlugin);
        Vue.use(SpritesHelper);
        icon = new MIcon().$mount();
    });

    afterEach(() => {
        Vue.nextTick(() => {
            expect(console.error).not.toHaveBeenCalled();
        });
    });

    it('name prop', () => {
        validateIconSvg(icon.$el, ICON_DEFAULT);

        icon.name = ICON_OPTIONS;
        Vue.nextTick(() => {
            validateIconSvg(icon.$el, ICON_OPTIONS);
            icon.name = 'default';
            Vue.nextTick(() => {
                validateIconSvg(icon.$el, ICON_DEFAULT);
            });
        });
    });

    it('svgTitle prop', () => {
        let svgTitle: HTMLTitleElement | null = icon.$el.querySelector('title');
        expect(svgTitle).toBeFalsy();

        icon.svgTitle = 'options';
        Vue.nextTick(() => {
            if (svgTitle) {
                expect(svgTitle.textContent).toEqual('options');
            }
        });
    });

    it('size prop', () => {
        validateIconSize(icon.$el, '1em');
        icon.size = '20px';
        Vue.nextTick(() => {
            validateIconSize(icon.$el, '20px');
        });
    });

    it('click event', () => {
        let clickSpy = jasmine.createSpy('clickSpy');
        let vm = new Vue({
            template: `<m-icon @click="onClick"></m-icon>`,
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
