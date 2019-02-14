import { createLocalVue } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import LoggerPlugin from './logger';

// tslint:disable:no-console
describe(`Given the class Logger`, () => {
    const localVue: VueConstructor<Vue> = createLocalVue();

    beforeEach(() => {
        console.log = jest.fn();
        console.warn = jest.fn();
        console.debug = jest.fn();
        console.info = jest.fn();

        localVue.use(LoggerPlugin);
    });

    describe(`Given the option hideAll set to true`, () => {
        beforeEach(() => {
            localVue.prototype.$log.setConsoleOptions({
                hideAll: true,
                displayDebugs: true,
                displayInfos: true,
                displayLogs: true,
                displayWarnings: true
            });
        });

        it(`a log shouldn't be displayed`, () => {
            localVue.prototype.$log.log('test');
            expect(console.log).not.toHaveBeenCalled();
        });

        it(`a warning shouldn't be displayed`, () => {
            localVue.prototype.$log.warn('test');
            expect(console.warn).not.toHaveBeenCalled();
        });

        it(`a debug shouldn't be displayed`, () => {
            localVue.prototype.$log.debug('test');
            expect(console.debug).not.toHaveBeenCalled();
        });

        it(`an info shouldn't be displayed`, () => {
            localVue.prototype.$log.info('test');
            expect(console.info).not.toHaveBeenCalled();
        });
    });

    describe(`Given the option hideAll set to false`, () => {
        beforeEach(() => {
            localVue.prototype.$log.setConsoleOptions({
                hideAll: false
            });
        });

        describe(`Given the option displayLogs set to true`, () => {
            beforeEach(() => {
                localVue.prototype.$log.setConsoleOptions({
                    displayLogs: true
                });
            });

            it(`a log should be displayed`, () => {
                localVue.prototype.$log.log('test');
                expect(console.log).toHaveBeenCalled();
            });
        });

        describe(`Given the option displayLogs set to false`, () => {
            beforeEach(() => {
                localVue.prototype.$log.setConsoleOptions({
                    displayLogs: false
                });
            });

            it(`a log shouldn't be displayed`, () => {
                localVue.prototype.$log.log('test');
                expect(console.log).not.toHaveBeenCalled();
            });
        });

        describe(`Given the option displayWarnings set to true`, () => {
            beforeEach(() => {
                localVue.prototype.$log.setConsoleOptions({
                    displayWarnings: true
                });
            });

            it(`a warn should be displayed`, () => {
                localVue.prototype.$log.warn('test');
                expect(console.warn).toHaveBeenCalled();
            });
        });

        describe(`Given the option displayWarnings set to false`, () => {
            beforeEach(() => {
                localVue.prototype.$log.setConsoleOptions({
                    displayWarnings: false
                });
            });

            it(`a warn shouldn't be displayed`, () => {
                localVue.prototype.$log.warn('test');
                expect(console.warn).not.toHaveBeenCalled();
            });
        });

        describe(`Given the option displayDebugs set to true`, () => {
            beforeEach(() => {
                localVue.prototype.$log.setConsoleOptions({
                    displayDebugs: true
                });
            });

            it(`a debug should be displayed`, () => {
                localVue.prototype.$log.debug('test');
                expect(console.debug).toHaveBeenCalled();
            });
        });

        describe(`Given the option displayDebugs set to false`, () => {
            beforeEach(() => {
                localVue.prototype.$log.setConsoleOptions({
                    displayDebugs: false
                });
            });

            it(`a debug shouldn't be displayed`, () => {
                localVue.prototype.$log.debug('test');
                expect(console.debug).not.toHaveBeenCalled();
            });
        });

        describe(`Given the option displayInfos set to true`, () => {
            beforeEach(() => {
                localVue.prototype.$log.setConsoleOptions({
                    displayInfos: true
                });
            });

            it(`an info should be displayed`, () => {
                localVue.prototype.$log.info('test');
                expect(console.info).toHaveBeenCalled();
            });
        });

        describe(`Given the option displayInfos set to false`, () => {
            beforeEach(() => {
                localVue.prototype.$log.setConsoleOptions({
                    displayInfos: false
                });
            });

            it(`an info shouldn't be displayed`, () => {
                localVue.prototype.$log.info('test');
                expect(console.info).not.toHaveBeenCalled();
            });
        });
    });
});
// tslint:enable:no-console

