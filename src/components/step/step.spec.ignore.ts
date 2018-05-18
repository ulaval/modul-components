import '../../utils/polyfills';

import Vue from 'vue';

import StepPlugin, { MStep, MStepMode, MStepState } from './step';

const STATE_LOCKED_CSS: string = 'm--is-locked';
const STATE_PROGRESS_CSS: string = 'm--is-in-progress';
const STATE_SUCCESS_CSS: string = 'm--is-success';
const STATE_WARNING_CSS: string = 'm--is-warning';
const STATE_ERROR_CSS: string = 'm--is-error';
const MODE_ACCORDION_CSS: string = 'm--is-accordion';
const OPEN_CSS: string = 'm--is-open';
const CLOSE_CSS: string = 'm--is-close';
const LAST_CSS: string = 'm--is-last';

let step: MStep;

describe('MStepState', () => {
    it('validates enum', () => {
        expect(MStepState.Locked).toEqual('locked');
        expect(MStepState.InProgress).toEqual('in-progress');
        expect(MStepState.Success).toEqual('success');
        expect(MStepState.Warning).toEqual('warning');
        expect(MStepState.Error).toEqual('error');
    });
});

describe('MStepMode', () => {
    it('validates enum', () => {
        expect(MStepMode.Default).toEqual('default');
        expect(MStepMode.Accordion).toEqual('accordion');
    });
});

describe('step', () => {
    beforeEach(() => {
        Vue.use(StepPlugin);
        step = new MStep().$mount();
    });

    it('css class for step are not present', () => {
        expect(step.$el.classList.contains(STATE_LOCKED_CSS)).toBeFalsy();
        expect(step.$el.classList.contains(STATE_PROGRESS_CSS)).toBeFalsy();
        expect(step.$el.classList.contains(STATE_SUCCESS_CSS)).toBeFalsy();
        expect(step.$el.classList.contains(STATE_WARNING_CSS)).toBeFalsy();
        expect(step.$el.classList.contains(STATE_ERROR_CSS)).toBeFalsy();
        expect(step.$el.classList.contains(MODE_ACCORDION_CSS)).toBeFalsy();
        expect(step.$el.classList.contains(OPEN_CSS)).toBeFalsy();
        expect(step.$el.classList.contains(LAST_CSS)).toBeFalsy();
    });

    it('skin prop', () => {
        expect(step.$el.classList.contains(STATE_LOCKED_CSS)).toBeFalsy();
        expect(step.$el.classList.contains(STATE_PROGRESS_CSS)).toBeFalsy();
        expect(step.$el.classList.contains(STATE_SUCCESS_CSS)).toBeFalsy();
        expect(step.$el.classList.contains(STATE_WARNING_CSS)).toBeFalsy();
        expect(step.$el.classList.contains(MODE_ACCORDION_CSS)).toBeFalsy();
        step.state = MStepState.Locked;
        Vue.nextTick(() => {
            expect(step.$el.classList.contains(STATE_LOCKED_CSS)).toBeTruthy();
            step.state = MStepState.InProgress;
            Vue.nextTick(() => {
                expect(step.$el.classList.contains(STATE_PROGRESS_CSS)).toBeTruthy();
                step.state = MStepState.Success;
                Vue.nextTick(() => {
                    expect(step.$el.classList.contains(STATE_SUCCESS_CSS)).toBeTruthy();
                    step.state = MStepState.Warning;
                    Vue.nextTick(() => {
                        expect(step.$el.classList.contains(STATE_WARNING_CSS)).toBeTruthy();
                        step.state = MStepState.Error;
                        Vue.nextTick(() => {
                            expect(step.$el.classList.contains(STATE_ERROR_CSS)).toBeTruthy();
                        });
                    });
                });
            });
        });
    });

    it('mode prop', () => {
        expect(step.$el.classList.contains(MODE_ACCORDION_CSS)).toBeFalsy();
        step.mode = MStepMode.Accordion;
        Vue.nextTick(() => {
            expect(step.$el.classList.contains(MODE_ACCORDION_CSS)).toBeTruthy();
            step.mode = MStepMode.Default;
            Vue.nextTick(() => {
                expect(step.$el.classList.contains(MODE_ACCORDION_CSS)).toBeFalsy();
            });
        });
    });

    it('open prop', () => {
        expect(step.$el.classList.contains(OPEN_CSS)).toBeFalsy();
        expect(step.$el.classList.contains(CLOSE_CSS)).toBeTruthy();
        step.open = true;
        Vue.nextTick(() => {
            expect(step.$el.classList.contains(OPEN_CSS)).toBeTruthy();
            expect(step.$el.classList.contains(CLOSE_CSS)).toBeFalsy();
            step.open = false;
            Vue.nextTick(() => {
                expect(step.$el.classList.contains(OPEN_CSS)).toBeFalsy();
                expect(step.$el.classList.contains(CLOSE_CSS)).toBeTruthy();
            });
        });
    });

    it('last prop', () => {
        expect(step.$el.classList.contains(LAST_CSS)).toBeFalsy();
        step.last = true;
        Vue.nextTick(() => {
            expect(step.$el.classList.contains(LAST_CSS)).toBeTruthy();
            step.last = false;
            Vue.nextTick(() => {
                expect(step.$el.classList.contains(LAST_CSS)).toBeFalsy();
            });
        });
    });

    it('click event', () => {
        let clickSpy: jasmine.Spy = jasmine.createSpy('clickSpy');
        let vm: Vue = new Vue({
            template: `
                <m-step @open="onClick($event)">Consequat ut proident est ullamco consequat ullamco.</m-step>
            `,
            methods: {
                onClick: clickSpy
            }
        }).$mount();

        let header: HTMLButtonElement = vm.$el.querySelector('.m-step__header') as HTMLButtonElement;

        if (header) {
            header.click();
        }

        Vue.nextTick(() => {
            expect(clickSpy).toHaveBeenCalled();
        });
    });

});
