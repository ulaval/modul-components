import Vue from 'vue';
import '../../utils/polyfills';
import IconPlugin, { MIcon } from './icon';

let icon: MIcon;

describe('icon', () => {
    beforeEach(() => {
        Vue.use(IconPlugin);
        icon = new MIcon().$mount();
    });

    it('name prop', () => {
        let vm = new Vue({
            template: `
            <div>
                <m-icon ref="a" :name="name" :svgTitle="svgTitle"></m-icon>
            </div>`,
            data: {
                name: 'default',
                svgTitle: 'default'
            }
        }).$mount();
        let use: SVGUseElement | null = (vm.$refs.a as Vue).$el.querySelector('use');
        if (use) {
            expect(use.href['baseVal']).toEqual('#default');
        }

        (vm as any).name = 'options';
        Vue.nextTick(() => {
            if (use) {
                expect(use.href['baseVal']).toEqual('#options');
            }
            (vm as any).name = 'default';
            Vue.nextTick(() => {
                if (use) {
                    expect(use.href['baseVal']).toEqual('#default');
                }
            });
        });
    });

    it('svgTitle prop', () => {
        let vm = new Vue({
            template: `
            <div>
                <m-icon ref="a" :name="name" :svgTitle="svgTitle"></m-icon>
            </div>`,
            data: {
                name: 'default',
                svgTitle: 'default'
            }
        }).$mount();
        let svgTitle: HTMLTitleElement | null = (vm.$refs.a as Vue).$el.querySelector('title');
        if (svgTitle) {
            expect(svgTitle.textContent).toEqual('default');
        }
        (vm as any).svgTitle = 'options';
        Vue.nextTick(() => {
            if (svgTitle) {
                expect(svgTitle.textContent).toEqual('options');
            }
            (vm as any).svgTitle = 'default';
            Vue.nextTick(() => {
                if (svgTitle) {
                    expect(svgTitle.textContent).toEqual('default');
                }
            });
        });
    });

    it('size prop', () => {
        let vm = new Vue({
            template: `
            <div>
                <m-icon ref="a" :name="name" :svgTitle="svgTitle" :size="size"></m-icon>
            </div>`,
            data: {
                name: 'default',
                svgTitle: 'default',
                size: '1em'
            }
        }).$mount();
        let element: HTMLElement | null = (vm.$refs.a as Vue).$el;
        if (element) {
            expect(element.getAttribute('width')).toEqual('1em');
        }
        (vm as any).size = '20px';
        Vue.nextTick(() => {
            if (element) {
                expect(element.getAttribute('width')).toEqual('20px');
            }
            (vm as any).size = '1em';
            Vue.nextTick(() => {
                if (element) {
                    expect(element.getAttribute('width')).toEqual('1em');
                }
            });
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
