import Vue from 'vue';
import '../../utils/polyfills';
import MessagePlugin, { MMessage, MMessageState, MMessageMode } from './message';

const STATE_SUCCESS_CSS: string = 'm--is-success';
const STATE_INFORMATION_CSS: string = 'm--is-information';
const STATE_WARNING_CSS: string = 'm--is-warning';
const STATE_ERROR_CSS: string = 'm--is-error';
const MODE_REGULAR_CSS: string = 'm--is-regular';
const MODE_LIGHT_CSS: string = 'm--is-light';
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

describe('MMessageMode', () => {
    it('validates enum', () => {
        expect(MMessageMode.Regular).toEqual('regular');
        expect(MMessageMode.Light).toEqual('light');
    });
});

describe('message', () => {
    beforeEach(() => {
        Vue.use(MessagePlugin);
        message = new MMessage().$mount();
    });

    it('css class for message are not present', () => {
        expect(message.$el.classList.contains(STATE_INFORMATION_CSS)).toBeFalsy();
        expect(message.$el.classList.contains(STATE_WARNING_CSS)).toBeFalsy();
        expect(message.$el.classList.contains(STATE_ERROR_CSS)).toBeFalsy();
        expect(message.$el.classList.contains(MODE_LIGHT_CSS)).toBeFalsy();
    });

    it('state prop', () => {
        expect(message.$el.classList.contains(STATE_INFORMATION_CSS)).toBeFalsy();
        expect(message.$el.classList.contains(STATE_WARNING_CSS)).toBeFalsy();
        expect(message.$el.classList.contains(STATE_ERROR_CSS)).toBeFalsy();

        message.state = MMessageState.Information;
        Vue.nextTick(() => {
            expect(message.$el.classList.contains(STATE_INFORMATION_CSS)).toBeTruthy();
            expect(message.$el.classList.contains(STATE_SUCCESS_CSS)).toBeFalsy();

            message.state = MMessageState.Warning;
            Vue.nextTick(() => {
                expect(message.$el.classList.contains(STATE_WARNING_CSS)).toBeTruthy();
                expect(message.$el.classList.contains(STATE_INFORMATION_CSS)).toBeFalsy();

                message.state = MMessageState.Error;
                Vue.nextTick(() => {
                    expect(message.$el.classList.contains(STATE_ERROR_CSS)).toBeTruthy();
                    expect(message.$el.classList.contains(STATE_WARNING_CSS)).toBeFalsy();

                    message.state = MMessageState.Success;
                    Vue.nextTick(() => {
                        expect(message.$el.classList.contains(STATE_SUCCESS_CSS)).toBeTruthy();
                        expect(message.$el.classList.contains(STATE_ERROR_CSS)).toBeFalsy();
                    });
                });
            });
        });
    });

    it('mode prop', () => {
        expect(message.$el.classList.contains(MODE_LIGHT_CSS)).toBeFalsy();

        message.mode = MMessageMode.Light;
        Vue.nextTick(() => {
            expect(message.$el.classList.contains(MODE_LIGHT_CSS)).toBeTruthy();
            expect(message.$el.classList.contains(MODE_REGULAR_CSS)).toBeFalsy();

            message.mode = MMessageMode.Regular;
            Vue.nextTick(() => {
                expect(message.$el.classList.contains(MODE_REGULAR_CSS)).toBeTruthy();
                expect(message.$el.classList.contains(MODE_LIGHT_CSS)).toBeFalsy();
            });
        });
    });

    it('icon prop', () => {
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

        let icon: Element | null = (vm.$refs.a as Vue).$el.querySelector('svg');
        expect(icon).toBeTruthy();

        (vm as any).hasIcon = false;
        Vue.nextTick(() => {
            let icon: Element | null = (vm.$refs.a as Vue).$el.querySelector('svg');
            expect(icon).toBeFalsy();
        });
    });

    it('closeButton prop', () => {
        let vm = new Vue({
            data: {
                hasCloseButton: true
            },
            template: `
            <div>
                <m-message ref="a" :icon="false" :closeButton="hasCloseButton">Consequat ut proident est ullamco consequat ullamco.</m-message>
            </div>`,
            methods: {
            }
        }).$mount();

        let icon: Element | null = (vm.$refs.a as Vue).$el.querySelector('svg');
        let body: Element | null = (vm.$refs.a as Vue).$el.querySelector('.m-message__body');
        expect(icon).toBeTruthy();
        if (body) {
            expect(body.classList.contains(CLOSE_BUTTON_CSS)).toBeTruthy();
        }

        (vm as any).hasCloseButton = false;
        Vue.nextTick(() => {
            let icon: Element | null = (vm.$refs.a as Vue).$el.querySelector('svg');
            let body: Element | null = (vm.$refs.a as Vue).$el.querySelector('.m-message__body');
            expect(icon).toBeFalsy();
            if (body) {
                expect(body.classList.contains(CLOSE_BUTTON_CSS)).toBeFalsy();
            }
        });
    });

    it('visible prop', () => {
        let vm = new Vue({
            data: {
                isVisible: true
            },
            template: `
            <div>
                <m-message ref="a" :visible="isVisible">Consequat ut proident est ullamco consequat ullamco.</m-message>
            </div>`,
            methods: {
            }
        }).$mount();

        let message: Element | null = (vm.$refs.a as Vue).$el.querySelector('.m-message__wrap');
        expect(message).toBeTruthy();

        (vm as any).isVisible = false;
        Vue.nextTick(() => {
            let message: Element | null = (vm.$refs.a as Vue).$el.querySelector('.m-message__wrap');
            expect(message).toBeFalsy();
        });
    });

    it('close button event', () => {
        let clickSpy = jasmine.createSpy('clickSpy');
        let vm = new Vue({
            template: `
                <m-message @close="onClick($event)">Consequat ut proident est ullamco consequat ullamco.</m-message>
            `,
            methods: {
                onClick: clickSpy
            }
        }).$mount();

        let closeButton = vm.$el.querySelector('button');

        if (closeButton) {
            closeButton.click();
        }

        Vue.nextTick(() => {
            expect(clickSpy).toHaveBeenCalled();
        });
    });

});
