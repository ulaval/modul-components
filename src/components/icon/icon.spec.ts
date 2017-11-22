import Vue from 'vue';
import '../../utils/polyfills';
import IconPlugin, { MIcon } from './icon';
import SpritesHelper from '../../../tests/helpers/sprites';

const ICON_DEFAULT: string = 'default';
const ICON_OPTIONS: string = 'options';

let icon: MIcon;

describe('icon', () => {
    beforeEach(() => {
        Vue.use(IconPlugin);
        Vue.use(SpritesHelper);
        icon = new MIcon().$mount();
    });

    it('name prop', () => {
        let use: SVGUseElement | null = icon.$el.querySelector('use');
        expect(use).toBeTruthy();

        if (use) {
            expect(use.href['baseVal']).toEqual('#' + ICON_DEFAULT);
        }

        icon.name = ICON_OPTIONS;
        Vue.nextTick(() => {
            if (use) {
                expect(use.href['baseVal']).toEqual('#' + ICON_OPTIONS);
            }
            icon.name = 'default';
            Vue.nextTick(() => {
                if (use) {
                    expect(use.href['baseVal']).toEqual('#' + ICON_DEFAULT);
                }
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
        expect(icon.$el.getAttribute('width')).toEqual('1em');
        icon.size = '20px';
        Vue.nextTick(() => {
            expect(icon.$el.getAttribute('width')).toEqual('20px');
        });
    });

    it('click event', () => {
        let clickSpy = jasmine.createSpy('clickSpy');
        let vm = new Vue({
            template: `
            <div>
                <m-icon ref="a" @click="onClick"></m-icon>
            </div>`,
            methods: {
                onClick: clickSpy
            }
        }).$mount();

        let element: HTMLElement = (vm.$refs.a as Vue).$el as HTMLElement;

        let e: any = document.createEvent('HTMLEvents');
        e.initEvent('click', true, true);

        element.dispatchEvent(e);

        Vue.nextTick(() => {
            expect(clickSpy).toHaveBeenCalledWith(e);
        });
    });

});
