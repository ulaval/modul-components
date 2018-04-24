import { Logger } from './logger';

describe(`Given the class Logger`, () => {
    beforeEach(() => {
        console.log = jest.fn();
        console.warn = jest.fn();
        console.debug = jest.fn();
        console.info = jest.fn();
    });

    describe(`Given the option hideAll set to true`, () => {
        beforeEach(() => {
            Logger.setConsoleOptions({
                hideAll: true,
                displayDebugs: true,
                displayInfos: true,
                displayLogs: true,
                displayWarnings: true
            });
        });

        it(`a log shouldn't be displayed`, () => {
            Logger.log('test');
            expect(console.log).not.toHaveBeenCalled();
        });

        it(`a warning shouldn't be displayed`, () => {
            Logger.warn('test');
            expect(console.warn).not.toHaveBeenCalled();
        });

        it(`a debug shouldn't be displayed`, () => {
            Logger.debug('test');
            expect(console.debug).not.toHaveBeenCalled();
        });

        it(`an info shouldn't be displayed`, () => {
            Logger.info('test');
            expect(console.info).not.toHaveBeenCalled();
        });
    });

    describe(`Given the option hideAll set to false`, () => {
        beforeEach(() => {
            Logger.setConsoleOptions({
                hideAll: false
            });
        });

        describe(`Given the option displayLogs set to true`, () => {
            beforeEach(() => {
                Logger.setConsoleOptions({
                    displayLogs: true
                });
            });

            it(`a log should be displayed`, () => {
                Logger.log('test');
                expect(console.log).toHaveBeenCalled();
            });
        });

        describe(`Given the option displayLogs set to false`, () => {
            beforeEach(() => {
                Logger.setConsoleOptions({
                    displayLogs: false
                });
            });

            it(`a log shouldn't be displayed`, () => {
                Logger.log('test');
                expect(console.log).not.toHaveBeenCalled();
            });
        });

        describe(`Given the option displayWarnings set to true`, () => {
            beforeEach(() => {
                Logger.setConsoleOptions({
                    displayWarnings: true
                });
            });

            it(`a warn should be displayed`, () => {
                Logger.warn('test');
                expect(console.warn).toHaveBeenCalled();
            });
        });

        describe(`Given the option displayWarnings set to false`, () => {
            beforeEach(() => {
                Logger.setConsoleOptions({
                    displayWarnings: false
                });
            });

            it(`a warn shouldn't be displayed`, () => {
                Logger.warn('test');
                expect(console.warn).not.toHaveBeenCalled();
            });
        });

        describe(`Given the option displayDebugs set to true`, () => {
            beforeEach(() => {
                Logger.setConsoleOptions({
                    displayDebugs: true
                });
            });

            it(`a debug should be displayed`, () => {
                Logger.debug('test');
                expect(console.debug).toHaveBeenCalled();
            });
        });

        describe(`Given the option displayDebugs set to false`, () => {
            beforeEach(() => {
                Logger.setConsoleOptions({
                    displayDebugs: false
                });
            });

            it(`a debug shouldn't be displayed`, () => {
                Logger.debug('test');
                expect(console.debug).not.toHaveBeenCalled();
            });
        });

        describe(`Given the option displayInfos set to true`, () => {
            beforeEach(() => {
                Logger.setConsoleOptions({
                    displayInfos: true
                });
            });

            it(`an info should be displayed`, () => {
                Logger.info('test');
                expect(console.info).toHaveBeenCalled();
            });
        });

        describe(`Given the option displayInfos set to false`, () => {
            beforeEach(() => {
                Logger.setConsoleOptions({
                    displayInfos: false
                });
            });

            it(`an info shouldn't be displayed`, () => {
                Logger.info('test');
                expect(console.info).not.toHaveBeenCalled();
            });
        });
    });
});
