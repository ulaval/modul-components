import { shallow, Wrapper } from '@vue/test-utils';

import { renderComponent } from '../../../../tests/helpers/render';
import { MTableBody } from './table-body';

const EMPTY_DATA: any = [];
const FULL_DATA: any = [
    { name: 'Bob', age: '18yo' },
    { name: 'Bill', age: '81yo' }
];
let rows: any = [];

let wrapper: Wrapper<MTableBody>;

const initializeShallowWrapper: any = () => {
    wrapper = shallow(MTableBody, {
        propsData: {
            rows
        }
    });
};

describe(`MTableBody`, () => {

    describe(`When the rows are empty`, () => {

        beforeEach(() => {
            rows = EMPTY_DATA;
            initializeShallowWrapper();
        });

        it(`Should render correctly`, () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        it(`Then should be empty`, () => {
            expect(wrapper.vm.isEmpty).toBeTruthy();
        });

    });

    describe(`When the rows are not empty`, () => {

        beforeEach(() => {
            rows = FULL_DATA;
            initializeShallowWrapper();
        });

        it(`Should render correctly`, () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        it(`Then should not be empty`, () => {
            expect(wrapper.vm.isEmpty).toBeFalsy();
        });

    });

});
