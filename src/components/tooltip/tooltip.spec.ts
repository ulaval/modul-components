import Vue from 'vue';
import '../../utils/polyfills';
import TooltipPlugin, { MTooltip, MTooltipMode } from './tooltip';

const MODE_ICON_CSS: string = 'm--is-mode-icon';
const MODE_LINK_CSS: string = 'm--is-mode-link';
const OPEN_CSS: string = 'm--is-open';

let tooltip: MTooltip;

describe('MTooltipMode', () => {
    it('validates enum', () => {
        expect(MTooltipMode.Link).toEqual('link');
        expect(MTooltipMode.Icon).toEqual('icon');
    });
});

describe('tooltip', () => {
    beforeEach(() => {
        Vue.use(TooltipPlugin);
        tooltip = new MTooltip().$mount();
    });

    it('css class for tooltip are not present', () => {
        expect(tooltip.$el.classList.contains(MODE_LINK_CSS)).toBeFalsy();
    });

    it('open prop', () => {
        let vm = new Vue({
            template: `
            <div>
                <m-tooltip ref="a" :open="isOpen">Lorem<span slot="body">Lorem</span></m-tooltip>
            </div>`,
            data: {
                isOpen: false
            }
        }).$mount();
        let popper: Element | null = (vm.$refs.a as Vue).$el.querySelector('.m-popper__article');
        if (popper) {
            expect(popper.classList.contains(OPEN_CSS)).toBeFalsy();
        }
        (vm as any).isOpen = true;
        Vue.nextTick(() => {
            if (popper) {
                expect(popper.classList.contains(OPEN_CSS)).toBeTruthy();
            }
            (vm as any).isOpen = false;
            Vue.nextTick(() => {
                if (popper) {
                    expect(popper.classList.contains(OPEN_CSS)).toBeFalsy();
                }
            });
        });
    });

    it('mode prop', () => {
        expect(tooltip.$el.classList.contains(MODE_ICON_CSS)).toBeTruthy();
        expect(tooltip.$el.classList.contains(MODE_LINK_CSS)).toBeFalsy();
        tooltip.mode = MTooltipMode.Link;
        Vue.nextTick(() => {
            expect(tooltip.$el.classList.contains(MODE_LINK_CSS)).toBeTruthy();
            expect(tooltip.$el.classList.contains(MODE_ICON_CSS)).toBeFalsy();
            tooltip.mode = MTooltipMode.Icon;
            Vue.nextTick(() => {
                expect(tooltip.$el.classList.contains(MODE_ICON_CSS)).toBeTruthy();
                expect(tooltip.$el.classList.contains(MODE_LINK_CSS)).toBeFalsy();
            });
        });
    });

    // Todo: Need to be edit, can't catch popper element

    // it('open event', () => {
    //     let clickSpy = jasmine.createSpy('clickSpy');
    //     let vm = new Vue({
    //         template: `
    //         <div>
    //             <m-tooltip ref="a" @open="onOpen">Lorem<span slot="body">Lorem</span></m-tooltip>
    //         </div>`,
    //         methods: {
    //             onOpen: clickSpy
    //         }
    //     }).$mount();

    //     let element: HTMLButtonElement | null = (vm.$refs.a as Vue).$el.querySelector('button');
    //     console.log(vm.$el.outerHTML);

    //     let e: any = document.createEvent('HTMLEvents');
    //     e.initEvent('click', true, true);

    //     if (element) {
    //         element.dispatchEvent(e);
    //     }
    //     Vue.nextTick(() => {
    //         expect(clickSpy).toHaveBeenCalledWith(e);
    //     });
    // });

});
