import Vue from 'vue';
import '../../utils/polyfills';
import ButtonPlugin, { MButton, MButtonType, MButtonSkin, MButtonIconPosition } from './button';

const SKIN_PRIMARY_CSS: string = 'm--is-skin-primary';
const SKIN_SECONDARY_CSS: string = 'm--is-skin-secondary';
const STATE_DISABLED_CSS: string = 'm--is-disabled';
const STATE_WAITING_CSS: string = 'm--is-waiting';
const FULLSIZE_CSS: string = 'm--is-full-size';
const ICON_POSITION_LEFT_CSS: string = 'm--is-left';
const ICON_POSITION_RIGHT_CSS: string = 'm--is-right';

let button: MButton;

describe('MButtonType', () => {
    it('validates enum', () => {
        expect(MButtonType.Button).toEqual('button');
        expect(MButtonType.Submit).toEqual('submit');
        expect(MButtonType.Reset).toEqual('reset');
    });
});

describe('MButtonSkin', () => {
    it('validates enum', () => {
        expect(MButtonSkin.Primary).toEqual('primary');
        expect(MButtonSkin.Secondary).toEqual('secondary');
    });
});

describe('MButtonIconPosition', () => {
    it('validates enum', () => {
        expect(MButtonIconPosition.Left).toEqual('left');
        expect(MButtonIconPosition.Right).toEqual('right');
    });
});

describe('button', () => {
    beforeEach(() => {
        Vue.use(ButtonPlugin);
        button = new MButton().$mount();
    });

    it('css class for button are present', () => {
        expect(button.$el.classList.contains(SKIN_PRIMARY_CSS)).toBeTruthy();
    });

    it('css class for button are not present', () => {
        expect(button.$el.classList.contains(SKIN_SECONDARY_CSS)).toBeFalsy();
        expect(button.$el.classList.contains(STATE_DISABLED_CSS)).toBeFalsy();
        expect(button.$el.classList.contains(STATE_WAITING_CSS)).toBeFalsy();
        expect(button.$el.classList.contains(FULLSIZE_CSS)).toBeFalsy();
    });

    it('skin prop', () => {
        expect(button.$el.classList.contains(SKIN_PRIMARY_CSS)).toBeTruthy();
        expect(button.$el.classList.contains(SKIN_SECONDARY_CSS)).toBeFalsy();

        button.skin = MButtonSkin.Secondary;
        Vue.nextTick(() => {
            expect(button.$el.classList.contains(SKIN_SECONDARY_CSS)).toBeTruthy();
            expect(button.$el.classList.contains(SKIN_PRIMARY_CSS)).toBeFalsy();
        });
    });

    it('disabled prop', () => {
        expect(button.$el.classList.contains(STATE_DISABLED_CSS)).toBeFalsy();

        button.disabled = true;
        Vue.nextTick(() => {
            expect(button.$el.classList.contains(STATE_DISABLED_CSS)).toBeTruthy();

            button.disabled = false;
            Vue.nextTick(() => {
                expect(button.$el.classList.contains(STATE_DISABLED_CSS)).toBeFalsy();
            });
        });
    });

    it('waiting prop', () => {
        expect(button.$el.classList.contains(STATE_WAITING_CSS)).toBeFalsy();

        button.waiting = true;
        Vue.nextTick(() => {
            expect(button.$el.classList.contains(STATE_WAITING_CSS)).toBeTruthy();

            button.waiting = false;
            Vue.nextTick(() => {
                expect(button.$el.classList.contains(STATE_WAITING_CSS)).toBeFalsy();
            });
        });
    });

    it('full-size prop', () => {
        expect(button.$el.classList.contains(FULLSIZE_CSS)).toBeFalsy();

        button.fullSize = true;
        Vue.nextTick(() => {
            expect(button.$el.classList.contains(FULLSIZE_CSS)).toBeTruthy();

            button.fullSize = false;
            Vue.nextTick(() => {
                expect(button.$el.classList.contains(FULLSIZE_CSS)).toBeFalsy();
            });
        });
    });

    it('icon-size prop', () => {
        expect(button.iconSize == '12px').toBeTruthy();
    });

    it('icon-position prop is left', () => {
        let vm = new Vue({
            template: `
            <div>
                <m-button ref="a" :iconName="iconName" :iconPosition="internalIconPosition"></m-button>
            </div>`,
            data: {
                iconName: undefined,
                internalIconPosition: MButtonIconPosition.Left
            }
        }).$mount();

        let svg: SVGSVGElement | null = (vm.$refs.a as Vue).$el.querySelector('svg');
        expect(svg).toBeFalsy();

        (vm as any).iconName = 'default';
        (vm as any).internalIconPosition = MButtonIconPosition.Left;
        Vue.nextTick(() => {
            svg = (vm.$refs.a as Vue).$el.querySelector('svg');
            expect(svg).toBeTruthy();
            if (svg) {
                expect(svg.classList.contains(ICON_POSITION_LEFT_CSS)).toBeTruthy();
            }
        });
    });

    it('icon-position prop is right', () => {
        let vm = new Vue({
            template: `
            <div>
                <m-button ref="a" :iconName="iconName" :iconPosition="internalIconPosition"></m-button>
            </div>`,
            data: {
                iconName: undefined,
                internalIconPosition: MButtonIconPosition.Left
            }
        }).$mount();

        let svg: SVGSVGElement | null = (vm.$refs.a as Vue).$el.querySelector('svg');
        expect(svg).toBeFalsy();

        (vm as any).iconName = 'default';
        (vm as any).internalIconPosition = MButtonIconPosition.Right;
        Vue.nextTick(() => {
            svg = (vm.$refs.a as Vue).$el.querySelector('svg');
            expect(svg).toBeTruthy();
            if (svg) {
                expect(svg.classList.contains(ICON_POSITION_RIGHT_CSS)).toBeTruthy();
            }
        });
    });

    it('click event', () => {
        let clickSpy = jasmine.createSpy('clickSpy');
        let vm = new Vue({
            data: {
            },
            template: `
            <div>
                <m-button ref="a" @click="onClick"></m-button>
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
