import { shallowMount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import ModulDate from '../../utils/modul-date/modul-date';
import { DatePickerSupportedTypes } from './../datepicker/datepicker';
import PeriodpickerPlugin, { MDateRange, MPeriodpicker, MPeriodpickerFromSlotProps, MPeriodpickerToSlotProps } from './periodpicker';

let wrapper: Wrapper<MPeriodpicker>;
let fromDateProp: DatePickerSupportedTypes;
let toDateProp: DatePickerSupportedTypes;
let minDateProp: DatePickerSupportedTypes;
let maxDateProp: DatePickerSupportedTypes;

let currentFromScopeProps: MPeriodpickerFromSlotProps;
let currentToScopeProps: MPeriodpickerToSlotProps;

const initializeWrapper: () => Wrapper<MPeriodpicker> = () => {
    wrapper = shallowMount(MPeriodpicker, {
        propsData: {
            value: {
                from: fromDateProp,
                to: toDateProp
            },
            min: minDateProp,
            max: maxDateProp
        },
        scopedSlots: {
            first(props: MPeriodpickerFromSlotProps): void {
                currentFromScopeProps = props;
            },
            second(props: MPeriodpickerToSlotProps): void {
                currentToScopeProps = props;
            }
        }
    });

    return wrapper;
};

const expectSelectionEnd: (expectedValue?: MDateRange) => void = (expectedValue: MDateRange) => {
    expect(wrapper.vm.fromIsFocused).toBe(false);
    expect(wrapper.vm.toIsFocused).toBe(false);

    if (expectedValue) {
        expect(wrapper.emitted('input')[0][0]).toEqual(expectedValue);
    }
};

const expectNoSelectionEnd: () => void = () => {
    expect(wrapper.emitted('input')).toBeUndefined();
};

describe(`m-periodpicker`, () => {
    beforeEach(() => {
        Vue.use(PeriodpickerPlugin);

        wrapper = undefined as any;
        fromDateProp = undefined as any;
        toDateProp = undefined as any;
        minDateProp = undefined as any;
        maxDateProp = undefined as any;

        currentFromScopeProps = undefined as any;
    });

    it(`should show closed / unfocused pickers by default`, () => {
        initializeWrapper();

        expect(currentFromScopeProps.props.focus).toBe(false);
        expect(currentToScopeProps.props.focus).toBe(false);
    });

    it(`should open dateFrom picker only when opening dateFrom picker`, async () => {
        initializeWrapper();

        currentFromScopeProps.handlers.change('2018-04-24');

        await Vue.nextTick();

        expect(currentFromScopeProps.props.focus).toBe(false);
        expect(currentToScopeProps.props.focus).toBe(true);
    });


    it(`should end selection when closing dateFrom picker without changing any value`, () => {
        initializeWrapper();

        expectSelectionEnd();
    });


    it(`should end selection when emptying dateFrom picker value`, () => {
        initializeWrapper();

        currentFromScopeProps.handlers.change(undefined);

        expectSelectionEnd();
    });

    it(`should end selection when emptying dateTo picker value`, () => {
        initializeWrapper();

        currentToScopeProps.handlers.change(undefined);

        expectSelectionEnd();
    });

    describe(`given no props are provided`, () => {
        it(`should pass down empty data to the first date`, () => {
            initializeWrapper();

            expect(currentFromScopeProps.props.value).toBe('');
            expect(currentFromScopeProps.props.min).toBe(undefined);
            expect(currentFromScopeProps.props.max).toBe(undefined);
        });

        it(`should pass down empty data to the second date`, () => {
            initializeWrapper();

            expect(currentToScopeProps.props.value).toBe('');
            expect(currentToScopeProps.props.min).toBe(undefined);
            expect(currentToScopeProps.props.max).toBe(undefined);
        });

        describe(`given dateFrom selector is open`, () => {
            beforeEach(() => {
                initializeWrapper();
            });

            it(`should end selection when emptying the value`, () => {
                currentFromScopeProps.handlers.change(undefined);
                currentFromScopeProps.handlers.blur();

                expectSelectionEnd(new MDateRange(undefined, undefined, true));
            });

            it(`should emit the new value when changing dateToValue`, async () => {
                const newFromDate: Date = new Date();
                const newToDate: Date = new Date();
                currentFromScopeProps.handlers.change(newFromDate);
                currentFromScopeProps.handlers.blur();
                currentToScopeProps.handlers.change(newToDate);
                currentToScopeProps.handlers.blur();
                await Vue.nextTick();
                expectSelectionEnd(new MDateRange(new ModulDate(newFromDate).beginOfDay(), new ModulDate(newToDate).endOfDay(), true));
            });
        });

        describe(`given dateTo selector is open`, () => {
            beforeEach(() => {
                initializeWrapper();
            });

            it(`should end selection when emptying the value`, () => {
                currentToScopeProps.handlers.change(undefined);
                currentToScopeProps.handlers.blur();
                expectSelectionEnd(new MDateRange(undefined, undefined, true));
            });

            it(`should emit the new value when changing dateToValue`, async () => {
                const newToDate: Date = new Date();
                currentToScopeProps.handlers.change(newToDate);
                currentToScopeProps.handlers.blur();
                await Vue.nextTick();
                expectSelectionEnd(new MDateRange(undefined, new ModulDate(newToDate).endOfDay(), true));
            });
        });
    });

    describe(`given all props are provided`, () => {
        beforeEach(() => {
            fromDateProp = new Date();
            toDateProp = new Date(new Date().setDate(fromDateProp.getDate() + 1));
            minDateProp = new Date(new Date().setFullYear(fromDateProp.getFullYear() - 1));
            maxDateProp = new Date(new Date().setFullYear(fromDateProp.getFullYear() + 1));
        });

        it(`should pass down empty data to the first date`, () => {
            initializeWrapper();

            expect(currentFromScopeProps.props.value).toBe(MPeriodpicker.formatIsoDateToLocalString(fromDateProp));
            expect(currentFromScopeProps.props.min).toBe(minDateProp);
            expect(currentFromScopeProps.props.max).toBe(maxDateProp);
        });

        it(`should pass down empty data to the second date`, () => {
            initializeWrapper();

            expect(currentToScopeProps.props.value).toBe(MPeriodpicker.formatIsoDateToLocalString(toDateProp));
            expect(currentToScopeProps.props.min).toBe(MPeriodpicker.formatIsoDateToLocalString(fromDateProp));
            expect(currentToScopeProps.props.max).toBe(maxDateProp);
        });

        describe(`given dateFrom selector is open`, () => {
            beforeEach(() => {
                initializeWrapper();
            });

            it(`should end selection when emptying the value`, () => {
                currentFromScopeProps.handlers.change(undefined);
                currentFromScopeProps.handlers.blur();

                expectSelectionEnd(new MDateRange(undefined, new ModulDate(toDateProp).endOfDay(), true));
            });

            it(`should not end selection and start dateTo pick when changing dateFrom the value`, () => {
                currentFromScopeProps.handlers.change(new Date());

                expectNoSelectionEnd();
                expect(wrapper.vm.fromIsFocused).toBe(false);
                expect(wrapper.vm.toIsFocused).toBe(true);
            });

            it(`should emit the new value when changing dateToValue`, () => {
                const newFromDate: Date = new Date();
                const newToDate: Date = new Date();
                currentFromScopeProps.handlers.change(newFromDate);
                currentFromScopeProps.handlers.blur();
                currentToScopeProps.handlers.change(newToDate);
                currentToScopeProps.handlers.blur();
                expectSelectionEnd(new MDateRange(new ModulDate(newFromDate).beginOfDay(), new ModulDate(newToDate).endOfDay(), true));
            });
        });

        describe(`given dateTo selector is open`, () => {
            beforeEach(() => {
                initializeWrapper();
            });

            it(`should end selection when emptying the value`, () => {
                currentToScopeProps.handlers.change(undefined);
                currentToScopeProps.handlers.blur();

                expectSelectionEnd(new MDateRange(new ModulDate(fromDateProp).beginOfDay(), undefined, true));
            });

            it(`should emit the new value when changing dateToValue`, () => {
                const newToDate: Date = new Date();
                currentToScopeProps.handlers.change(newToDate);
                currentToScopeProps.handlers.blur();
                expectSelectionEnd(new MDateRange(new ModulDate(fromDateProp).beginOfDay(), new ModulDate(newToDate).endOfDay(), true));
            });
        });
    });
});
