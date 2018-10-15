import { MTable, TableHeader } from './table';
import { shallow, Wrapper } from '@vue/test-utils';
import { renderComponent } from '../../../tests/helpers/render';

let data: any[];
let headers: TableHeader[];
let rowsMax: number;

const width: string = '10%';
const data1: any = { data: '1' };

const DATA_WITH_4_ROWS: any[] = [
    data1,
    { data: '2' },
    { data: '3' },
    { data: '4' }
];

const HEADER_WITH_WIDTH: TableHeader = {
    slot: 'test',
    title: 'Test',
    width
};

const HEADER_WITHOUT_WIDTH: TableHeader = {
    slot: 'test2',
    title: 'Test2'
};

const COMPLETE_HEADERS: TableHeader[] = [HEADER_WITH_WIDTH, HEADER_WITHOUT_WIDTH];

let wrapper: Wrapper<MTable>;

const initializeShallowWrapper: any = () => {
    wrapper = shallow(MTable, {
        propsData: {
            headers,
            data,
            rowsMax
        }
    });
};

afterEach(() => {
    data = [];
    headers = [];
    rowsMax = 50;
});

describe(`MTable`, () => {

    beforeEach(() => {
        headers = COMPLETE_HEADERS;
        data = DATA_WITH_4_ROWS;
    });

    describe(`Given a header`, () => {

        beforeEach(() => {
            initializeShallowWrapper();
        });

        describe(`When the width is defined`, () => {

            it(`Then should set the width of the column`, () => {
                expect(wrapper.vm.getWidth(HEADER_WITH_WIDTH)).toEqual({ width });
            });

        });

        describe(`When the width is undefined`, () => {

            it(`Then should not set a width`, () => {
                expect(wrapper.vm.getWidth(HEADER_WITHOUT_WIDTH)).toEqual({ width: '' });
            });

        });
    });

    describe(`Given a table full of data`, () => {

        describe(`When rowsMax < data.length`, () => {

            beforeEach(() => {
                rowsMax = 2;
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
                rowsMax = 8;
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
