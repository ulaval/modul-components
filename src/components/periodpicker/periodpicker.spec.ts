import { shallowMount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { renderComponent } from '../../../tests/helpers/render';
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
    expect(wrapper.vm.selecting).toBe(false);
    expect(wrapper.vm.fromIsFocused).toBe(false);
    expect(wrapper.vm.toIsFocused).toBe(false);

    if (expectedValue) {
        expect(wrapper.emitted('input')[0][0]).toEqual(expectedValue);
    }
};

const expectNoSelectionEnd: () => void = () => {
    expect(wrapper.vm.selecting).toBe(true);
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

    it(`should render correctly`, () => {
        initializeWrapper();

        expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
    });

    it(`should show closed / unfocused pickers by default`, () => {
        initializeWrapper();

        expect(currentFromScopeProps.props.focus).toBe(false);
        expect(currentToScopeProps.props.focus).toBe(false);
    });

    it(`should open dateFrom picker only when opening dateFrom picker`, () => {
        initializeWrapper();

        currentFromScopeProps.handlers.open();

        expect(currentFromScopeProps.props.focus).toBe(true);
        expect(currentToScopeProps.props.focus).toBe(false);
    });

    it(`should open dateTo picker only when opening dateTo picker`, () => {
        initializeWrapper();

        currentToScopeProps.handlers.open();

        expect(currentFromScopeProps.props.focus).toBe(false);
        expect(currentToScopeProps.props.focus).toBe(true);
    });

    it(`should end selection when closing dateFrom picker without changing any value`, () => {
        initializeWrapper();

        currentFromScopeProps.handlers.open();
        currentFromScopeProps.handlers.close();

        expectSelectionEnd();
    });

    it(`should end selection when closing dateTo picker without changing any value`, () => {
        initializeWrapper();

        currentToScopeProps.handlers.open();
        currentToScopeProps.handlers.close();

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

            expect(currentFromScopeProps.props.value).toBe(undefined);
            expect(currentFromScopeProps.props.min).toBe(undefined);
            expect(currentFromScopeProps.props.max).toBe(undefined);
        });

        it(`should pass down empty data to the second date`, () => {
            initializeWrapper();

            expect(currentToScopeProps.props.value).toBe(undefined);
            expect(currentToScopeProps.props.min).toBe(undefined);
            expect(currentToScopeProps.props.max).toBe(undefined);
        });

        describe(`given dateFrom selector is open`, () => {
            beforeEach(() => {
                initializeWrapper();
                currentFromScopeProps.handlers.open();
            });

            it(`should end selection when emptying the value`, () => {
                currentFromScopeProps.handlers.change(undefined);

                expectSelectionEnd({ from: undefined, to: undefined });
            });

            it(`should not end selection and start dateTo pick when changing dateFrom the value`, () => {
                currentFromScopeProps.handlers.change(new Date());

                expectNoSelectionEnd();
                expect(wrapper.vm.fromIsFocused).toBe(false);
                expect(wrapper.vm.toIsFocused).toBe(true);
            });

            it(`should display newly selected date when changing dateFrom value`, () => {
                const newFromDate: Date = new Date();
                currentFromScopeProps.handlers.change(newFromDate);

                expect(currentFromScopeProps.props.value).toEqual(newFromDate);
            });

            it(`should emit the new value when closing dateTo picker`, () => {
                const newFromDate: Date = new Date();
                currentFromScopeProps.handlers.change(newFromDate);
                currentToScopeProps.handlers.close();

                expectSelectionEnd({ from: newFromDate, to: undefined });
            });

            it(`should emit the new value when changing dateToValue`, () => {
                const newFromDate: Date = new Date();
                const newToDate: Date = new Date();
                currentFromScopeProps.handlers.change(newFromDate);
                currentToScopeProps.handlers.change(newToDate);

                expectSelectionEnd({ from: newFromDate, to: new ModulDate(newToDate).endOfDay() });
            });
        });

        describe(`given dateTo selector is open`, () => {
            beforeEach(() => {
                initializeWrapper();
                currentToScopeProps.handlers.open();
            });

            it(`should end selection when emptying the value`, () => {
                currentToScopeProps.handlers.change(undefined);

                expectSelectionEnd({ from: undefined, to: undefined });
            });

            it(`should emit the new value when changing dateToValue`, () => {
                const newToDate: Date = new Date();
                currentToScopeProps.handlers.change(newToDate);

                expectSelectionEnd({ from: undefined, to: new ModulDate(newToDate).endOfDay() });
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

            expect(currentFromScopeProps.props.value).toBe(fromDateProp);
            expect(currentFromScopeProps.props.min).toBe(minDateProp);
            expect(currentFromScopeProps.props.max).toBe(maxDateProp);
        });

        it(`should pass down empty data to the second date`, () => {
            initializeWrapper();

            expect(currentToScopeProps.props.value).toBe(toDateProp);
            expect(currentToScopeProps.props.min).toBe(fromDateProp);
            expect(currentToScopeProps.props.max).toBe(maxDateProp);
        });

        describe(`given dateFrom selector is open`, () => {
            beforeEach(() => {
                initializeWrapper();
                currentFromScopeProps.handlers.open();
            });

            it(`should end selection when emptying the value`, () => {
                currentFromScopeProps.handlers.change(undefined);

                expectSelectionEnd({ from: undefined, to: toDateProp });
            });

            it(`should not end selection and start dateTo pick when changing dateFrom the value`, () => {
                currentFromScopeProps.handlers.change(new Date());

                expectNoSelectionEnd();
                expect(wrapper.vm.fromIsFocused).toBe(false);
                expect(wrapper.vm.toIsFocused).toBe(true);
            });

            it(`should display newly selected date when changing dateFrom value`, () => {
                const newFromDate: Date = new Date();
                currentFromScopeProps.handlers.change(newFromDate);

                expect(currentFromScopeProps.props.value).toEqual(newFromDate);
            });

            it(`should emit the new value when closing dateTo picker`, () => {
                const newFromDate: Date = new Date();
                currentFromScopeProps.handlers.change(newFromDate);
                currentToScopeProps.handlers.close();

                expectSelectionEnd({ from: newFromDate, to: toDateProp });
            });

            it(`should emit the new value when changing dateToValue`, () => {
                const newFromDate: Date = new Date();
                const newToDate: Date = new Date();
                currentFromScopeProps.handlers.change(newFromDate);
                currentToScopeProps.handlers.change(newToDate);

                expectSelectionEnd({ from: newFromDate, to: new ModulDate(newToDate).endOfDay() });
            });
        });

        describe(`given dateTo selector is open`, () => {
            beforeEach(() => {
                initializeWrapper();
                currentToScopeProps.handlers.open();
            });

            it(`should end selection when emptying the value`, () => {
                currentToScopeProps.handlers.change(undefined);

                expectSelectionEnd({ from: fromDateProp, to: undefined });
            });

            it(`should emit the new value when changing dateToValue`, () => {
                const newToDate: Date = new Date();
                currentToScopeProps.handlers.change(newToDate);

                expectSelectionEnd({ from: fromDateProp, to: new ModulDate(newToDate).endOfDay() });
            });
        });
    });
});
