import { MToast } from '../../components/toast/toast';
import ToastService, { ToastParams } from './toast-service';

let mockToast: any = {};
jest.mock('../../components/toast/toast', () => {
    return {
        MToast: jest.fn().mockImplementation(() => {
            return mockToast;
        })
    };
});

const mockCreateElement: jest.Mock = jest.fn();
// tslint:disable-next-line: deprecation
document.createElement = mockCreateElement;

const simpleToastParams: ToastParams = {
    text: 'txt'
};

describe(`The Toast Manager`, () => {
    let toastManager: ToastService;
    beforeEach(() => {
        mockToast = {
            text: '1st',
            $createElement: jest.fn(),
            $slots: {},
            $destroy: jest.fn(),
            $on: jest.fn()
        };
        toastManager = new ToastService();
        mockCreateElement.mockClear();
        ((MToast as unknown) as jest.Mock).mockClear();
    });

    describe(`Given the service has never been called`, () => {

        it(`should not have a toast`, () => {
            expect(toastManager.activeToast).toBeFalsy();
        });

        it(`When the service is called to show a toast, it should show a Toast`, () => {
            toastManager.show(simpleToastParams);

            expect(toastManager.activeToast).toBeTruthy();

            // tslint:disable-next-line: deprecation
            expect(document.createElement).toHaveBeenCalledTimes(1);
            // tslint:disable-next-line: deprecation
            expect(document.createElement).toHaveBeenCalledWith('div');
        });

    });

    describe(`Given the service has been called once`, () => {
        let firstToast: MToast;
        const secondToastParams: ToastParams = {
            text: 'otherTxt'
        };
        beforeEach(() => {
            toastManager.show(simpleToastParams);
            firstToast = { ...toastManager.activeToast } as any;
        });

        describe(`When the service is called twice`, () => {
            it(`should only show one toast`, () => {
                toastManager.show(secondToastParams);

                expect(toastManager.toasts.length).toBe(1);
            });

            it(`should change the toast`, () => {
                toastManager.show(secondToastParams);

                const secondToast: MToast = toastManager.activeToast!;
                expect(firstToast).not.toBe(secondToast);
            });
        });

        describe(`When the service is called to clear the toast`, () => {
            it(`Should contain no toasts`, () => {
                toastManager.clear();

                expect(toastManager.toasts.length).toBe(0);
            });

            it(`Should contain no active toast`, () => {
                toastManager.clear();

                expect(toastManager.activeToast).toBeFalsy();
            });
        });

    });

});
