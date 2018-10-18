import { MTable } from './table';
import { shallow, Wrapper } from '@vue/test-utils';
import { renderComponent } from '../../../tests/helpers/render';

let data: any[];
let maxRows: number;

const width: string = '10%';
const data1: any = { data: '1' };

const DATA_WITH_4_ROWS: any[] = [
    data1,
    { data: '2' },
    { data: '3' },
    { data: '4' }
];

let wrapper: Wrapper<MTable>;

const initializeShallowWrapper: any = () => {
    wrapper = shallow(MTable, {
        propsData: {
            data,
            maxRows
        }
    });
};

afterEach(() => {
    maxRows = 50;
});

describe(`MTable`, () => {

    beforeEach(() => {
        data = DATA_WITH_4_ROWS;
    });

    describe(`Given a table full of data`, () => {

        describe(`When rowsMax < data.length`, () => {

            beforeEach(() => {
                maxRows = 2;
                initializeShallowWrapper();
            });

            it(`Should render correctly`, () => {
                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });

            it(`Then show a number of rows equal to rowsMax`, () => {
                expect(wrapper.vm.propRows).toEqual(2);
            });

        });

        describe(`When rowsMax > data.length`, () => {

            beforeEach(() => {
                maxRows = 8;
                initializeShallowWrapper();
            });

            it(`Should render correctly`, () => {
                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });

            it(`Then show a number of rows equal to the legnth of data`, () => {
                expect(wrapper.vm.propRows).toEqual(4);
            });

        });

        describe(`When looping the data`, () => {

            it(`Then should return the right data`, () => {
                initializeShallowWrapper();

                expect(wrapper.vm.getDataValue(1)).toEqual(data1);
            });

        });

    });

});
