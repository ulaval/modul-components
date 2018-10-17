import { shallow, Wrapper } from '@vue/test-utils';
import { MTableHeaderCell } from './table-header-cell';
import { renderComponent } from '../../../../tests/helpers/render';

let wrapper: Wrapper<MTableHeaderCell>;

let width: string = '';

const initializeShallowWrapper: any = () => {
    wrapper = shallow(MTableHeaderCell, {
        propsData: {
            width
        }
    });
};

describe(`Given a header`, () => {

    describe(`When the width is defined`, () => {

        beforeEach(() => {
            width = '25%';
            initializeShallowWrapper();
        });

        it(`Should render correctly`, () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        it(`Then should set the width of the column`, () => {
            expect(wrapper.vm.propWidth).toEqual({ width });
        });

    });

    describe(`When the width is undefined`, () => {

        beforeEach(() => {
            width = '';
            initializeShallowWrapper();
        });

        it(`Should render correctly`, () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        it(`Then should not set a width`, () => {
            expect(wrapper.vm.propWidth).toEqual(undefined);
        });

    });
});
