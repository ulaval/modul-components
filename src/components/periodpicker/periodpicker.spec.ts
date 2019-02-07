import { shallowMount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { renderComponent } from '../../../tests/helpers/render';
import { DatePickerSupportedTypes } from './../datepicker/datepicker';
import PeriodpickerPlugin, { MPeriodpicker, MPeriodpickerFromSlotProps, MPeriodpickerToSlotProps } from './periodpicker';

let wrapper: Wrapper<MPeriodpicker>;
let fromDateProp: DatePickerSupportedTypes;
let toDateProp: DatePickerSupportedTypes;
let minDateProp: DatePickerSupportedTypes;
let maxDateProp: DatePickerSupportedTypes;

let currentFromScopeProps: MPeriodpickerFromSlotProps;
let currentToScopeProps: MPeriodpickerToSlotProps;
let isMqMinSValue: boolean = false;

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
        },
        computed: {
            isMqMinS: { get(): boolean { return isMqMinSValue; } }
        }
    });

    return wrapper;
};

beforeEach(() => {
    Vue.use(PeriodpickerPlugin);

    wrapper = undefined as any;
    fromDateProp = undefined as any;
    toDateProp = undefined as any;
    minDateProp = undefined as any;
    maxDateProp = undefined as any;

    isMqMinSValue = false;

    currentFromScopeProps = undefined as any;
});

describe(`m-periodpicker`, () => {
    it(`should render correctly`, () => {
        initializeWrapper();

        expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
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

        it(`should update periodpicker value when datefrom change`, () => {
            initializeWrapper();

            const newDateFromValue: DatePickerSupportedTypes = new Date();
            currentFromScopeProps.handlers.change(newDateFromValue);

            expect(wrapper.emitted('input')[0][0]).toEqual({
                from: newDateFromValue,
                to: undefined
            });
        });

        it(`should update periodpicker value when dateTo change`, () => {
            initializeWrapper();
            const newDateToValue: DatePickerSupportedTypes = new Date();

            currentToScopeProps.handlers.change(newDateToValue);

            expect(wrapper.emitted('input')[0][0]).toEqual({
                from: undefined,
                to: newDateToValue
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

        it(`should pass down data to the first date`, () => {
            initializeWrapper();

            expect(currentFromScopeProps.props.value).toBe(fromDateProp);
            expect(currentFromScopeProps.props.min).toBe(minDateProp);
            expect(currentFromScopeProps.props.max).toBe(maxDateProp);
        });

        it(`should pass down data to the second date`, () => {
            initializeWrapper();

            expect(currentToScopeProps.props.value).toBe(toDateProp);
            expect(currentToScopeProps.props.min).toBe(fromDateProp);
            expect(currentToScopeProps.props.max).toBe(maxDateProp);
        });

        it(`should update periodpicker value when datefrom change`, () => {
            initializeWrapper();

            const newDateFromValue: DatePickerSupportedTypes = new Date();
            currentFromScopeProps.handlers.change(newDateFromValue);

            expect(wrapper.emitted('input')[0][0]).toEqual({
                from: newDateFromValue,
                to: toDateProp
            });
        });

        it(`should update periodpicker value when dateTo change`, () => {
            initializeWrapper();
            const newDateToValue: DatePickerSupportedTypes = new Date();

            currentToScopeProps.handlers.change(newDateToValue);

            expect(wrapper.emitted('input')[0][0]).toEqual({
                from: fromDateProp,
                to: newDateToValue
            });
        });
    });

    describe(`given current device is not a small screen`, () => {
        beforeEach(() => {
            isMqMinSValue = true;
        });

        it(`should focus the second date when datefrom change and device is not mobile`, async () => {
            initializeWrapper();

            const newDateFromValue: DatePickerSupportedTypes = new Date();
            currentFromScopeProps.handlers.change(newDateFromValue);
            await wrapper.vm.$nextTick();

            expect(currentToScopeProps.props.focus).toBe(true);
        });

        it(`should unfocus the second date when the first date is opened`, () => {
            initializeWrapper();

            currentFromScopeProps.handlers.change(new Date());
            currentFromScopeProps.handlers.open();

            expect(currentToScopeProps.props.focus).toBe(false);
        });

        it(`should unfocus the second date when the second date is closed`, () => {
            initializeWrapper();

            currentFromScopeProps.handlers.change(new Date());
            currentToScopeProps.handlers.close();

            expect(currentToScopeProps.props.focus).toBe(false);
        });

        it(`should unfocus the second date when it's value is changed`, () => {
            initializeWrapper();

            currentFromScopeProps.handlers.change(new Date());
            currentToScopeProps.handlers.change(new Date());

            expect(currentToScopeProps.props.focus).toBe(false);
        });
    });

    describe(`given current device is> a small screen`, () => {
        beforeEach(() => {
            isMqMinSValue = false;
        });

        it(`should not focus the second date when datefrom change and device is mobile`, () => {
            initializeWrapper();

            const newDateFromValue: DatePickerSupportedTypes = new Date();
            currentFromScopeProps.handlers.change(newDateFromValue);

            expect(currentToScopeProps.props.focus).toBe(false);
        });
    });
});
