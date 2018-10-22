import { shallow, Wrapper } from '@vue/test-utils';

import { renderComponent } from '../../../../tests/helpers/render';
import { MTableEmpty } from './table-empty';

let slots: any = {};
const slot: string = '<div>slot</div>';

let wrapper: Wrapper<MTableEmpty>;

const initializeShallowWrapper: any = () => {
    wrapper = shallow(MTableEmpty, {
        slots
    });
};

describe(`MTableEmpty`, () => {

    describe(`When no slot is provided`, () => {

        beforeEach(() => {
            slots = {};
            initializeShallowWrapper();
        });

        it(`Should render correctly`, () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        it(`Then show the default empty message`, () => {
            expect(wrapper.vm.hasSlot).toBeFalsy();
        });

    });

    describe(`When a slot is provided`, () => {

        beforeEach(() => {
            slots = {
                default: slot
            };
            initializeShallowWrapper();
        });

        it(`Should render correctly`, () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        it(`Then show the slot`, () => {
            expect(wrapper.vm.hasSlot).toBeTruthy();
        });

    });

});
