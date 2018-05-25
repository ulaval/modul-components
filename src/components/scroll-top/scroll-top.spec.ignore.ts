import '../../utils/polyfills';

import Vue from 'vue';

import ScrollTopPlugin, { MScrollTop, MScrollTopPosition } from './scroll-top';

const RELATIVE_CSS: string = 'm--is-relative';

let scrollTop: MScrollTop;

describe('MScrollTopPosition', () => {
    it('validates enum', () => {
        expect(MScrollTopPosition.Fixe).toEqual('fixe');
        expect(MScrollTopPosition.Relative).toEqual('relative');
    });
});

describe('scroll-top', () => {
    beforeEach(() => {
        Vue.use(ScrollTopPlugin);
        scrollTop = new MScrollTop().$mount();
    });

    it('css class for scroll-top are not present', () => {
        expect(scrollTop.$el.classList.contains(RELATIVE_CSS)).toBeFalsy();
    });

    it('position prop', () => {
        expect(scrollTop.$el.classList.contains(RELATIVE_CSS)).toBeFalsy();

        scrollTop.position = MScrollTopPosition.Relative;
        Vue.nextTick(() => {
            expect(scrollTop.$el.classList.contains(RELATIVE_CSS)).toBeTruthy();

            scrollTop.position = MScrollTopPosition.Fixe;
            Vue.nextTick(() => {
                expect(scrollTop.$el.classList.contains(RELATIVE_CSS)).toBeFalsy();
            });
        });
    });

    it('click event', () => {
        let clickSpy: jasmine.Spy = jasmine.createSpy('clickSpy');
        let vm: Vue = new Vue({
            data: {
                internalPosition: MScrollTopPosition.Relative
            },
            template: `
            <div>
                <m-scroll-top ref="a" @click="onClick" :position="internalPosition"></m-scroll-top>
            </div>`,
            methods: {
                onClick: clickSpy
            }
        }).$mount();

        let button: Element | null = (vm.$refs.a as Vue).$el;

        // ----------
        // Needs to be completed, portal problem
        // ----------
    });

});
