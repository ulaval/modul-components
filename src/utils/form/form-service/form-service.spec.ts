import { Form } from '../form';
import { FormField } from '../form-field/form-field';
import { MFormEventParams, MFormEvents, MFormListener, MFormService } from './form-service';


describe(`The form service`, () => {
    let form: Form = new Form({ 'field': new FormField(() => 'string') });
    let mockCallBack: jest.Mock = jest.fn();
    let callback: (params?: MFormEventParams) => void = mockCallBack;
    let formListener: MFormListener = new MFormListener(MFormEvents.formError, callback);
    describe(`Given the service has no subscribed listener`, () => {
        it(`When it is subscribed to, then the listener is added to the list`, () => {
            let formService: MFormService = new MFormService();

            formService.subscribe(formListener);

            expect(formService.listeners.length).toBe(1);
        });
    });

    describe(`Given the service has one subscribed listener to one particular event`, () => {
        let formService: MFormService;
        beforeEach(() => {
            formService = new MFormService();
            formService.subscribe(formListener);
            mockCallBack.mockClear();
        });

        describe('When that particular event is emitted', () => {
            it(`Then it should trigger the callback`, () => {
                const PARAMS: any = {};
                formService.emit(MFormEvents.formError, PARAMS);

                expect(mockCallBack).toHaveBeenCalledWith(PARAMS);
            });
        });

        describe('When another event is emitted', () => {
            it(`Then it should not trigger the callback`, () => {
                const PARAMS: any = {};
                formService.emit(MFormEvents.formErrorClear, PARAMS);

                expect(mockCallBack).toHaveBeenCalledTimes(0);
            });
        });
    });
});
