import { RefSelector, shallowMount, Wrapper } from '@vue/test-utils';
import { renderComponent } from '../../../tests/helpers/render';
import { DATEPICKER_NAME, PERIODPICKER_NAME } from '../component-names';
import { MPeriodPickerProps } from '../periodpicker/periodpicker';
import { MDaterangepicker } from './daterangepicker';

const PERIODPICKER_REF: RefSelector = { ref: 'periodpicker' };

let wrapper: Wrapper<MDaterangepicker>;

const initializeWrapper: () => Wrapper<MDaterangepicker> = () => {
    wrapper = shallowMount(MDaterangepicker, {
        stubs: {
            [DATEPICKER_NAME]: true,
            [PERIODPICKER_NAME]: {
                template: `
                <${PERIODPICKER_NAME}-stub>
                    <slot name="first"></slot>
                    <slot name="second"></slot>
                </${PERIODPICKER_NAME}-stub>`,
                props: Object.keys(new MPeriodPickerProps())
            }
        }
    });

    return wrapper;
};

beforeEach(() => {
    wrapper = undefined as any;
});

describe(`m-daterangepicker`, () => {
    it(`should render correctly`, () => {
        initializeWrapper();

        expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
    });

    describe(`considering all periodpicker props are present`, () => {
        const periodpickerProps: MPeriodPickerProps = new MPeriodPickerProps({ from: new Date(), to: new Date() }, 'minProp', 'maxProp');

        it(`should pass down its props to the periodpicker`, () => {
            initializeWrapper();
            wrapper.setProps(periodpickerProps);

            expect(wrapper.find(PERIODPICKER_REF).props()).toEqual(periodpickerProps);
        });
    });

    describe(`considering custom labels are provided`, () => {
        const labelFrom: string = 'labelFrom';
        const labelTo: string = 'labelTo';

        it(`should render them correctly`, () => {
            initializeWrapper();
            wrapper.setProps({ labelFrom, labelTo });

            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });
    });

    it(`should emit input event when periodpicker value is updated`, () => {
        const newValue: string = 'newValue';

        initializeWrapper();
        wrapper.find(PERIODPICKER_REF).vm.$emit('input', newValue);

        expect(wrapper.emitted('input')[0][0]).toBe(newValue);
    });
});
