import Vue from 'vue';
import '../../utils/polyfills';
import MessagePlugin, { MMessage, MMessageState, MMessageSkin } from './message';
import { ICON_CLASS, validateIconSvg } from '../icon/icon.spec';
import { ICON_BUTTON_CLASS } from '../icon-button/icon-button.spec';
import SpritesHelper from '../../../tests/helpers/sprites';
import LangHelper from '../../../tests/helpers/lang';

const STATE_SUCCESS_CSS: string = 'm--is-success';
const STATE_INFORMATION_CSS: string = 'm--is-information';
const STATE_WARNING_CSS: string = 'm--is-warning';
const STATE_ERROR_CSS: string = 'm--has-error';
const SKIN_REGULAR_CSS: string = 'm--is-skin-regular';
const SKIN_LIGHT_CSS: string = 'm--is-skin-light';
const CLOSE_BUTTON_CSS: string = 'm--has-close-button';

let message: MMessage;

describe('MMessageState', () => {
    it('validates enum', () => {
        expect(MMessageState.Success).toEqual('success');
        expect(MMessageState.Information).toEqual('information');
        expect(MMessageState.Warning).toEqual('warning');
        expect(MMessageState.Error).toEqual('error');
    });
});

describe('MMessageSkin', () => {
    it('validates enum', () => {
        expect(MMessageSkin.Regular).toEqual('regular');
        expect(MMessageSkin.Light).toEqual('light');
    });
});

describe('message', () => {
    beforeEach(() => {
        spyOn(console, 'error');

        Vue.use(MessagePlugin);
        Vue.use(SpritesHelper);
        Vue.use(LangHelper);
    });

    afterEach(done => {
        Vue.nextTick(() => {
            expect(console.error).not.toHaveBeenCalled();

            done();
        });
    });

    it('css class for message are not present', () => {
        message = new MMessage().$mount();
        expect(message.$el.classList.contains(STATE_INFORMATION_CSS)).toBeFalsy();
        expect(message.$el.classList.contains(STATE_WARNING_CSS)).toBeFalsy();
        expect(message.$el.classList.contains(STATE_ERROR_CSS)).toBeFalsy();
        expect(message.$el.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();
    });

    describe('state prop', () => {
        let vm: Vue;
        beforeEach(() => {
            vm = new Vue({
                data: {
                    state: MMessageState.Information
                },
                template: `<m-message :state="state" :closeButton="false">Consequat ut proident est ullamco consequat ullamco.</m-message>`
            }).$mount();
        });

        it('information', done => {
            (vm as any).state = MMessageState.Information;
            Vue.nextTick(() => {
                expect(vm.$el.classList.contains(STATE_INFORMATION_CSS)).toBeTruthy();
                expect(vm.$el.classList.contains(STATE_WARNING_CSS)).toBeFalsy();
                expect(vm.$el.classList.contains(STATE_ERROR_CSS)).toBeFalsy();
                expect(vm.$el.classList.contains(STATE_SUCCESS_CSS)).toBeFalsy();

                validateIconSvg(vm.$el.querySelector(ICON_CLASS) as Element, 'information');

                done();
            });
        });

        it('warning', done => {
            (vm as any).state = MMessageState.Warning;
            Vue.nextTick(() => {
                expect(vm.$el.classList.contains(STATE_INFORMATION_CSS)).toBeFalsy();
                expect(vm.$el.classList.contains(STATE_WARNING_CSS)).toBeTruthy();
                expect(vm.$el.classList.contains(STATE_ERROR_CSS)).toBeFalsy();
                expect(vm.$el.classList.contains(STATE_SUCCESS_CSS)).toBeFalsy();

                validateIconSvg(vm.$el.querySelector(ICON_CLASS) as Element, 'warning');

                done();
            });
        });

        it('error', done => {
            (vm as any).state = MMessageState.Error;
            Vue.nextTick(() => {
                expect(vm.$el.classList.contains(STATE_INFORMATION_CSS)).toBeFalsy();
                expect(vm.$el.classList.contains(STATE_WARNING_CSS)).toBeFalsy();
                expect(vm.$el.classList.contains(STATE_ERROR_CSS)).toBeTruthy();
                expect(vm.$el.classList.contains(STATE_SUCCESS_CSS)).toBeFalsy();

                validateIconSvg(vm.$el.querySelector(ICON_CLASS) as Element, 'error');

                done();
            });
        });

        it('success', done => {
            (vm as any).state = MMessageState.Success;
            Vue.nextTick(() => {
                expect(vm.$el.classList.contains(STATE_INFORMATION_CSS)).toBeFalsy();
                expect(vm.$el.classList.contains(STATE_WARNING_CSS)).toBeFalsy();
                expect(vm.$el.classList.contains(STATE_ERROR_CSS)).toBeFalsy();
                expect(vm.$el.classList.contains(STATE_SUCCESS_CSS)).toBeTruthy();

                validateIconSvg(vm.$el.querySelector(ICON_CLASS) as Element, 'check');

                done();
            });
        });
    });

    describe('skin prop', () => {
        beforeEach(() => {
            message = new MMessage().$mount();
        });

        it('light', done => {
            message.skin = MMessageSkin.Light;
            Vue.nextTick(() => {
                expect(message.$el.classList.contains(SKIN_LIGHT_CSS)).toBeTruthy();
                expect(message.$el.classList.contains(SKIN_REGULAR_CSS)).toBeFalsy();

                done();
            });
        });

        it('regular', done => {
            message.skin = MMessageSkin.Regular;
            Vue.nextTick(() => {
                expect(message.$el.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();
                expect(message.$el.classList.contains(SKIN_REGULAR_CSS)).toBeTruthy();

                done();
            });
        });
    });

    it('icon prop', done => {
        let vm = new Vue({
            data: {
                hasIcon: true
            },
            template: `
            <div>
                <m-message ref="a" :icon="hasIcon" :closeButton="false">Consequat ut proident est ullamco consequat ullamco.</m-message>
            </div>`,
            methods: {
            }
        }).$mount();

        let icon: Element | null = (vm.$refs.a as Vue).$el.querySelector(ICON_CLASS);
        expect(icon).toBeTruthy();

        (vm as any).hasIcon = false;
        Vue.nextTick(() => {
            let icon: Element | null = (vm.$refs.a as Vue).$el.querySelector(ICON_CLASS);
            expect(icon).toBeFalsy();

            done();
        });
    });

    it('closeButton prop', done => {
        let vm = new Vue({
            data: {
                hasCloseButton: true
            },
            template: `
            <div>
                <m-message ref="a" :icon="false" :close-button="hasCloseButton">Consequat ut proident est ullamco consequat ullamco.</m-message>
            </div>`,
            methods: {
            }
        }).$mount();

        let icon: Element | null = (vm.$refs.a as Vue).$el.querySelector(ICON_CLASS);
        let body: Element | null = (vm.$refs.a as Vue).$el.querySelector('.m-message__body');
        expect(icon).toBeTruthy();
        expect(body).toBeTruthy();
        if (body) {
            expect(body.classList.contains(CLOSE_BUTTON_CSS)).toBeTruthy();
        }

        (vm as any).hasCloseButton = false;
        Vue.nextTick(() => {
            icon = (vm.$refs.a as Vue).$el.querySelector(ICON_CLASS);
            body = (vm.$refs.a as Vue).$el.querySelector('.m-message__body');
            expect(icon).toBeFalsy();
            expect(body).toBeTruthy();
            if (body) {
                expect(body.classList.contains(CLOSE_BUTTON_CSS)).toBeFalsy();
            }

            done();
        });
    });

    describe('visible prop', () => {
        let vm: Vue;
        beforeEach(() => {
            vm = new Vue({
                data: {
                    isVisible: true,
                    hasCloseButton: false
                },
                template: `
            <div>
                <m-message ref="a" :visible="isVisible" :close-button="hasCloseButton">Consequat ut proident est ullamco consequat ullamco.</m-message>
            </div>`
            }).$mount();
        });

        it('standard', done => {
            expect(vm.$el.querySelector('.m-message')).toBeTruthy();

            (vm as any).isVisible = false;
            Vue.nextTick(() => {
                expect(vm.$el.querySelector('.m-message')).toBeFalsy();

                (vm as any).isVisible = undefined;

                Vue.nextTick(() => {
                    expect(vm.$el.querySelector('.m-message')).toBeTruthy();

                    done();
                });
            });
        });

        it('with close no sync', done => {
            expect(vm.$el.querySelector(ICON_BUTTON_CLASS)).toBeFalsy();

            (vm as any).hasCloseButton = true;
            Vue.nextTick(() => {
                let hasCloseButton: HTMLElement = vm.$el.querySelector(ICON_BUTTON_CLASS) as HTMLElement;
                expect(hasCloseButton).toBeTruthy();
                hasCloseButton.click();

                Vue.nextTick(() => {
                    expect(vm.$el.querySelector('.m-message')).toBeTruthy();
                    done();
                });
            });
        });
    });

    it('sync', done => {
        let vm = new Vue({
            data: {
                isVisible: true
            },
            template: `
            <div>
                <m-message ref="a" :visible.sync="isVisible" :close-button="true">Consequat ut proident est ullamco consequat ullamco.</m-message>
            </div>`
        }).$mount();

        let closeButton: HTMLElement = vm.$el.querySelector(ICON_BUTTON_CLASS) as HTMLElement;
        expect(closeButton).toBeTruthy();
        closeButton.click();

        Vue.nextTick(() => {
            expect((vm as any).isVisible).toEqual(false);

            // reset to default value
            (vm as any).isVisible = undefined;

            Vue.nextTick(() => {
                expect(vm.$el.querySelector('.m-message')).toBeTruthy();

                done();
            });
        });
    });

    it('close button event', done => {
        let clickSpy = jasmine.createSpy('clickSpy');
        let vm = new Vue({
            template: `<m-message @close="onClick($event)" close-button="true">Consequat ut proident est ullamco consequat ullamco.</m-message>`,
            methods: {
                onClick: clickSpy
            }
        }).$mount();

        let closeButton: HTMLElement = vm.$el.querySelector(ICON_BUTTON_CLASS) as HTMLElement;

        if (closeButton) {
            closeButton.click();
        }

        Vue.nextTick(() => {
            expect(clickSpy).toHaveBeenCalled();

            done();
        });
    });

    it('text content', () => {
        let vm = new Vue({
            template: `<m-message>Message</m-message>`
        }).$mount();

        let element: HTMLElement = vm.$el.querySelector('.m-message__body__content') as HTMLElement;
        expect(element).toBeTruthy();
        expect(element.textContent).toEqual('Message');
    });
});
