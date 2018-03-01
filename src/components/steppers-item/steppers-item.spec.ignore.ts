import Vue from 'vue';
import '../../utils/polyfills';
import SteppersItemPlugin, { MSteppersItem, MSteppersItemState } from './steppers-item';
import SpritesHelper from '../../../tests/helpers/sprites';
import { ICON_CLASS, validateIconSvg } from '../icon/icon.spec';

const STATE_COMPLETED_CSS: string = 'm--is-completed';
const STATE_PROGRESS_CSS: string = 'm--is-in-progress';
const STATE_DISABLED_CSS: string = 'm--is-disabled';

let steppersItem: MSteppersItem;

describe('MSteppersItemState', () => {
    it('validates enum', () => {
        expect(MSteppersItemState.Completed).toEqual('completed');
        expect(MSteppersItemState.InProgress).toEqual('in-progress');
        expect(MSteppersItemState.Disabled).toEqual('disabled');
    });
});

describe('MSteppers-item', () => {
    beforeEach(() => {
        spyOn(console, 'error');

        Vue.use(SteppersItemPlugin);
        Vue.use(SpritesHelper);
    });

    afterEach(done => {
        Vue.nextTick(() => {
            expect(console.error).not.toHaveBeenCalled();

            done();
        });
    });

    it('css class for steppers-item are present', () => {
        steppersItem = new MSteppersItem().$mount();
        expect(steppersItem.$el.classList.contains(STATE_DISABLED_CSS)).toBeTruthy();
    });

    it('css class for steppers-item are not present', () => {
        steppersItem = new MSteppersItem().$mount();
        expect(steppersItem.$el.classList.contains(STATE_PROGRESS_CSS)).toBeFalsy();
        expect(steppersItem.$el.classList.contains(STATE_COMPLETED_CSS)).toBeFalsy();
    });

    it('state prop', done => {
        steppersItem = new MSteppersItem().$mount();
        expect(steppersItem.$el.classList.contains(STATE_DISABLED_CSS)).toBeTruthy();

        steppersItem.state = MSteppersItemState.InProgress;
        Vue.nextTick(() => {
            expect(steppersItem.$el.classList.contains(STATE_DISABLED_CSS)).toBeFalsy();
            expect(steppersItem.$el.classList.contains(STATE_PROGRESS_CSS)).toBeTruthy();

            steppersItem.state = MSteppersItemState.Completed;
            Vue.nextTick(() => {
                expect(steppersItem.$el.classList.contains(STATE_PROGRESS_CSS)).toBeFalsy();
                expect(steppersItem.$el.classList.contains(STATE_COMPLETED_CSS)).toBeTruthy();
                done();
            });
        });
    });

    it('icon-name prop', done => {
        steppersItem = new MSteppersItem().$mount();
        validateIconSvg(steppersItem.$el, 'default');

        Vue.nextTick(() => {
            let icon: Element | null = steppersItem.$el.querySelector(ICON_CLASS);
            expect(icon).toBeTruthy();
            if (icon) {
                validateIconSvg(steppersItem.$el, 'default');
            }

            steppersItem.iconName = 'chip-error';
            Vue.nextTick(() => {
                icon = steppersItem.$el.querySelector(ICON_CLASS) as Element;
                validateIconSvg(icon, 'chip-error');

                done();
            });
        });
    });

    it('text rendering', () => {
        let vm = new Vue({
            template: `<m-steppers-item>Label</m-steppers-item>`
        }).$mount();

        let textSlot: Element | null = vm.$el.querySelector('.m-steppers-item__title');
        expect(textSlot).toBeTruthy();
        if (textSlot) {
            expect(textSlot.textContent).toBeTruthy();
            if (textSlot.textContent) {
                expect(textSlot.textContent.trim()).toBe('Label'); // inner html = 'Label <!---->', text content skip the comments but keeps space so we trim the string
            }
        }
    });

    it('click event', done => {
        let clickSpy = jasmine.createSpy('clickSpy');
        let vm = new Vue({
            template: `<m-steppers-item state="completed" @click="onClick">Label</m-steppers-item>`,
            methods: {
                onClick: clickSpy
            }
        }).$mount();

        let icon = (vm as Vue).$el.querySelector('.m-steppers-item__icon') as Element;
        let title = (vm as Vue).$el.querySelector('.m-steppers-item__title') as Element;

        let e: any = document.createEvent('HTMLEvents');
        e.initEvent('click', true, true);

        if (icon) {
            icon.dispatchEvent(e);
        }
        Vue.nextTick(() => {
            expect(clickSpy).toHaveBeenCalledWith(e);

            done();
        });

        if (title) {
            title.dispatchEvent(e);
        }
        Vue.nextTick(() => {
            expect(clickSpy).toHaveBeenCalledWith(e);

            done();
        });
    });

});
