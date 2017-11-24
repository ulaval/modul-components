import Vue from 'vue';
import '../../utils/polyfills';
import ListItemPlugin, { MListItem } from './list-item';
import { SPINNER_CLASS } from '../spinner/spinner.spec';
import { ICON_BUTTON_CLASS } from '../icon-button/icon-button.spec';
import SpritesHelper from '../../../tests/helpers/sprites';
import LangHelper from '../../../tests/helpers/lang';

describe('list-item', () => {
    const DISABLED_CSS: string = 'm--is-disabled';
    const WAITING_CSS: string = 'm--is-waiting';

    let list: MListItem;

    beforeEach(() => {
        spyOn(console, 'error');

        Vue.use(ListItemPlugin);
        Vue.use(SpritesHelper);
        Vue.use(LangHelper);
    });

    afterEach(() => {
        Vue.nextTick(() => {
            expect(console.error).not.toHaveBeenCalled();
        });
    });

    it('m--is-disabled class is present when disabled', () => {
        list = new MListItem().$mount();
        expect(list.$el.classList.contains(DISABLED_CSS)).toBeFalsy();
        list.disabled = true;
        Vue.nextTick(() => {
            expect(list.$el.classList.contains(DISABLED_CSS)).toBeTruthy();
        });
    });

    it('m--is-waiting class is present when waiting props is true', () => {
        list = new MListItem().$mount();
        expect(list.$el.classList.contains(WAITING_CSS)).toBeFalsy();
        list.waiting = true;
        Vue.nextTick(() => {
            expect(list.$el.classList.contains(WAITING_CSS)).toBeTruthy();
        });
    });

    it('text content', () => {
        let vm = new Vue({
            template: `<m-list-item>item 1</m-list-item>`
        }).$mount();

        let element: HTMLElement = vm.$el.querySelector('.m-list-item__content') as HTMLElement;
        expect(element.textContent).toEqual('item 1');
    });

    it('icon-name prop', () => {
        let vm = new Vue({
            data: {
                iconNameTest: ''
            },
            template: `<m-list-item :icon-name="iconNameTest">item 1</m-list-item>`
        }).$mount();

        let element: Element | null = vm.$el.querySelector(ICON_BUTTON_CLASS);
        expect(element).toBeFalsy();

        (vm as any).iconNameTest = 'chip-error';
        Vue.nextTick(() => {
            element = vm.$el.querySelector(ICON_BUTTON_CLASS);
            expect(element).toBeTruthy();
        });
    });

    describe('disabled prop', () => {
        it('delete button', () => {
            let vm = new Vue({
                data: {
                    disabled: false
                },
                template: `<m-list-item icon-name="chip-error" :disabled="disabled">item 1</m-list-item>`
            }).$mount();

            let icon: Element | null = vm.$el.querySelector(ICON_BUTTON_CLASS);
            expect(icon).toBeTruthy();

            (vm as any).disabled = true;
            Vue.nextTick(() => {
                let icon = vm.$el.querySelector(ICON_BUTTON_CLASS);
                expect(icon).toBeFalsy();
            });
        });

        it('waiting', () => {
            let vm = new Vue({
                data: {
                    disabled: false,
                    waiting: true
                },
                template: `<m-list-item :waiting="waiting" :disabled="disabled">item 1</m-list-item>`
            }).$mount();

            let spinner: Element | null = vm.$el.querySelector(SPINNER_CLASS);
            expect(spinner).toBeTruthy();
            expect(vm.$el.classList.contains(WAITING_CSS)).toBeTruthy();

            (vm as any).disabled = true;
            Vue.nextTick(() => {
                let spinner = vm.$el.querySelector(SPINNER_CLASS);
                expect(spinner).toBeFalsy();
                expect(vm.$el.classList.contains(WAITING_CSS)).toBeFalsy();
            });
        });
    });

    it('waiting prop', () => {
        let vm = new Vue({
            data: {
                waiting: false
            },
            template: `<m-list-item icon-name="chip-error" :waiting="waiting">item 1</m-list-item>`
        }).$mount();

        let icon: Element | null = vm.$el.querySelector(ICON_BUTTON_CLASS);
        let spinner: Element | null = vm.$el.querySelector(SPINNER_CLASS);
        expect(icon).toBeTruthy();
        expect(spinner).toBeFalsy();

        (vm as any).waiting = true;
        Vue.nextTick(() => {
            let icon = vm.$el.querySelector(ICON_BUTTON_CLASS);
            let spinner = vm.$el.querySelector(SPINNER_CLASS);
            expect(icon).toBeFalsy();
            expect(spinner).toBeTruthy();
        });
    });

    it('delete button event', () => {
        list = new MListItem().$mount();
        let clickSpy = jasmine.createSpy('clickSpy');
        let vm = new Vue({
            template: `<m-list-item icon-name="chip-error" @click="onClick($event)">item 1</m-list-item>`,
            methods: {
                onClick: clickSpy
            }
        }).$mount();

        let deleteButton = vm.$el.querySelector('button');

        if (deleteButton) {
            deleteButton.click();
        }

        Vue.nextTick(() => {
            expect(clickSpy).toHaveBeenCalled();
        });
    });

});
