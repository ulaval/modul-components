import Vue from 'vue';
import '../../utils/polyfills';
import ButtonPlugin, { MButton, MButtonType, MButtonMode, MButtonState, MButtonIconPosition } from './button';

const MODE_PRIMARY_CSS: string = 'm--is-mode-primary';
const MODE_SECONDARY_CSS: string = 'm--is-mode-secondary';
const MODE_ICON_CSS: string = 'm--is-mode-icon';
const STATE_DISABLED_CSS: string = 'm--is-disabled';
const STATE_SELECTED_CSS: string = 'm--is-selected';
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

describe('MButtonMode', () => {
    it('validates enum', () => {
        expect(MButtonMode.Primary).toEqual('primary');
        expect(MButtonMode.Secondary).toEqual('secondary');
        expect(MButtonMode.Icon).toEqual('icon');
    });
});

describe('MButtonState', () => {
    it('validates enum', () => {
        expect(MButtonState.Default).toEqual('default');
        expect(MButtonState.Disabled).toEqual('disabled');
        expect(MButtonState.Selected).toEqual('selected');
        expect(MButtonState.Waiting).toEqual('waiting');
    });
});

describe('button', () => {
    beforeEach(() => {
        Vue.use(ButtonPlugin);
        button = new MButton().$mount();
    });

    it('css class for button are present', () => {
        expect(button.$el.classList.contains(MODE_PRIMARY_CSS)).toBeTruthy();
    });

    it('css class for button are not present', () => {
        expect(button.$el.classList.contains(MODE_SECONDARY_CSS)).toBeFalsy();
        expect(button.$el.classList.contains(MODE_ICON_CSS)).toBeFalsy();
        expect(button.$el.classList.contains(STATE_DISABLED_CSS)).toBeFalsy();
        expect(button.$el.classList.contains(STATE_SELECTED_CSS)).toBeFalsy();
        expect(button.$el.classList.contains(STATE_WAITING_CSS)).toBeFalsy();
        expect(button.$el.classList.contains(FULLSIZE_CSS)).toBeFalsy();
    });

    it('mode prop', () => {
        expect(button.$el.classList.contains(MODE_PRIMARY_CSS)).toBeTruthy();
        expect(button.$el.classList.contains(MODE_SECONDARY_CSS)).toBeFalsy();
        expect(button.$el.classList.contains(MODE_ICON_CSS)).toBeFalsy();

        button.mode = MButtonMode.Secondary;
        Vue.nextTick(() => {
            expect(button.$el.classList.contains(MODE_SECONDARY_CSS)).toBeTruthy();
            expect(button.$el.classList.contains(MODE_PRIMARY_CSS)).toBeFalsy();
            expect(button.$el.classList.contains(MODE_ICON_CSS)).toBeFalsy();

            button.mode = MButtonMode.Icon;
            Vue.nextTick(() => {
                expect(button.$el.classList.contains(MODE_ICON_CSS)).toBeTruthy();
                expect(button.$el.classList.contains(MODE_PRIMARY_CSS)).toBeFalsy();
                expect(button.$el.classList.contains(MODE_SECONDARY_CSS)).toBeFalsy();
            });
        });
    });

    it('state prop', () => {
        expect(button.$el.classList.contains(STATE_DISABLED_CSS)).toBeFalsy();
        expect(button.$el.classList.contains(STATE_SELECTED_CSS)).toBeFalsy();
        expect(button.$el.classList.contains(STATE_WAITING_CSS)).toBeFalsy();

        button.state = MButtonState.Disabled;
        Vue.nextTick(() => {
            expect(button.$el.classList.contains(STATE_DISABLED_CSS)).toBeTruthy();
            expect(button.$el.classList.contains(STATE_SELECTED_CSS)).toBeFalsy();
            expect(button.$el.classList.contains(STATE_WAITING_CSS)).toBeFalsy();

            button.state = MButtonState.Selected;
            Vue.nextTick(() => {
                expect(button.$el.classList.contains(STATE_DISABLED_CSS)).toBeFalsy();
                expect(button.$el.classList.contains(STATE_SELECTED_CSS)).toBeTruthy();
                expect(button.$el.classList.contains(STATE_WAITING_CSS)).toBeFalsy();

                button.state = MButtonState.Waiting;
                Vue.nextTick(() => {
                    expect(button.$el.classList.contains(STATE_DISABLED_CSS)).toBeFalsy();
                    expect(button.$el.classList.contains(STATE_SELECTED_CSS)).toBeFalsy();
                    expect(button.$el.classList.contains(STATE_WAITING_CSS)).toBeTruthy();
                });
            });
        });
    });

    it('fullsize prop', () => {
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

    it('icon position left', () => {
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

    it('icon position right', () => {
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
