import Vue from 'vue';
import '../../utils/polyfills';
import SwitchPlugin, { MSwitch, MSwitchPosition } from './switch';

const SWITCH_LEFT_CSS: string = 'm--is-switch-left';
const SWITCH_RIGHT_CSS: string = 'm--is-switch-right';
const CHECKED_CSS: string = 'm--is-checked';
const FOCUS_CSS: string = 'm--is-focus';
const NO_HELPER_TEXT_CSS: string = 'm--no-helperText';

let switchVar: MSwitch;

describe('MSwitchPosition', () => {
    it('validates enum', () => {
        expect(MSwitchPosition.Left).toEqual('left');
        expect(MSwitchPosition.Right).toEqual('right');
    });
});

describe('switch', () => {
    beforeEach(() => {
        Vue.use(SwitchPlugin);
        switchVar = new MSwitch().$mount();
    });

    it('css class for switch are present', () => {
        expect(switchVar.$el.classList.contains(SWITCH_LEFT_CSS)).toBeTruthy();
    });

    it('css class for switch are not present', () => {
        expect(switchVar.$el.classList.contains(SWITCH_RIGHT_CSS)).toBeFalsy();
        expect(switchVar.$el.classList.contains(CHECKED_CSS)).toBeFalsy();
        expect(switchVar.$el.classList.contains(FOCUS_CSS)).toBeFalsy();
        expect(switchVar.$el.classList.contains(NO_HELPER_TEXT_CSS)).toBeFalsy();
    });

    it('position prop', () => {
        expect(switchVar.$el.classList.contains(SWITCH_LEFT_CSS)).toBeTruthy();
        expect(switchVar.$el.classList.contains(SWITCH_RIGHT_CSS)).toBeFalsy();
        switchVar.position = MSwitchPosition.Right;
        Vue.nextTick(() => {
            expect(switchVar.$el.classList.contains(SWITCH_RIGHT_CSS)).toBeTruthy();
            expect(switchVar.$el.classList.contains(SWITCH_LEFT_CSS)).toBeFalsy();
            switchVar.position = MSwitchPosition.Left;
            Vue.nextTick(() => {
                expect(switchVar.$el.classList.contains(SWITCH_LEFT_CSS)).toBeTruthy();
                expect(switchVar.$el.classList.contains(SWITCH_RIGHT_CSS)).toBeFalsy();
            });
        });
    });

    it('helper text prop', () => {
        expect(switchVar.$el.classList.contains(NO_HELPER_TEXT_CSS)).toBeFalsy();
        switchVar.helperText = false;
        Vue.nextTick(() => {
            expect(switchVar.$el.classList.contains(NO_HELPER_TEXT_CSS)).toBeTruthy();
            switchVar.helperText = true;
            Vue.nextTick(() => {
                expect(switchVar.$el.classList.contains(NO_HELPER_TEXT_CSS)).toBeFalsy();
            });
        });
    });

    it('v-model', () => {
        let vm = new Vue({
            data: {
                model: false
            },
            template: `
            <div>
                <m-switch ref="a" :value="model"></m-switch>
            </div>`
        }).$mount();

        let li: HTMLLIElement = (vm.$refs.a as Vue).$el as HTMLLIElement;

        expect(li.classList.contains(CHECKED_CSS)).toBeFalsy();
        (vm as any).model = true;
        Vue.nextTick(() => {
            expect(li.classList.contains(CHECKED_CSS)).toBeTruthy();
        });
    });

    it('click event', () => {
        let clickSpy = jasmine.createSpy('clickSpy');
        let vm = new Vue({
            template: `
            <div>
                <m-switch ref="a" @click="onClick"></m-switch>
            </div>`,
            methods: {
                onClick: clickSpy
            }
        }).$mount();

        let input: HTMLInputElement | null = (vm.$refs.a as Vue).$el.querySelector('input');

        let e: any = document.createEvent('HTMLEvents');
        e.initEvent('click', true, true);

        if (input) {
            input.dispatchEvent(e);
        }
        Vue.nextTick(() => {
            expect(clickSpy).toHaveBeenCalledWith(e);
        });
    });

});
